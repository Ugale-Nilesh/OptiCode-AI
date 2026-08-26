from typing import List, Optional
from app.analyzers.base import BaseAnalyzer
from app.schemas.analysis import Finding


class JavaAnalyzer(BaseAnalyzer):
    def validate(self, code: str) -> Optional[str]:
        if code.count("{") != code.count("}"):
            return "Java validation: mismatched braces '{' / '}'."
        return None

    def analyze(self, code: str) -> List[Finding]:
        return []
