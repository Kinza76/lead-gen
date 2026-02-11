import type { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function buildClient(): PrismaClient {
  try {
    // Lazy require avoids crashing module evaluation when Prisma Client was not generated yet.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaClient: PrismaClientCtor } = require("@prisma/client") as {
      PrismaClient: new (args?: { log?: Array<"error" | "warn" | "query" | "info"> }) => PrismaClient;
    };

    return new PrismaClientCtor({ log: ["error", "warn"] });
  } catch (error) {
    throw new Error(
      'Prisma Client is not ready. Run "npm install" then "npm run prisma:generate" and restart the dev server.',
      { cause: error }
    );
  }
}

export function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = buildClient();
  }

  return globalForPrisma.prisma;
}
