import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Type errors now fail the build (enforced — the codebase is type-clean).
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
