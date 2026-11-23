import fs from "node:fs";
import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";
import { IS_READ_ONLY } from "./mode";

function resolveDatabaseUrl(): string {
  if (!IS_READ_ONLY) return "file:./prisma/dev.db";

  const source = path.join(process.cwd(), "prisma", "dev.db");
  const target = "/tmp/dev.db";
  if (!fs.existsSync(target)) fs.copyFileSync(source, target);
  return `file:${target}`;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: resolveDatabaseUrl() }),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
