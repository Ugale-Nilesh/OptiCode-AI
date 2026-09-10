import { useState } from "react";
import { Copy, Check, GitCompareArrows } from "lucide-react";
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
    <div className="grid grid-cols-3 gap-2 text-sm py-1.5">
      <span className="text-gray-500">{label}</span>
      <span className="font-mono">{original}</span>
      <span className="font-mono">{optimized ?? "-"}</span>
    </div>
  );
}

function CodePanel({ title, code, showCopy }: { title: string; code: string; showCopy: boolean }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can fail (e.g. insecure context); fail silently, button just won't confirm.
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
        {showCopy && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs font-medium text-gray-300 hover:text-white transition-colors"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
      <pre className="text-xs bg-gray-900 text-gray-100 rounded-lg p-3.5 overflow-x-auto max-h-72 shadow-sm">
        <code>{code}</code>
      </pre>
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
      <h3 className="flex items-center gap-1.5 font-semibold text-sm text-gray-800 mb-2">
        <GitCompareArrows size={15} className="text-indigo-600" />
        Code Comparison
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <CodePanel title="Original" code={originalCode} showCopy={false} />
        <CodePanel title="Optimized" code={optimizedCode} showCopy={true} />
      </div>

      <div className="mt-3 border border-gray-200 rounded-lg p-3.5 bg-gray-50">
        <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200 pb-1.5">
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
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">{explanation}</p>
      )}

      {comparison.length > 0 && (
        <ul className="list-disc list-inside text-sm text-gray-500 mt-2 space-y-0.5">
          {comparison.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
      )}
    </div>
  );
}