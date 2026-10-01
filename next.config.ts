import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.skilldeck.net" },
      { protocol: "https", hostname: "cloud-storage.skilldeck.net" },
      { protocol: "https", hostname: "skilldeck-s3-storage.s3.ap-south-1.amazonaws.com" },
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
  async redirects() {
    return [
      // The conventional WordPress/Yoast index name, which crawlers and SEO
      // tools probe. Without this it fell through to the category rewrite below
      // and 404ed as a category called "sitemap_index".
      {
        source: '/sitemap_index.xml',
        destination: '/sitemap.xml',
        permanent: true,
      },
    ];
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
        source: '/(logos|images|fonts|templates|figma)/:path*',
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
    ];
  },
};

export default nextConfig;
