"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import LanguageSelector from "@/components/LanguageSelector";
import { Language, t } from "@/lib/i18n";

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("leadgen-language") as Language | null;
    if (saved) setLanguage(saved);
  }, []);

  const onLanguageChange = (value: Language) => {
    setLanguage(value);
    localStorage.setItem("leadgen-language", value);
  };

  return (
    <section className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">LeadGen+</h1>
        <LanguageSelector value={language} onChange={onLanguageChange} />
      </header>
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white shadow-lg">
        <h2 className="text-2xl font-semibold">{t(language, "heroTitle")}</h2>
        <p className="mt-2 text-indigo-100">{t(language, "heroSubtitle")}</p>
        <div className="mt-6 flex gap-3">
          <button onClick={() => signIn("google")} className="rounded-lg bg-white px-4 py-2 font-medium text-indigo-700">
            {t(language, "signInGoogle")}
          </button>
          <Link href="/dashboard" className="rounded-lg border border-white px-4 py-2 font-medium">
            {t(language, "openDashboard")}
          </Link>
        </div>
      </div>
    </section>
  );
}
