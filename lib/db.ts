import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  try {
    return new PrismaClient({
      log: ["error", "warn"]
    });
  } catch (error) {
    throw new Error(
      'Prisma Client failed to initialize. Run "npm run prisma:generate" (or "npm install") and restart the dev server.',
      { cause: error }
    );
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
