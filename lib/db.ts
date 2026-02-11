type PrismaClientLike = {
  [key: string]: unknown;
};

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClientLike };

function buildClient(): PrismaClientLike {
  try {
    // Lazy require prevents import-time crashes before Prisma Client is generated.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaClient } = require("@prisma/client") as {
      PrismaClient: new (args?: { log?: Array<"error" | "warn" | "query" | "info"> }) => PrismaClientLike;
    };

    return new PrismaClient({ log: ["error", "warn"] });
  } catch (error) {
    throw new Error(
      'Prisma Client is not generated. Run "npm install", then "npm run prisma:generate", then restart `npm run dev`.',
      { cause: error }
    );
  }
}

export function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = buildClient();
  }

  return globalForPrisma.prisma as any;
}

// Backward-compatible export for any stale imports (`import { prisma } from "@/lib/db"`).
// This avoids constructing Prisma at module-evaluation time.
export const prisma = new Proxy(
  {},
  {
    get(_target, prop) {
      const client = getPrismaClient();
      return Reflect.get(client as object, prop);
    }
  }
) as any;
