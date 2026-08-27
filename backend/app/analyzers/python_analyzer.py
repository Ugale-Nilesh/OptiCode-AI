import ast
from typing import List, Optional
from app.analyzers.base import BaseAnalyzer
from app.schemas.analysis import Finding, ResultStatus, Severity


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
        loop_types = (ast.For, ast.While)

        for node in ast.walk(tree):
            if not isinstance(node, loop_types):
                continue

            for inner in ast.walk(node):
                if inner is node:
                    continue
                if isinstance(inner, loop_types):
                    evidence_line = None
                    if 1 <= node.lineno <= len(source_lines):
                        evidence_line = source_lines[node.lineno - 1].strip()

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
                            evidence=evidence_line,
                        )
                    )
                    break

        return findings