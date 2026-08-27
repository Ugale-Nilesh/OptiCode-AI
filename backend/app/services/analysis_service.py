from fastapi import HTTPException
from app.schemas.analysis import (
    AnalyzeRequest, AnalyzeResponse, Complexity, ComplexityEstimate, ResultStatus,
)
from app.analyzers.python_analyzer import PythonAnalyzer
from app.analyzers.cpp_analyzer import CppAnalyzer
from app.analyzers.java_analyzer import JavaAnalyzer
from app.services.ai_service import get_ai_analysis

_ANALYZERS = {
    "python": PythonAnalyzer(),
    "cpp": CppAnalyzer(),
    "java": JavaAnalyzer(),
}


def run_analysis(request: AnalyzeRequest) -> AnalyzeResponse:
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty.")

    analyzer = _ANALYZERS.get(request.language.value)
    if analyzer is None:
        raise HTTPException(status_code=400, detail=f"Unsupported language: {request.language}")

    validation_error = analyzer.validate(request.code)
    if validation_error:
        raise HTTPException(status_code=422, detail=validation_error)

    detected_findings = analyzer.analyze(request.code)

    ai_result, ai_limitation = get_ai_analysis(request.code, request.language.value, detected_findings)

    assumptions = ["Deterministic analysis currently covers a limited rule set (e.g. nested loops)."]
    limitations = []

    if ai_result is not None:
        inferred_findings = ai_result.inferred_findings
        suggestions = ai_result.suggestions
        optimized_code = ai_result.optimized_code
        comparison = ai_result.comparison
        time_complexity = ai_result.time_complexity
        space_complexity = ai_result.space_complexity
        ai_summary_part = ai_result.code_summary
    else:
        inferred_findings, suggestions, optimized_code, comparison = [], [], None, []
        time_complexity = ComplexityEstimate(value="Unknown", status=ResultStatus.unknown)
        space_complexity = ComplexityEstimate(value="Unknown", status=ResultStatus.unknown)
        ai_summary_part = ""
        limitations.append(ai_limitation or "AI-powered reasoning was not available for this request.")

    finding_count = len(detected_findings)
    if finding_count:
        deterministic_part = f"Found {finding_count} deterministic finding(s) below."
    else:
        deterministic_part = "No deterministic findings detected by the current (limited) rule set."

    summary = f"Analyzed {request.language.value} code ({len(request.code.splitlines())} lines). {deterministic_part}"
    if ai_summary_part:
        summary += f" {ai_summary_part}"

    return AnalyzeResponse(
        summary=summary,
        detected_findings=detected_findings,
        inferred_findings=inferred_findings,
        complexity=Complexity(time=time_complexity, space=space_complexity),
        suggestions=suggestions,
        optimized_code=optimized_code,
        comparison=comparison,
        assumptions=assumptions,
        limitations=limitations,
    )