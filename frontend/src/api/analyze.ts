import type { AnalyzeRequest, AnalyzeResponse } from "../types/analysis";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const REQUEST_TIMEOUT_MS = 35000;

export async function analyzeCode(payload: AnalyzeRequest): Promise<AnalyzeResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(body?.detail ?? `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("The request took too long and was cancelled. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}