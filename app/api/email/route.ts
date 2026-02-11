import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPrismaClient } from "@/lib/db";
import { getResendClient } from "@/lib/resend";
import { ensureUserByEmail } from "@/lib/user";

const DAILY_LIMIT = 15;

function applyTemplate(content: string, replacements: Record<string, string>) {
  return Object.entries(replacements).reduce((acc, [key, value]) => {
    const pattern = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    return acc.replace(pattern, value);
  }, content);
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

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const sentToday = await prisma.emailLog.count({
    where: {
      userId: user.id,
      status: "SENT",
      createdAt: { gte: startOfDay }
    }
  });

  if (sentToday >= DAILY_LIMIT) {
    return NextResponse.json({ error: "Daily email limit reached" }, { status: 429 });
  }

  const { leadId, templateId, calendlyUrl } = await request.json();

  const [lead, template] = await Promise.all([
    prisma.lead.findFirst({ where: { id: leadId, userId: user.id } }),
    prisma.template.findFirst({ where: { id: templateId, userId: user.id } })
  ]);

  if (!lead || !template || !lead.email) {
    return NextResponse.json({ error: "Lead/template missing or invalid" }, { status: 400 });
  }

  const replacements = {
    businessName: lead.businessName,
    ownerName: lead.ownerName ?? "there",
    niche: lead.niche,
    calendly: calendlyUrl ?? "https://calendly.com/"
  };

  const html = `${applyTemplate(template.body, replacements)}<hr /><p>You received this email as part of B2B outreach.</p><p><a href="https://example.com/unsubscribe?email=${encodeURIComponent(lead.email)}">Unsubscribe</a></p>`;

  const resend = getResendClient();
  const sent = await resend.emails.send({
    from: "LeadGen+ <outreach@resend.dev>",
    to: [lead.email],
    subject: applyTemplate(template.subject, replacements),
    html
  });

  const status = sent.error ? "FAILED" : "SENT";

  const log = await prisma.emailLog.create({
    data: {
      userId: user.id,
      leadId: lead.id,
      templateId: template.id,
      status,
      resendId: sent.data?.id,
      sentAt: status === "SENT" ? new Date() : null
    }
  });

  await prisma.lead.update({
    where: { id: lead.id },
    data: { status: status === "SENT" ? "EMAILED" : lead.status }
  });

  return NextResponse.json({ log, status });
}
