import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/hall",
        destination: "/",
        permanent: true,
      },
    ];
  },
  images: {
    // Next 16 defaults qualities to [75] only — allow sharper product photos.
    qualities: [75, 90, 95],
    // Prefer ≥640 for product cards; tiny imageSizes made phones soft.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [96, 128, 256, 384, 512],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
          {
            key: "CDN-Cache-Control",
            value: "no-store",
          },
          {
            key: "Netlify-CDN-Cache-Control",
            value: "no-store",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
