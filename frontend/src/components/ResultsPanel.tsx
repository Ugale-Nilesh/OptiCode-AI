import { CheckCircle2, Sparkles, Lightbulb } from "lucide-react";
import type { AnalyzeResponse, Finding, Suggestion, Severity, ResultStatus } from "../types/analysis";
import { CodeComparison } from "./CodeComparison";

const SEVERITY_STYLES: Record<Severity, string> = {
  low: "bg-blue-50 text-blue-700 border-blue-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-red-50 text-red-700 border-red-200",
};

const CONFIDENCE_STYLES: Record<ResultStatus, string> = {
  detected: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ai_inferred: "bg-violet-50 text-violet-700 border-violet-200",
  estimated: "bg-blue-50 text-blue-700 border-blue-200",
  unknown: "bg-gray-100 text-gray-500 border-gray-200",
  not_measured: "bg-gray-100 text-gray-500 border-gray-200",
};

function Badge({ text, className }: { text: string; className: string }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${className}`}>
      {text.replace(/_/g, " ")}
    </span>
  );
}

function FindingCard({ finding }: { finding: Finding }) {
  return (
    <li className="text-sm border border-gray-200 rounded-lg p-3.5 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-semibold text-gray-800">{finding.type.replace(/_/g, " ")}</span>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Badge text={finding.severity} className={SEVERITY_STYLES[finding.severity]} />
          <Badge text={finding.confidence} className={CONFIDENCE_STYLES[finding.confidence]} />
        </div>
      </div>
      <p className="text-gray-700">{finding.description}</p>
      {finding.location && (
        <p className="text-xs text-gray-400 mt-1">{finding.location}</p>
      )}
      {finding.evidence && (
        <code className="block mt-2 text-xs bg-gray-50 border border-gray-100 rounded-md px-2.5 py-1.5 font-mono text-gray-700">
          {finding.evidence}
        </code>
      )}
    </li>
  );
}

function FindingsSection({ title, findings, icon }: { title: string; findings: Finding[]; icon: React.ReactNode }) {
  return (
    <div>
      <h3 className="flex items-center gap-1.5 font-semibold text-sm text-gray-800 mb-2">
        {icon}
        {title}
      </h3>
      {findings.length === 0 ? (
        <p className="text-sm text-gray-400">None.</p>
      ) : (
        <ul className="space-y-2.5">
          {findings.map((f, i) => <FindingCard key={i} finding={f} />)}
        </ul>
      )}
    </div>
  );
}

function SuggestionCard({ suggestion }: { suggestion: Suggestion }) {
  return (
    <li className="text-sm border border-gray-200 rounded-lg p-3.5 bg-white shadow-sm space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-gray-800">{suggestion.issue}</span>
        <Badge text={suggestion.status} className={CONFIDENCE_STYLES[suggestion.status]} />
      </div>
      <p className="text-gray-600"><span className="font-medium text-gray-700">Why it matters:</span> {suggestion.why_it_matters}</p>
      <p className="text-gray-600"><span className="font-medium text-gray-700">Suggested improvement:</span> {suggestion.suggested_improvement}</p>
      <p className="text-gray-600"><span className="font-medium text-gray-700">Expected effect:</span> {suggestion.expected_effect}</p>
    </li>
  );
}

interface Props {
  result: AnalyzeResponse;
  originalCode: string;
}

export function ResultsPanel({ result, originalCode }: Props) {
  return (
    <div className="mt-6 space-y-5 border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
      <div>
        <h3 className="font-semibold text-sm text-gray-800 mb-1">Summary</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{result.summary}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Time Complexity</h3>
          <p className="text-lg font-mono font-semibold">
            {result.complexity.time.value}{" "}
            <span className="text-xs text-gray-400 font-sans font-normal">({result.complexity.time.status.replace(/_/g, " ")})</span>
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Space Complexity</h3>
          <p className="text-lg font-mono font-semibold">
            {result.complexity.space.value}{" "}
            <span className="text-xs text-gray-400 font-sans font-normal">({result.complexity.space.status.replace(/_/g, " ")})</span>
          </p>
        </div>
      </div>

      <FindingsSection title="Detected Findings" findings={result.detected_findings} icon={<CheckCircle2 size={15} className="text-emerald-600" />} />
      <FindingsSection title="AI-Inferred Findings" findings={result.inferred_findings} icon={<Sparkles size={15} className="text-violet-600" />} />

      <div>
        <h3 className="flex items-center gap-1.5 font-semibold text-sm text-gray-800 mb-2">
          <Lightbulb size={15} className="text-amber-500" />
          Optimization Suggestions
        </h3>
        {result.suggestions.length === 0 ? (
          <p className="text-sm text-gray-400">None.</p>
        ) : (
          <ul className="space-y-2.5">
            {result.suggestions.map((s, i) => <SuggestionCard key={i} suggestion={s} />)}
          </ul>
        )}
      </div>

      {result.optimized_code && (
        <CodeComparison
          originalCode={originalCode}
          optimizedCode={result.optimized_code}
          originalComplexity={result.complexity}
          optimizedComplexity={result.optimized_complexity}
          explanation={result.optimization_explanation}
          comparison={result.comparison}
        />
      )}

      <div>
        <h3 className="font-semibold text-sm text-gray-800 mb-1.5">Assumptions</h3>
        <ul className="list-disc list-inside text-sm text-gray-500 space-y-0.5">
          {result.assumptions.map((a, i) => <li key={i}>{a}</li>)}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-sm text-gray-800 mb-1.5">Limitations</h3>
        <ul className="list-disc list-inside text-sm text-gray-500 space-y-0.5">
          {result.limitations.map((l, i) => <li key={i}>{l}</li>)}
        </ul>
      </div>
    </div>
  );
}