import { useState } from "react";
import { Sparkles } from "lucide-react";
import { LanguageSelector } from "./components/LanguageSelector";
import { CodeEditor } from "./components/CodeEditor";
import { ResultsPanel } from "./components/ResultsPanel";
import { analyzeCode } from "./api/analyze";
import type { AnalyzeResponse, Language } from "./types/analysis";

export default function App() {
  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState("");
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!code.trim()) {
      setError("Please paste some code before analyzing.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      setResult(await analyzeCode({ language, code }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 mb-1">
          <div className="bg-black text-white rounded-lg p-1.5">
            <Sparkles size={18} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">OptiCode AI</h1>
        </div>
        <p className="text-sm text-gray-500 mb-8">
          Explainable code analysis and optimization for Python, C++, and Java.
        </p>

        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-gray-800">Code</label>
          <LanguageSelector value={language} onChange={setLanguage} />
        </div>

        <CodeEditor language={language} value={code} onChange={setCode} />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-4 bg-black hover:bg-gray-800 active:bg-gray-900 transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>

        {error && (
          <p className="mt-4 text-sm text-red-700 border border-red-200 bg-red-50 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        {result && <ResultsPanel result={result} originalCode={code} />}
      </div>
    </div>
  );
}