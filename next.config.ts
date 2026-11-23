import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  outputFileTracingIncludes: {
    "/**/*": ["./prisma/dev.db"],
  },
};

export default nextConfig;
