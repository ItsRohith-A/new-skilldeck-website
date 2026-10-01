import { fetchFromBackend } from "./apiProxy";
import { env } from "./env";

export const SITE_URL = env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");

export interface SitemapUrl {
    path: string;
    lastmod?: string;
    changefreq?: string;
    priority?: string;
}

export function escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case "'": return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
}

/**
 * `robots` as the CMS stores it — a string such as "noindex, nofollow", or the
 * object form Next's metadata takes.
 */
export function isNoindex(robots: unknown): boolean {
    if (!robots) return false;
    if (typeof robots === "string") return /noindex/i.test(robots);
    if (typeof robots === "object") return (robots as { index?: boolean }).index === false;
    return false;
}

/**
 * Every item of a paged listing endpoint. The backend caps `limit` at 100
 * whatever is asked for, so a single large-limit request silently returns only
 * the first 100 — the blog sitemap was missing every post past that.
 *
 * Throws if any page fails: a partial list must not be served as complete.
 */
export async function fetchAllPages<T = any>(endpoint: string, params: Record<string, string> = {}): Promise<T[]> {
    const PAGE_SIZE = 100;

    async function fetchPage(page: number) {
        const queryParams = new URLSearchParams({ ...params, page: String(page), limit: String(PAGE_SIZE) });
        const res = await fetchFromBackend(endpoint, { queryParams });
        if (!res.ok) throw new Error(`${endpoint} page ${page} responded ${res.status}`);
        return res.json();
    }

    const first = await fetchPage(1);
    const items: T[] = Array.isArray(first) ? first : [...(first.data || [])];
    const pages: number = first.meta?.pages
        || (first.meta?.total ? Math.ceil(first.meta.total / PAGE_SIZE) : 1);

    const rest = await Promise.all(
        Array.from({ length: Math.max(0, pages - 1) }, (_, i) => fetchPage(i + 2))
    );
    for (const page of rest) items.push(...(page.data || []));

    return items;
}

export function urlsetXml(urls: SitemapUrl[]): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${escapeXml(SITE_URL + url.path)}</loc>${url.lastmod ? `
    <lastmod>${escapeXml(url.lastmod)}</lastmod>` : ''}
    <changefreq>${url.changefreq || 'weekly'}</changefreq>
    <priority>${url.priority || '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;
}

export function sitemapIndexXml(paths: string[]): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <sitemap>
    <loc>${escapeXml(SITE_URL + path)}</loc>
  </sitemap>`).join('\n')}
</sitemapindex>`;
}

export function xmlResponse(body: string): Response {
    return new Response(body, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}

/**
 * A backend outage must not reach crawlers as a 404 or as a sitemap with URLs
 * missing — Google drops a 404ing sitemap, and treats a short one as the new
 * truth. A 503 tells it to come back later and keep what it had.
 */
export function unavailableResponse(): Response {
    return new Response("Service Unavailable", {
        status: 503,
        headers: { "Retry-After": "600", "Cache-Control": "no-store" },
    });
}
