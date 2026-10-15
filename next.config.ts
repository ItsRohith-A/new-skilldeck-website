import type { NextConfig } from "next";

/**
 * Content-Security-Policy.
 *
 * Scripts and network calls are allow-listed: the site's own code, GTM, and
 * Turnstile. The GTM container (GTM-NK59DHQP) only runs GA4 today; the Google
 * hosts below are what GA4 and its Google-signals beacons call.
 *
 * 'unsafe-inline' stays on script-src because the alternative, per-request
 * nonces, makes every page dynamic and would end the on-demand ISR caching the
 * whole site relies on. The allow-list still stops scripts loading from any
 * other host, and object-src / base-uri / form-action / frame-ancestors close
 * the other common injection routes.
 *
 * Images, video and iframes accept any https source on purpose: CMS rich text,
 * course media and the template previews embed content from customer domains.
 *
 * A third-party script added later through the CMS Scripts manager or a new GTM
 * tag will be blocked until its origin is listed. Add it to CSP_EXTRA_SCRIPT_SRC
 * / CSP_EXTRA_CONNECT_SRC (space-separated) in the Vercel env and redeploy.
 */
const extraSources = (name: string) => (process.env[name] || "").split(/\s+/).filter(Boolean);

const cspDirectives: Record<string, string[]> = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    // React's dev tooling needs eval; production never does.
    ...(process.env.NODE_ENV === "development" ? ["'unsafe-eval'"] : []),
    "https://www.googletagmanager.com",
    "https://*.googletagmanager.com",
    "https://challenges.cloudflare.com",
    ...extraSources("CSP_EXTRA_SCRIPT_SRC"),
  ],
  "connect-src": [
    "'self'",
    "https://*.google-analytics.com",
    "https://*.analytics.google.com",
    "https://*.googletagmanager.com",
    "https://*.doubleclick.net",
    "https://www.google.com",
    "https://challenges.cloudflare.com",
    "https://cloud-storage.skilldeck.net",
    // SchedulesContext fetches course schedules from the API straight from the browser.
    "https://api.skilldeck.net",
    ...extraSources("CSP_EXTRA_CONNECT_SRC"),
  ],
  // The rich-text stylesheet falls back to a <link> on cloud-storage.
  "style-src": ["'self'", "'unsafe-inline'", "https://cloud-storage.skilldeck.net"],
  "font-src": ["'self'", "data:", "https://cloud-storage.skilldeck.net"],
  "img-src": ["'self'", "data:", "blob:", "https:"],
  "media-src": ["'self'", "blob:", "https:"],
  "frame-src": ["https:"],
  "worker-src": ["'self'", "blob:"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  // Who may show the site in an iframe: the site itself, SkillDeck's own
  // subdomains (the CMS / admin preview), plus anything in CSP_FRAME_ANCESTORS.
  // Third-party sites still cannot frame it, which is the clickjacking guard.
  "frame-ancestors": [
    "'self'",
    "https://skilldeck.net",
    "https://*.skilldeck.net",
    ...extraSources("CSP_FRAME_ANCESTORS"),
  ],
  // Would rewrite every local http://localhost request to https in dev.
  ...(process.env.NODE_ENV === "development" ? {} : { "upgrade-insecure-requests": [] }),
};

const contentSecurityPolicy = Object.entries(cspDirectives)
  .map(([directive, sources]) => [directive, ...sources].join(" "))
  .join("; ");

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
    // The build prerenders every course page against a rate-limited backend.
    // Fewer pages in flight per worker keeps it under the limit, and a page
    // that still fails gets retried instead of failing the whole build.
    staticGenerationMaxConcurrency: 4,
    staticGenerationRetryCount: 2,
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
      // Baseline security headers the previous site set and the rebuild dropped.
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: contentSecurityPolicy },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // No X-Frame-Options: it can only say SAMEORIGIN or DENY, which would
          // block the CMS preview on another subdomain. CSP frame-ancestors above
          // does the same job with an allow-list.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
        ],
      },
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
