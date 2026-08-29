import { useState } from "react";
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
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-1">OptiCode AI</h1>
        <p className="text-sm text-gray-500 mb-6">
          Explainable code analysis and optimization - MVP skeleton.
        </p>

        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Code</label>
          <LanguageSelector value={language} onChange={setLanguage} />
        </div>

        <CodeEditor language={language} value={code} onChange={setCode} />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-4 bg-black text-white text-sm font-medium px-4 py-2 rounded-md disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>

        {error && (
          <p className="mt-4 text-sm text-red-600 border border-red-200 bg-red-50 rounded-md p-3">
            {error}
          </p>
        )}

        {result && <ResultsPanel result={result} originalCode={code} />}
      </div>
    </div>
  );
}

