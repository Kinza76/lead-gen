import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPrismaClient } from "@/lib/db";
import { ensureUserByEmail } from "@/lib/user";
import { appendLeadToSheet } from "@/lib/sheets";
import { scrapeLeads } from "@/lib/scraper";

const minuteWindow = new Map<string, { count: number; resetAt: number }>();

function limitByMinute(userId: string, max = 2) {
  const now = Date.now();
  const current = minuteWindow.get(userId);
  if (!current || current.resetAt < now) {
    minuteWindow.set(userId, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (current.count >= max) return false;
  current.count += 1;
  minuteWindow.set(userId, current);
  return true;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const prisma = getPrismaClient();
  const user = await ensureUserByEmail({
    email: session.user.email,
    name: session.user.name,
    image: session.user.image
  });

  if (!limitByMinute(user.id)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const body = await request.json();
  const niche = String(body.niche ?? "").trim();
  const subNiche = String(body.subNiche ?? "").trim();
  const number = Number(body.number ?? 0);
  const country = body.country ? String(body.country) : "Worldwide";

  if (!niche || !subNiche || !Number.isFinite(number) || number < 1) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const scraped = await scrapeLeads({ niche, subNiche, number, country });

  const leads = await Promise.all(
    scraped.map(async (lead) => {
      const saved = await prisma.lead.create({
        data: {
          userId: user.id,
          niche: lead.niche,
          subNiche: lead.subNiche,
          businessName: lead.businessName,
          ownerName: lead.ownerName,
          email: lead.email,
          phone: lead.phone,
          website: lead.website,
          address: lead.address,
          source: lead.source
        }
      });
      await appendLeadToSheet(saved);
      return saved;
    })
  );

  return NextResponse.json({ leads });
}
