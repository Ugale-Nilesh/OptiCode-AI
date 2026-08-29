from abc import ABC, abstractmethod
from typing import List, Optional
from app.schemas.analysis import Finding, Suggestion, ComplexityEstimate


class AIAnalysisResult:
    """Structured output an AI provider must produce for one analysis request."""

    def __init__(
        self,
        code_summary: str,
        inferred_findings: List[Finding],
        suggestions: List[Suggestion],
        time_complexity: ComplexityEstimate,
        space_complexity: ComplexityEstimate,
        optimized_code: Optional[str],
        comparison: List[str],
        optimized_time_complexity: Optional[ComplexityEstimate] = None,
        optimized_space_complexity: Optional[ComplexityEstimate] = None,
        optimization_explanation: Optional[str] = None,
    ):
        self.code_summary = code_summary
        self.inferred_findings = inferred_findings
        self.suggestions = suggestions
        self.time_complexity = time_complexity
        self.space_complexity = space_complexity
        self.optimized_code = optimized_code
        self.comparison = comparison
        self.optimized_time_complexity = optimized_time_complexity
        self.optimized_space_complexity = optimized_space_complexity
        self.optimization_explanation = optimization_explanation


class AIProvider(ABC):
    """Common interface every AI provider implementation must satisfy."""

    @abstractmethod
    def analyze(
        self,
        code: str,
        language: str,
        deterministic_findings: List[Finding],
    ) -> AIAnalysisResult:
        """Run AI-powered reasoning over the code and return structured results.

        Implementations should raise on failure; callers are responsible for
        catching provider errors and falling back gracefully.
        """
        raise NotImplementedError