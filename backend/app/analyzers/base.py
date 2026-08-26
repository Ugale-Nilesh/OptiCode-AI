from abc import ABC, abstractmethod
from typing import List, Optional
from app.schemas.analysis import Finding


class BaseAnalyzer(ABC):
    """Common interface every language analyzer must implement."""

    @abstractmethod
    def validate(self, code: str) -> Optional[str]:
        """Return an error message if the code is structurally invalid, else None."""
        raise NotImplementedError

    @abstractmethod
    def analyze(self, code: str) -> List[Finding]:
        """Run deterministic analysis and return structured findings."""
        raise NotImplementedError
