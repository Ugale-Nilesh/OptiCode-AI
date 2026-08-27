import json
from typing import List
from google import genai
from google.genai import types
from app.core.config import GEMINI_API_KEY, GEMINI_MODEL
from app.schemas.analysis import Finding, Suggestion, ComplexityEstimate, ResultStatus, Severity
from app.services.ai_providers.base import AIProvider, AIAnalysisResult

_RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "code_summary": {"type": "string"},
        "inferred_findings": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "type": {"type": "string"},
                    "severity": {"type": "string", "enum": ["low", "medium", "high"]},
                    "description": {"type": "string"},
                    "location": {"type": "string"},
                },
                "required": ["type", "severity", "description"],
            },
        },
        "suggestions": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "issue": {"type": "string"},
                    "why_it_matters": {"type": "string"},
                    "suggested_improvement": {"type": "string"},
                    "expected_effect": {"type": "string"},
                },
                "required": ["issue", "why_it_matters", "suggested_improvement", "expected_effect"],
            },
        },
        "time_complexity": {"type": "string"},
        "space_complexity": {"type": "string"},
        "optimized_code": {"type": "string"},
        "comparison": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["code_summary", "inferred_findings", "suggestions", "time_complexity", "space_complexity", "comparison"],
}


def _build_prompt(code: str, language: str, deterministic_findings: List[Finding]) -> str:
    findings_text = "\n".join(
        f"- {f.type} (line {f.location or 'unknown'}): {f.description}"
        for f in deterministic_findings
    ) or "None."

    return f"""You are a code analysis assistant. Analyze the following {language} code.

Deterministic findings already detected (do not repeat these, build on them):
{findings_text}

Code:
```{language}
{code}
```

Provide:
- A brief, plain-English summary of what the code does.
- Any additional issues you can infer beyond the deterministic findings (empty list if none).
- Optimization suggestions, each with the issue, why it matters, the suggested improvement, and the expected effect. Do not claim specific performance numbers (e.g. "50% faster") without measurement -- describe expected complexity or work-reduction improvements instead.
- Estimated time and space complexity in Big-O notation (e.g. "O(n)"), or "Unknown" if you cannot estimate confidently.
- Optimized code ONLY if a genuine improvement is justified; otherwise leave it empty and say so in comparison.
- A short list of the most important differences between original and optimized code, if any.

Respond only with JSON matching the provided schema."""


class GeminiProvider(AIProvider):
    def __init__(self):
        self._client = genai.Client(api_key=GEMINI_API_KEY)

    def analyze(
        self,
        code: str,
        language: str,
        deterministic_findings: List[Finding],
    ) -> AIAnalysisResult:
        prompt = _build_prompt(code, language, deterministic_findings)

        response = self._client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=_RESPONSE_SCHEMA,
            ),
        )

        data = json.loads(response.text)

        inferred_findings = [
            Finding(
                type=f.get("type", "unknown"),
                severity=Severity(f.get("severity", "low")),
                confidence=ResultStatus.ai_inferred,
                location=f.get("location"),
                description=f.get("description", ""),
                evidence=None,
            )
            for f in data.get("inferred_findings", [])
        ]

        suggestions = [
            Suggestion(
                issue=s.get("issue", ""),
                why_it_matters=s.get("why_it_matters", ""),
                suggested_improvement=s.get("suggested_improvement", ""),
                expected_effect=s.get("expected_effect", ""),
                status=ResultStatus.ai_inferred,
            )
            for s in data.get("suggestions", [])
        ]

        time_value = data.get("time_complexity") or "Unknown"
        space_value = data.get("space_complexity") or "Unknown"

        return AIAnalysisResult(
            code_summary=data.get("code_summary", ""),
            inferred_findings=inferred_findings,
            suggestions=suggestions,
            time_complexity=ComplexityEstimate(
                value=time_value,
                status=ResultStatus.unknown if time_value == "Unknown" else ResultStatus.estimated,
            ),
            space_complexity=ComplexityEstimate(
                value=space_value,
                status=ResultStatus.unknown if space_value == "Unknown" else ResultStatus.estimated,
            ),
            optimized_code=data.get("optimized_code") or None,
            comparison=data.get("comparison", []),
        )