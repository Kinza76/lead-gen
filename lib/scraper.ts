export type ScrapedLead = {
  niche: string;
  subNiche: string;
  businessName: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  source: "Google Maps" | "Yellow Pages";
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function scrapeLeads(params: {
  niche: string;
  subNiche: string;
  number: number;
  country?: string;
}): Promise<ScrapedLead[]> {
  const total = Math.max(1, Math.min(params.number, 100));
  const leads: ScrapedLead[] = [];

  for (let i = 0; i < total; i += 1) {
    await sleep(400 + Math.floor(Math.random() * 400));
    const source = i % 2 === 0 ? "Google Maps" : "Yellow Pages";
    leads.push({
      niche: params.niche,
      subNiche: params.subNiche,
      businessName: `${params.subNiche} ${i + 1}`,
      ownerName: `Owner ${i + 1}`,
      email: `contact${i + 1}@example-${params.niche.toLowerCase()}.com`,
      phone: `+1-555-010${String(i % 10)}`,
      website: `https://example-${params.subNiche.toLowerCase().replace(/\s+/g, "-")}-${i + 1}.com`,
      address: `${params.country ?? "Global"} Address ${i + 1}`,
      source
    });
  }

  return leads;
}
