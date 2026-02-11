import { getPrismaClient } from "@/lib/db";

export async function ensureUserByEmail(params: {
  email: string;
  name?: string | null;
  image?: string | null;
}) {
  const prisma = getPrismaClient();
  return prisma.user.upsert({
    where: { email: params.email },
    create: {
      email: params.email,
      name: params.name,
      image: params.image
    },
    update: {
      name: params.name,
      image: params.image
    }
  });
}
