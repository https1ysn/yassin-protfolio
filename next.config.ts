import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // server rendering — required for the admin dashboard (auth + server actions)
  images: { unoptimized: true },
};

export default nextConfig;
