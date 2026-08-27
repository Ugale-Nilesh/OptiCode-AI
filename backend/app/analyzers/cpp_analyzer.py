import re
from typing import List, Optional
from app.analyzers.base import BaseAnalyzer
from app.schemas.analysis import Finding, ResultStatus, Severity

_LOOP_RE = re.compile(r"\b(for|while)\s*\(")


def _line_at(code: str, index: int) -> int:
    return code.count("\n", 0, index) + 1


def _find_matching_paren(code: str, open_index: int) -> Optional[int]:
    depth = 0
    for i in range(open_index, len(code)):
        if code[i] == "(":
            depth += 1
        elif code[i] == ")":
            depth -= 1
            if depth == 0:
                return i
    return None


def _find_body_range(code: str, after_index: int):
    i = after_index
    while i < len(code) and code[i] in " \t\r\n":
        i += 1
    if i < len(code) and code[i] == "{":
        depth = 0
        start = i
        for j in range(i, len(code)):
            if code[j] == "{":
                depth += 1
            elif code[j] == "}":
                depth -= 1
                if depth == 0:
                    return (start, j)
        return (start, len(code) - 1)
    end = code.find(";", i)
    if end == -1:
        end = len(code) - 1
    return (i, end)


def _find_loops(code: str):
    loops = []
    for m in _LOOP_RE.finditer(code):
        paren_open = m.end() - 1
        paren_close = _find_matching_paren(code, paren_open)
        if paren_close is None:
            continue
        body_start, body_end = _find_body_range(code, paren_close + 1)
        loops.append(
            {
                "start": m.start(),
                "line": _line_at(code, m.start()),
                "body_start": body_start,
                "body_end": body_end,
            }
        )
    return loops


class CppAnalyzer(BaseAnalyzer):
    def validate(self, code: str) -> Optional[str]:
        if code.count("{") != code.count("}"):
            return "C++ validation: mismatched braces '{' / '}'."
        return None

    def analyze(self, code: str) -> List[Finding]:
        findings: List[Finding] = []
        source_lines = code.splitlines()

        def evidence_for(lineno: int) -> Optional[str]:
            if 1 <= lineno <= len(source_lines):
                return source_lines[lineno - 1].strip()
            return None

        loops = _find_loops(code)
        for outer in loops:
            outer_line = outer["line"]
            for inner in loops:
                if inner is outer:
                    continue
                if outer["body_start"] < inner["start"] < outer["body_end"]:
                    findings.append(
                        Finding(
                            type="nested_loop",
                            severity=Severity.medium,
                            confidence=ResultStatus.detected,
                            location=f"line {outer_line}",
                            description=(
                                "This loop contains another loop nested inside it. "
                                "Nested loops often lead to higher time complexity "
                                "(e.g. O(n^2) or worse) and may indicate an "
                                "opportunity to restructure the logic."
                            ),
                            evidence=evidence_for(outer_line),
                        )
                    )
                    break
        return findings