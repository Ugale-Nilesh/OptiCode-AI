from typing import List, Optional
from app.core.config import MAX_CODE_LENGTH_FOR_AI
from app.schemas.analysis import Finding
from app.services.ai_providers.base import AIAnalysisResult
from app.services.ai_providers.gemini_provider import GeminiProvider

_provider = GeminiProvider()


def get_ai_analysis(
    code: str,
    language: str,
    deterministic_findings: List[Finding],
) -> tuple[Optional[AIAnalysisResult], Optional[str]]:
    """Run the configured AI provider and return (result, limitation_message).

    On any failure -- oversized input, network error, malformed response,
    missing API key -- this returns (None, <reason>) instead of raising, so
    the caller can fall back to deterministic-only results.
    """
    if len(code) > MAX_CODE_LENGTH_FOR_AI:
        return None, (
            f"Code exceeds the current AI analysis length limit "
            f"({MAX_CODE_LENGTH_FOR_AI} characters); AI-powered reasoning was skipped."
        )

    try:
        result = _provider.analyze(code, language, deterministic_findings)
        return result, None
    except Exception as exc:
        return None, f"AI-powered reasoning is currently unavailable ({exc.__class__.__name__})."