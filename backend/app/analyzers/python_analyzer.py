import ast
from typing import List, Optional
from app.analyzers.base import BaseAnalyzer
from app.schemas.analysis import Finding


class PythonAnalyzer(BaseAnalyzer):
    def validate(self, code: str) -> Optional[str]:
        try:
            ast.parse(code)
        except SyntaxError as e:
            return f"Python syntax error: {e.msg} (line {e.lineno})"
        return None

    def analyze(self, code: str) -> List[Finding]:
        return []
