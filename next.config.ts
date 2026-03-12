import { type NextConfig } from "next";

import withBundleAnalyzer from "@next/bundle-analyzer";

import { env } from "./data/env/server";

const config: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["motion", "radix-ui"]
  },
  serverExternalPackages: ["pino", "pino-pretty"],
  reactCompiler: true,
  async rewrites() {
    return [
      { source: "/healthz", destination: "/api/health" },
      { source: "/api/healthz", destination: "/api/health" },
      { source: "/health", destination: "/api/health" },
      { source: "/ping", destination: "/api/health" }
    ];
  }
};

export default withBundleAnalyzer({ enabled: env.ANALYZE })(config);
