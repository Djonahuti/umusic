import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "calistacouture.com.ng",
      },
    ],
  },
};

export default nextConfig;
