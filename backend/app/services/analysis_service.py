from fastapi import HTTPException
from app.schemas.analysis import (
    AnalyzeRequest, AnalyzeResponse, Complexity, ComplexityEstimate, ResultStatus,
)
from app.analyzers.python_analyzer import PythonAnalyzer
from app.analyzers.cpp_analyzer import CppAnalyzer
from app.analyzers.java_analyzer import JavaAnalyzer

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

    inferred_findings, suggestions, optimized_code, comparison = [], [], None, []

    if detected_findings:
        summary = (
            f"Analyzed {request.language.value} code "
            f"({len(request.code.splitlines())} lines). "
            f"Found {len(detected_findings)} deterministic finding(s) below. "
            "AI-powered reasoning, complexity estimation, and optimization "
            "suggestions are not implemented yet."
        )
    else:
        summary = (
            f"Analyzed {request.language.value} code "
            f"({len(request.code.splitlines())} lines). "
            "No deterministic findings detected by the current (limited) rule set. "
            "AI-powered reasoning, complexity estimation, and optimization "
            "suggestions are not implemented yet."
        )

    return AnalyzeResponse(
        summary=summary,
        detected_findings=detected_findings,
        inferred_findings=inferred_findings,
        complexity=Complexity(
            time=ComplexityEstimate(value="Unknown", status=ResultStatus.unknown),
            space=ComplexityEstimate(value="Unknown", status=ResultStatus.unknown),
        ),
        suggestions=suggestions,
        optimized_code=optimized_code,
        comparison=comparison,
        assumptions=["Deterministic analysis currently covers a limited rule set (e.g. nested loops)."],
        limitations=["AI reasoning, complexity estimation, and optimization suggestions are not yet implemented."],
    )