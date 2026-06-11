import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    clerkMiddlewareEnabled: true,
  },
};

export default nextConfig;
