import type { AnalyzeResponse, Finding, Suggestion } from "../types/analysis";

function FindingCard({ finding }: { finding: Finding }) {
  return (
    <li className="text-sm border border-gray-200 rounded-md p-3 bg-white">
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-gray-800">{finding.type.replace(/_/g, " ")}</span>
        <span className="text-xs text-gray-500">
          {finding.severity} severity - {finding.confidence}
          {finding.location ? ` - ${finding.location}` : ""}
        </span>
      </div>
      <p className="text-gray-700">{finding.description}</p>
      {finding.evidence && (
        <code className="block mt-2 text-xs bg-gray-100 rounded px-2 py-1 font-mono">
          {finding.evidence}
        </code>
      )}
    </li>
  );
}

function FindingsSection({ title, findings }: { title: string; findings: Finding[] }) {
  return (
    <div>
      <h3 className="font-semibold text-sm text-gray-700">{title}</h3>
      {findings.length === 0 ? (
        <p className="text-sm text-gray-500">None.</p>
      ) : (
        <ul className="space-y-3">
          {findings.map((f, i) => <FindingCard key={i} finding={f} />)}
        </ul>
      )}
    </div>
  );
}

function SuggestionCard({ suggestion }: { suggestion: Suggestion }) {
  return (
    <li className="text-sm border border-gray-200 rounded-md p-3 bg-white space-y-1">
      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-800">{suggestion.issue}</span>
        <span className="text-xs text-gray-500">{suggestion.status}</span>
      </div>
      <p className="text-gray-600"><span className="font-medium">Why it matters:</span> {suggestion.why_it_matters}</p>
      <p className="text-gray-600"><span className="font-medium">Suggested improvement:</span> {suggestion.suggested_improvement}</p>
      <p className="text-gray-600"><span className="font-medium">Expected effect:</span> {suggestion.expected_effect}</p>
    </li>
  );
}

export function ResultsPanel({ result }: { result: AnalyzeResponse }) {
  return (
    <div className="mt-6 space-y-4 border border-gray-200 rounded-md p-4 bg-gray-50">
      <div>
        <h3 className="font-semibold text-sm text-gray-700">Summary</h3>
        <p className="text-sm text-gray-800">{result.summary}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-sm text-gray-700">Time Complexity</h3>
          <p className="text-sm">
            {result.complexity.time.value}{" "}
            <span className="text-xs text-gray-500">({result.complexity.time.status})</span>
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-sm text-gray-700">Space Complexity</h3>
          <p className="text-sm">
            {result.complexity.space.value}{" "}
            <span className="text-xs text-gray-500">({result.complexity.space.status})</span>
          </p>
        </div>
      </div>

      <FindingsSection title="Detected Findings" findings={result.detected_findings} />
      <FindingsSection title="AI-Inferred Findings" findings={result.inferred_findings} />

      <div>
        <h3 className="font-semibold text-sm text-gray-700">Optimization Suggestions</h3>
        {result.suggestions.length === 0 ? (
          <p className="text-sm text-gray-500">None.</p>
        ) : (
          <ul className="space-y-3">
            {result.suggestions.map((s, i) => <SuggestionCard key={i} suggestion={s} />)}
          </ul>
        )}
      </div>

      {result.optimized_code && (
        <div>
          <h3 className="font-semibold text-sm text-gray-700">Optimized Code</h3>
          <pre className="mt-1 text-xs bg-gray-900 text-gray-100 rounded-md p-3 overflow-x-auto">
            <code>{result.optimized_code}</code>
          </pre>
          {result.comparison.length > 0 && (
            <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
              {result.comparison.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          )}
        </div>
      )}

      <div>
        <h3 className="font-semibold text-sm text-gray-700">Assumptions</h3>
        <ul className="list-disc list-inside text-sm text-gray-600">
          {result.assumptions.map((a, i) => <li key={i}>{a}</li>)}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-sm text-gray-700">Limitations</h3>
        <ul className="list-disc list-inside text-sm text-gray-600">
          {result.limitations.map((l, i) => <li key={i}>{l}</li>)}
        </ul>
      </div>
    </div>
  );
}