import { notFound, permanentRedirect, redirect } from "next/navigation";
import { fetchFromBackend } from "./apiProxy";

interface RedirectMatch {
    destination: string;
    permanent: boolean;
}

interface Redirection {
    source: string;
    destination: string;
    type: string; // "301" | "302"
    enabled: boolean;
}

interface RedirectionsAPIResponse {
    data: Redirection[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// In-memory cache, shared across requests within the same server instance.
let redirectMap: Map<string, RedirectMatch> | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // Re-fetch every 5 minutes
let fetchPromise: Promise<void> | null = null; // Prevents duplicate in-flight fetches

/**
 * Normalize a URL path for consistent lookup:
 *  - extract pathname if a full URL is stored as the source
 *  - ensure a leading slash
 *  - lowercase
 *  - strip the trailing slash (except for "/")
 */
export function normalizeRedirectPath(path: string): string {
    let p = path.trim().toLowerCase();

    if (p.startsWith("http://") || p.startsWith("https://")) {
        try {
            p = new URL(p).pathname;
        } catch {
            // Not a parseable URL — fall through and treat it as a path.
        }
    }

    if (p && !p.startsWith("/")) {
        p = "/" + p;
    }

    if (p !== "/" && p.endsWith("/")) {
        p = p.slice(0, -1);
    }
    return p;
}

function addPage(map: Map<string, RedirectMatch>, rows: Redirection[]) {
    for (const r of rows) {
        if (!r.enabled || !r.source || !r.destination) continue;
        map.set(normalizeRedirectPath(r.source), {
            destination: r.destination,
            permanent: r.type === "301",
        });
    }
}

async function fetchPage(page: number): Promise<RedirectionsAPIResponse | null> {
    const queryParams = new URLSearchParams({ page: String(page), limit: "100" });
    // A `no-store` fetch here would drag every ISR page that calls this into
    // dynamic rendering, so the list is fetched through the data cache instead
    // and purged by tag from the revalidate webhook.
    const res = await fetchFromBackend("/redirections", {
        queryParams,
        next: { revalidate: 300, tags: ["redirections"] },
    });

    if (!res.ok) {
        console.error(`[Redirects] Failed to fetch redirections (page ${page}): ${res.status}`);
        return null;
    }
    return res.json();
}

async function fetchAllRedirections(): Promise<Map<string, RedirectMatch>> {
    const map = new Map<string, RedirectMatch>();

    const first = await fetchPage(1);
    if (!first) return map;

    addPage(map, first.data || []);

    const totalPages = first.totalPages || 1;
    if (totalPages > 1) {
        const pages = await Promise.all(
            Array.from({ length: totalPages - 1 }, (_, i) =>
                fetchPage(i + 2).catch((err) => {
                    console.error(`[Redirects] Error fetching redirections (page ${i + 2}):`, err);
                    return null;
                })
            )
        );
        for (const page of pages) {
            if (page) addPage(map, page.data || []);
        }
    }

    return map;
}

/**
 * Ensure the redirect map is loaded and fresh.
 * A single in-flight promise keeps a cold start from fanning out one fetch
 * per concurrent request.
 */
async function ensureRedirections(): Promise<Map<string, RedirectMatch>> {
    const now = Date.now();

    if (redirectMap && now - lastFetchTime < CACHE_TTL_MS) {
        return redirectMap;
    }

    if (fetchPromise) {
        await fetchPromise;
        return redirectMap!;
    }

    fetchPromise = (async () => {
        try {
            redirectMap = await fetchAllRedirections();
            lastFetchTime = Date.now();
        } catch (error) {
            console.error("[Redirects] Failed to build the redirect map:", error);
            // Keep serving the previous map rather than dropping every redirect.
            if (!redirectMap) {
                redirectMap = new Map();
            }
        } finally {
            fetchPromise = null;
        }
    })();

    await fetchPromise;
    return redirectMap!;
}

/**
 * Drops the cached map so the next lookup refetches. Called by the revalidate
 * webhook so a redirect added in the CMS takes effect without waiting out the
 * 5-minute TTL.
 */
export function invalidateRedirectCache(): void {
    redirectMap = null;
    lastFetchTime = 0;
}

/**
 * Look up a configured redirect for a given path.
 * Only called from the "not found" branch of a page — i.e. only when the
 * requested content doesn't exist, not on every request.
 *
 * Skipped entirely during `next build`: every path being rendered there came
 * straight out of generateStaticParams moments earlier, so a failure is a
 * transient build-time backend hiccup, not a genuinely removed page. Checking
 * anyway would fan out an extra redirects-list fetch per build worker (each has
 * its own in-memory cache) right when the backend is already under the most load.
 */
export async function getRedirectFor(pathname: string): Promise<RedirectMatch | null> {
    if (process.env.NEXT_PHASE === "phase-production-build") {
        return null;
    }
    const map = await ensureRedirections();
    return map.get(normalizeRedirectPath(pathname)) || null;
}

/**
 * The whole "not found" branch of a dynamic page: send the visitor on if a
 * redirect is configured for this path, otherwise render the 404.
 * Never returns — both branches throw the way Next expects.
 */
export async function redirectOrNotFound(pathname: string): Promise<never> {
    const match = await getRedirectFor(pathname);
    if (match) {
        if (match.permanent) permanentRedirect(match.destination);
        redirect(match.destination);
    }
    notFound();
}
