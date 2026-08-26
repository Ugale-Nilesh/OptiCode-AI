import type { AnalyzeResponse } from "../types/analysis";

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

      <div>
        <h3 className="font-semibold text-sm text-gray-700">Detected Findings</h3>
        {result.detected_findings.length === 0 ? (
          <p className="text-sm text-gray-500">None.</p>
        ) : (
          <ul className="list-disc list-inside text-sm">
            {result.detected_findings.map((f, i) => <li key={i}>{f.description}</li>)}
          </ul>
        )}
      </div>

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
