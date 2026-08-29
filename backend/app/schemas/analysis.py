from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class Language(str, Enum):
    python = "python"
    cpp = "cpp"
    java = "java"


class ResultStatus(str, Enum):
    detected = "detected"
    ai_inferred = "ai_inferred"
    estimated = "estimated"
    unknown = "unknown"
    not_measured = "not_measured"


class Severity(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class AnalyzeRequest(BaseModel):
    language: Language
    code: str = Field(..., min_length=1)


class Finding(BaseModel):
    type: str
    severity: Severity
    confidence: ResultStatus
    location: Optional[str] = None
    description: str
    evidence: Optional[str] = None


class ComplexityEstimate(BaseModel):
    value: str
    status: ResultStatus


class Complexity(BaseModel):
    time: ComplexityEstimate
    space: ComplexityEstimate


class Suggestion(BaseModel):
    issue: str
    why_it_matters: str
    suggested_improvement: str
    expected_effect: str
    status: ResultStatus


class AnalyzeResponse(BaseModel):
    summary: str
    detected_findings: List[Finding] = []
    inferred_findings: List[Finding] = []
    complexity: Complexity
    suggestions: List[Suggestion] = []
    optimized_code: Optional[str] = None
    optimized_complexity: Optional[Complexity] = None
    optimization_explanation: Optional[str] = None
    comparison: List[str] = []
    assumptions: List[str] = []
    limitations: List[str] = []