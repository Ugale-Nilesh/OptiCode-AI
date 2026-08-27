import ast
from collections import defaultdict
from typing import List, Optional
from app.analyzers.base import BaseAnalyzer
from app.schemas.analysis import Finding, ResultStatus, Severity

_LOOP_TYPES = (ast.For, ast.While)


def _is_sort_call(node: ast.AST) -> bool:
    if not isinstance(node, ast.Call):
        return False
    func = node.func
    if isinstance(func, ast.Attribute) and func.attr == "sort":
        return True
    if isinstance(func, ast.Name) and func.id == "sorted":
        return True
    return False


def _collect_calls_excluding_nested_loops(node: ast.AST) -> List[ast.Call]:
    calls: List[ast.Call] = []
    for child in ast.iter_child_nodes(node):
        if isinstance(child, ast.Call):
            calls.append(child)
        if isinstance(child, _LOOP_TYPES):
            continue
        calls.extend(_collect_calls_excluding_nested_loops(child))
    return calls


class PythonAnalyzer(BaseAnalyzer):
    def validate(self, code: str) -> Optional[str]:
        try:
            ast.parse(code)
        except SyntaxError as e:
            return f"Python syntax error: {e.msg} (line {e.lineno})"
        return None

    def analyze(self, code: str) -> List[Finding]:
        findings: List[Finding] = []
        try:
            tree = ast.parse(code)
        except SyntaxError:
            return findings

        source_lines = code.splitlines()

        def evidence_for(lineno: int) -> Optional[str]:
            if 1 <= lineno <= len(source_lines):
                return source_lines[lineno - 1].strip()
            return None

        for node in ast.walk(tree):
            if not isinstance(node, _LOOP_TYPES):
                continue

            for inner in ast.walk(node):
                if inner is node:
                    continue
                if isinstance(inner, _LOOP_TYPES):
                    findings.append(
                        Finding(
                            type="nested_loop",
                            severity=Severity.medium,
                            confidence=ResultStatus.detected,
                            location=f"line {node.lineno}",
                            description=(
                                "This loop contains another loop nested inside it. "
                                "Nested loops often lead to higher time complexity "
                                "(e.g. O(n^2) or worse) and may indicate an "
                                "opportunity to restructure the logic."
                            ),
                            evidence=evidence_for(node.lineno),
                        )
                    )
                    break

            for inner in ast.walk(node):
                if inner is node:
                    continue
                if _is_sort_call(inner):
                    findings.append(
                        Finding(
                            type="repeated_sort",
                            severity=Severity.medium,
                            confidence=ResultStatus.detected,
                            location=f"line {inner.lineno}",
                            description=(
                                "A sort operation is being performed inside a loop. "
                                "Sorting repeatedly on each iteration is usually "
                                "unnecessary and can often be moved outside the loop "
                                "or done once before iterating."
                            ),
                            evidence=evidence_for(inner.lineno),
                        )
                    )

            own_calls = _collect_calls_excluding_nested_loops(node)
            groups = defaultdict(list)
            for call in own_calls:
                try:
                    key = ast.unparse(call)
                except Exception:
                    continue
                groups[key].append(call)

            for key, calls in groups.items():
                if len(calls) < 2:
                    continue
                first = min(calls, key=lambda c: c.lineno)
                findings.append(
                    Finding(
                        type="redundant_calculation",
                        severity=Severity.low,
                        confidence=ResultStatus.detected,
                        location=f"line {first.lineno}",
                        description=(
                            f"The expression '{key}' is computed more than once "
                            "inside this loop's body. If this call has no side "
                            "effects, computing it once and reusing the result "
                            "may avoid unnecessary repeated work."
                        ),
                        evidence=evidence_for(first.lineno),
                    )
                )

        return findings