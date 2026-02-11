"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LanguageSelector from "@/components/LanguageSelector";
import { Language, t } from "@/lib/i18n";

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("en");
  const [emailLogin, setEmailLogin] = useState("user@yahoo.com");
  const { data: session } = useSession();

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
        <div className="flex items-center gap-3">
          <LanguageSelector value={language} onChange={onLanguageChange} />
          {session?.user ? (
            <button onClick={() => signOut()} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
              Logout ({session.user.name ?? session.user.email})
            </button>
          ) : null}
        </div>
      </header>

      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white shadow-lg">
        <h2 className="text-2xl font-semibold">{t(language, "heroTitle")}</h2>
        <p className="mt-2 text-indigo-100">{t(language, "heroSubtitle")}</p>

        {!session?.user ? (
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <button onClick={() => signIn("google")} className="rounded-lg bg-white px-4 py-2 font-medium text-indigo-700">
              Continue with Google
            </button>
            <button onClick={() => signIn("facebook")} className="rounded-lg bg-sky-500 px-4 py-2 font-medium text-white">
              Continue with Facebook
            </button>
            <div className="flex gap-2">
              <input
                className="w-full rounded-lg border border-white/50 bg-white/10 px-3 py-2 text-white placeholder:text-indigo-100"
                value={emailLogin}
                onChange={(e) => setEmailLogin(e.target.value)}
                placeholder="Yahoo/Outlook email"
              />
              <button
                onClick={() => signIn("credentials", { email: emailLogin, callbackUrl: "/dashboard" })}
                className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-white"
              >
                Login
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex gap-3">
            <Link href="/dashboard" className="rounded-lg bg-white px-4 py-2 font-medium text-indigo-700">
              Open dashboard
            </Link>
            <Link href="/settings" className="rounded-lg border border-white px-4 py-2 font-medium">
              Billing & Settings
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
