"use client";

import { Language } from "@/lib/i18n";

type Props = {
  value: Language;
  onChange: (value: Language) => void;
};

export default function LanguageSelector({ value, onChange }: Props) {
  return (
    <select
      className="rounded-lg border border-slate-300 bg-white px-3 py-2"
      value={value}
      onChange={(e) => onChange(e.target.value as Language)}
    >
      <option value="en">English</option>
      <option value="ur">اردو</option>
      <option value="fr">Français</option>
      <option value="es">Español</option>
      <option value="ru">Русский</option>
      <option value="ar">العربية</option>
    </select>
  );
}
