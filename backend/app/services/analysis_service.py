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

    return AnalyzeResponse(
        summary=(
            f"Placeholder analysis for {request.language.value} code "
            f"({len(request.code.splitlines())} lines). Mock output from the "
            "foundational skeleton - deterministic and AI analysis are not implemented yet."
        ),
        detected_findings=detected_findings,
        inferred_findings=inferred_findings,
        complexity=Complexity(
            time=ComplexityEstimate(value="Unknown", status=ResultStatus.unknown),
            space=ComplexityEstimate(value="Unknown", status=ResultStatus.unknown),
        ),
        suggestions=suggestions,
        optimized_code=optimized_code,
        comparison=comparison,
        assumptions=["This is placeholder output; no real analysis has run yet."],
        limitations=["Deterministic analyzers and AI reasoning are not yet implemented."],
    )
