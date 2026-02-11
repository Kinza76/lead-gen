"use client";

import { useState } from "react";

const niches = [
  "Dental Clinics", "Med Spas", "Law Firms", "Accounting", "Real Estate", "HVAC", "Roofing", "Plumbing", "Electricians", "Landscaping",
  "Gyms", "Yoga Studios", "Chiropractors", "Physiotherapy", "Vet Clinics", "Pet Grooming", "Restaurants", "Cafes", "Catering", "Food Trucks",
  "Auto Repair", "Car Detailing", "Car Dealerships", "Travel Agencies", "Hotels", "Event Planners", "Wedding Services", "Salons", "Barbershops", "Nail Salons",
  "E-commerce", "SaaS", "IT Services", "Cybersecurity", "Marketing Agencies", "PR Agencies", "Insurance", "Mortgage Brokers", "Financial Advisors", "Tutoring",
  "Online Courses", "Coaching", "Childcare", "Senior Care", "Cleaning Services", "Security Services", "Moving Companies", "Storage Facilities", "Construction", "Interior Design"
];

type Props = {
  onScraped: () => Promise<void>;
};

export default function LeadForm({ onScraped }: Props) {
  const [niche, setNiche] = useState(niches[0]);
  const [subNiche, setSubNiche] = useState("General");
  const [country, setCountry] = useState("Worldwide");
  const [number, setNumber] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, subNiche, country, number })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        if (response.status === 401) {
          setError("You must sign in with Google before scraping leads.");
          return;
        }
        setError(payload.error ?? "Failed to scrape leads. Please try again.");
        return;
      }

      await onScraped();
    } catch {
      setError("Network error while scraping leads. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <form onSubmit={submit} className="grid gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-4">
        <select value={niche} onChange={(e) => setNiche(e.target.value)} className="rounded-lg border p-2">
          {niches.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <input value={subNiche} onChange={(e) => setSubNiche(e.target.value)} className="rounded-lg border p-2" placeholder="Sub-niche" />
        <input value={country} onChange={(e) => setCountry(e.target.value)} className="rounded-lg border p-2" placeholder="Country" />
        <div className="flex gap-2">
          <input type="number" min={1} max={100} value={number} onChange={(e) => setNumber(Number(e.target.value))} className="w-full rounded-lg border p-2" />
          <button type="submit" disabled={loading} className="rounded-lg bg-indigo-600 px-4 py-2 text-white disabled:opacity-60">
            {loading ? "Scraping..." : "Scrape"}
          </button>
        </div>
      </form>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
