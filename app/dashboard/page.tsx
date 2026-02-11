"use client";

import { useEffect, useMemo, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import LeadForm from "@/components/LeadForm";
import LeadTable from "@/components/LeadTable";
import EmailTemplates from "@/components/EmailTemplates";
import { LeadView, TemplateView } from "@/lib/types";

const defaultTemplates: TemplateView[] = [
  {
    id: "default-intro",
    name: "Intro Offer",
    subject: "Quick growth idea for {{businessName}}",
    body: "Hi {{ownerName}},\n\nI noticed {{businessName}} in {{niche}} and wanted to share a quick growth plan. If you're open, book here: {{calendly}}"
  }
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [leads, setLeads] = useState<LeadView[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | undefined>();
  const [nicheFilter, setNicheFilter] = useState("");
  const [subNicheFilter, setSubNicheFilter] = useState("");

  const fetchLeads = async () => {
    const params = new URLSearchParams();
    if (nicheFilter) params.set("niche", nicheFilter);
    if (subNicheFilter) params.set("subNiche", subNicheFilter);
    const response = await fetch(`/api/leads?${params.toString()}`);
    if (!response.ok) return;
    const data = await response.json();
    setLeads((data.leads ?? []) as LeadView[]);
  };

  useEffect(() => {
    if (status === "authenticated") fetchLeads();
  }, [status]);

  const firstLeadId = useMemo(() => selectedLeadId ?? leads[0]?.id, [selectedLeadId, leads]);

  if (status === "loading") return <p className="text-slate-600">Loading dashboard...</p>;

  if (!session?.user) {
    return (
      <section className="rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Login required</h1>
        <p className="mt-2 text-slate-600">Please login to view your dashboard and generate leads.</p>
        <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white">
          Login with Google
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <header className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-slate-600">Welcome, {session.user.name ?? session.user.email}</p>
        </div>
        <button onClick={() => signOut()} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Logout</button>
      </header>

      <LeadForm onScraped={fetchLeads} />

      <div className="grid gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-3">
        <input className="rounded-lg border p-2" value={nicheFilter} onChange={(e) => setNicheFilter(e.target.value)} placeholder="Filter by niche" />
        <input className="rounded-lg border p-2" value={subNicheFilter} onChange={(e) => setSubNicheFilter(e.target.value)} placeholder="Filter by sub-niche" />
        <button className="rounded-lg bg-slate-900 px-4 py-2 text-white" onClick={fetchLeads}>Apply filters</button>
      </div>

      <EmailTemplates templates={defaultTemplates} leadId={firstLeadId} />
      <LeadTable leads={leads} />

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <label className="text-sm">Pick lead for outreach</label>
        <select className="mt-2 w-full rounded-lg border p-2" onChange={(e) => setSelectedLeadId(e.target.value)} value={firstLeadId}>
          {leads.map((lead) => (
            <option key={lead.id} value={lead.id}>{lead.businessName}</option>
          ))}
        </select>
      </div>
    </section>
  );
}
