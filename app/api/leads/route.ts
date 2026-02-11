import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const niche = searchParams.get("niche");
  const subNiche = searchParams.get("subNiche");

  const where = {
    user: { email: session.user.email },
    ...(niche ? { niche } : {}),
    ...(subNiche ? { subNiche } : {})
  };

  const leads = await prisma.lead.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ leads });
}
