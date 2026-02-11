"use client";

import { useState } from "react";

type Template = {
  id: string;
  name: string;
};

type Props = {
  templates: Template[];
  leadId?: string;
};

export default function EmailTemplates({ templates, leadId }: Props) {
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? "");
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!templateId || !leadId) return;
    setSending(true);
    try {
      await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          templateId,
          calendlyUrl: "https://calendly.com/your-link"
        })
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-white p-4 shadow-sm">
      <label className="text-sm font-medium">Email template</label>
      <select className="rounded-lg border p-2" value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
        {templates.map((template) => (
          <option key={template.id} value={template.id}>{template.name}</option>
        ))}
      </select>
      <button type="button" onClick={send} disabled={!leadId || sending} className="rounded-lg bg-emerald-600 px-3 py-2 text-white disabled:opacity-50">
        {sending ? "Sending..." : "Send outreach"}
      </button>
    </div>
  );
}
