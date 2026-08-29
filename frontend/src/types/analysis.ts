export type Language = "python" | "cpp" | "java";
export type ResultStatus = "detected" | "ai_inferred" | "estimated" | "unknown" | "not_measured";
export type Severity = "low" | "medium" | "high";

export interface Finding {
  type: string;
  severity: Severity;
  confidence: ResultStatus;
  location?: string | null;
  description: string;
  evidence?: string | null;
}

export interface ComplexityEstimate {
  value: string;
  status: ResultStatus;
}

export interface Complexity {
  time: ComplexityEstimate;
  space: ComplexityEstimate;
}

export interface Suggestion {
  issue: string;
  why_it_matters: string;
  suggested_improvement: string;
  expected_effect: string;
  status: ResultStatus;
}

export interface AnalyzeResponse {
  summary: string;
  detected_findings: Finding[];
  inferred_findings: Finding[];
  complexity: Complexity;
  suggestions: Suggestion[];
  optimized_code: string | null;
  optimized_complexity: Complexity | null;
  optimization_explanation: string | null;
  comparison: string[];
  assumptions: string[];
  limitations: string[];
}

export interface AnalyzeRequest {
  language: Language;
  code: string;
}