import type { Language } from "../types/analysis";

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
];

interface Props {
  value: Language;
  onChange: (language: Language) => void;
}

export function LanguageSelector({ value, onChange }: Props) {
  return (
    <select
      className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
      value={value}
      onChange={(e) => onChange(e.target.value as Language)}
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.value} value={lang.value}>{lang.label}</option>
      ))}
    </select>
  );
}
