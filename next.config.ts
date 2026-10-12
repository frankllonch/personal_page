import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Artwork never changes under the same filename, so a resized variant can
    // live in the cache for a year instead of being re-cut after a day.
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
  compress: true,
};

export default nextConfig;
