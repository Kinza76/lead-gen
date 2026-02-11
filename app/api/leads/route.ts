import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPrismaClient } from "@/lib/db";
import { ensureUserByEmail } from "@/lib/user";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const prisma = getPrismaClient();
  await ensureUserByEmail({
    email: session.user.email,
    name: session.user.name,
    image: session.user.image
  });

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
