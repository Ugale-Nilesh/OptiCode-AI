import Editor from "@monaco-editor/react";
import type { Language } from "../types/analysis";

interface Props {
  language: Language;
  value: string;
  onChange: (value: string) => void;
}

export function CodeEditor({ language, value, onChange }: Props) {
  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <Editor
        height="320px"
        language={language}
        value={value}
        onChange={(newValue) => onChange(newValue ?? "")}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
