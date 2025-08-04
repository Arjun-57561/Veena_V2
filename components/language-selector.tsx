import React from "react";

interface LanguageSelectorProps {
  value: string;
  onValueChange: (lang: string) => void;
}

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "mr", label: "Marathi" },
  { code: "gu", label: "Gujarati" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "bn", label: "Bengali" },
  { code: "kn", label: "Kannada" },
];

export default function LanguageSelector({ value, onValueChange }: LanguageSelectorProps) {
  return (
    <select
      className="rounded px-2 py-1 bg-slate-800 text-white border border-slate-600"
      value={value}
      onChange={e => onValueChange(e.target.value)}
    >
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}
