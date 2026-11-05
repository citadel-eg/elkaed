import type { NextConfig } from "next";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://hqmnistbtiozalclszhm.supabase.co";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  async rewrites() {
    return [
      {
        source: "/storage/:path*",
        destination: `${supabaseUrl}/storage/v1/object/public/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/storage/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=86400, immutable",
          },
          {
            key: "CDN-Cache-Control",
            value: "public, s-maxage=31536000, stale-while-revalidate=86400, immutable",
          },
          {
            key: "Vercel-CDN-Cache-Control",
            value: "public, s-maxage=31536000, stale-while-revalidate=86400, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
