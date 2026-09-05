import type { NextConfig } from "next";

const isVercelProd = Boolean(process.env.VERCEL) && process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  assetPrefix: isVercelProd ? "https://skilldeck-website.vercel.app" : undefined,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.skilldeck.net" },
      { protocol: "https", hostname: "cloud-storage.skilldeck.net" },
      { protocol: "https", hostname: "local-skilldeck-s3.s3.ap-south-1.amazonaws.com" },
      { protocol: "https", hostname: "skilldeck-s3-storage.s3.ap-south-1.amazonaws.com" },
      { protocol: "https", hostname: "cloud-local.skilldeck.net" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "flagcdn.com" },
      // Stock photography for the /service-demo design concept.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "lodash",
      "date-fns",
      "@radix-ui/react-accordion",
      "@radix-ui/react-dialog",
    ],
  },
  async rewrites() {
    return [
      {
        source: '/:slug.xml',
        destination: '/api/sitemaps/:slug',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/_next/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: '*' },
        ],
      },
      {
        source: '/(logos|images|fonts)/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ];
  },
};

export default nextConfig;
