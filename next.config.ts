import type { NextConfig } from "next";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${API_URL}/:path*`,
      },
    ];
  },
  allowedDevOrigins: [
    "192.168.0.41",
    "localhost:3000",
    "0d01-91-196-77-111.ngrok-free.app",
    "a8b6-91-196-77-111.ngrok-free.app",
  ],
};

export default nextConfig;
