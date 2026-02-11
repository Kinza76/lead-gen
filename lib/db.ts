import { spawnSync } from "node:child_process";

type PrismaClientLike = {
  [key: string]: unknown;
};

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClientLike };

function generatePrismaClient() {
  const command = process.platform === "win32" ? "npx.cmd" : "npx";
  const result = spawnSync(command, ["prisma", "generate"], {
    cwd: process.cwd(),
    stdio: "pipe",
    env: process.env
  });

  return {
    ok: result.status === 0,
    stderr: result.stderr?.toString() ?? "",
    stdout: result.stdout?.toString() ?? ""
  };
}

function instantiatePrismaClient(): PrismaClientLike {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaClient } = require("@prisma/client") as {
    PrismaClient: new (args?: { log?: Array<"error" | "warn" | "query" | "info"> }) => PrismaClientLike;
  };

  return new PrismaClient({ log: ["error", "warn"] });
}

function buildClient(): PrismaClientLike {
  try {
    return instantiatePrismaClient();
  } catch (firstError) {
    const generated = generatePrismaClient();

    if (generated.ok) {
      try {
        return instantiatePrismaClient();
      } catch (secondError) {
        throw new Error(
          'Prisma Client failed after regeneration. Run "npm run clean", "npm run prisma:generate", then restart dev server.',
          { cause: secondError }
        );
      }
    }

    throw new Error(
      `Prisma Client is not generated. Tried auto-regeneration but failed. stderr: ${generated.stderr || "(empty)"}`,
      { cause: firstError }
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
