import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: [
    "192.168.18.106:3000",
    "192.168.18.106",
    "localhost:3000",
  ],
};

export default nextConfig;
