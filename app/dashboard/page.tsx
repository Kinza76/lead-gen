"use client";

import { useEffect, useMemo, useState } from "react";
import { Lead, Template } from "@prisma/client";
import LeadForm from "@/components/LeadForm";
import LeadTable from "@/components/LeadTable";
import EmailTemplates from "@/components/EmailTemplates";

const defaultTemplates: Template[] = [
  {
    id: "default-intro",
    userId: "",
    name: "Intro Offer",
    subject: "Quick growth idea for {{businessName}}",
    body: "Hi {{ownerName}},\n\nI noticed {{businessName}} in {{niche}} and wanted to share a quick growth plan. If you're open, book here: {{calendly}}",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
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
    setLeads(data.leads ?? []);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const firstLeadId = useMemo(() => selectedLeadId ?? leads[0]?.id, [selectedLeadId, leads]);

  return (
    <section className="space-y-5">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
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
