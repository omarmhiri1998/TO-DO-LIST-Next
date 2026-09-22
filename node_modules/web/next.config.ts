import type {
  NextConfig
} from "next";

const nextConfig:
  NextConfig = {
    transpilePackages: [
      "@todo/db",
      "@todo/auth"
    ]
  };

export default nextConfig;