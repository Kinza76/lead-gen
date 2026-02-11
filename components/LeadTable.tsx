import { LeadView } from "@/lib/types";

type Props = {
  leads: LeadView[];
};

export default function LeadTable({ leads }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100 text-left">
          <tr>
            {[
              "Business", "Owner", "Email", "Phone", "Website", "Address", "Niche", "Sub-niche", "Status"
            ].map((h) => (
              <th key={h} className="px-3 py-2 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-t">
              <td className="px-3 py-2">{lead.businessName}</td>
              <td className="px-3 py-2">{lead.ownerName ?? "-"}</td>
              <td className="px-3 py-2">{lead.email ?? "-"}</td>
              <td className="px-3 py-2">{lead.phone ?? "-"}</td>
              <td className="px-3 py-2">{lead.website ?? "-"}</td>
              <td className="px-3 py-2">{lead.address ?? "-"}</td>
              <td className="px-3 py-2">{lead.niche}</td>
              <td className="px-3 py-2">{lead.subNiche}</td>
              <td className="px-3 py-2">{lead.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
