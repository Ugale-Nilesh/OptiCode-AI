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
      className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium bg-white shadow-sm cursor-pointer hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
      value={value}
      onChange={(e) => onChange(e.target.value as Language)}
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.value} value={lang.value}>{lang.label}</option>
      ))}
    </select>
  );
}