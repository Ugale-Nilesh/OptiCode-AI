import type { Complexity } from "../types/analysis";

interface Props {
  originalCode: string;
  optimizedCode: string;
  originalComplexity: Complexity;
  optimizedComplexity: Complexity | null;
  explanation: string | null;
  comparison: string[];
}

function ComplexityRow({ label, original, optimized }: { label: string; original: string; optimized: string | null }) {
  return (
    <div className="grid grid-cols-3 gap-2 text-sm py-1">
      <span className="text-gray-500">{label}</span>
      <span className="font-mono">{original}</span>
      <span className="font-mono">{optimized ?? "-"}</span>
    </div>
  );
}

export function CodeComparison({
  originalCode,
  optimizedCode,
  originalComplexity,
  optimizedComplexity,
  explanation,
  comparison,
}: Props) {
  return (
    <div>
      <h3 className="font-semibold text-sm text-gray-700 mb-2">Code Comparison</h3>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">Original</p>
          <pre className="text-xs bg-gray-900 text-gray-100 rounded-md p-3 overflow-x-auto max-h-72">
            <code>{originalCode}</code>
          </pre>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">Optimized</p>
          <pre className="text-xs bg-gray-900 text-gray-100 rounded-md p-3 overflow-x-auto max-h-72">
            <code>{optimizedCode}</code>
          </pre>
        </div>
      </div>

      <div className="mt-3 border border-gray-200 rounded-md p-3 bg-white">
        <div className="grid grid-cols-3 gap-2 text-xs font-medium text-gray-500 border-b border-gray-100 pb-1">
          <span></span>
          <span>Original</span>
          <span>Optimized</span>
        </div>
        <ComplexityRow
          label="Time"
          original={originalComplexity.time.value}
          optimized={optimizedComplexity?.time.value ?? null}
        />
        <ComplexityRow
          label="Space"
          original={originalComplexity.space.value}
          optimized={optimizedComplexity?.space.value ?? null}
        />
      </div>

      {explanation && (
        <p className="mt-3 text-sm text-gray-700">{explanation}</p>
      )}

      {comparison.length > 0 && (
        <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
          {comparison.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
      )}
    </div>
  );
}