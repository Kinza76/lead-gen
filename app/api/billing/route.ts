import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPrismaClient } from "@/lib/db";
import { ensureUserByEmail } from "@/lib/user";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const prisma = getPrismaClient();
  const user = await ensureUserByEmail({
    email: session.user.email,
    name: session.user.name,
    image: session.user.image
  });

  const [subscription, cards] = await Promise.all([
    prisma.subscription.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
    prisma.paymentMethod.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } })
  ]);

  return NextResponse.json({
    subscription: subscription ?? { plan: "Free", status: "active" },
    cards
  });
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

  const body = await request.json();

  if (body.type === "subscription") {
    const existing = await prisma.subscription.findFirst({ where: { userId: user.id } });
    const saved = existing
      ? await prisma.subscription.update({
          where: { id: existing.id },
          data: { plan: String(body.plan ?? "Free") }
        })
      : await prisma.subscription.create({
          data: {
            userId: user.id,
            plan: String(body.plan ?? "Free"),
            status: "active"
          }
        });

    return NextResponse.json({ subscription: saved });
  }

  if (body.type === "card") {
    const digits = String(body.cardNumber ?? "").replace(/\D/g, "");
    if (digits.length < 12) return NextResponse.json({ error: "Invalid card number" }, { status: 400 });

    const card = await prisma.paymentMethod.create({
      data: {
        userId: user.id,
        brand: String(body.brand ?? "Visa"),
        last4: digits.slice(-4),
        expMonth: Number(body.expMonth ?? 1),
        expYear: Number(body.expYear ?? new Date().getFullYear() + 1),
        isDefault: true
      }
    });

    return NextResponse.json({ card });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
