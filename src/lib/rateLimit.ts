import type { NextRequest } from "next/server";

/**
 * Fixed-window rate limiting for the public form endpoints.
 *
 * With Upstash Redis configured (UPSTASH_REDIS_REST_URL / _TOKEN, or the
 * KV_REST_API_URL / _TOKEN names the Vercel marketplace integration sets) the
 * counters are shared by every serverless instance. Without it they fall back
 * to this instance's memory, which still blunts a burst from one client but is
 * not a hard global limit. A Redis error fails open: a broken limiter must not
 * stop real leads.
 */

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "";
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";

export interface RateLimitResult {
    ok: boolean;
    /** Seconds until the window resets; set when the request is refused. */
    retryAfter?: number;
}

const memoryWindows = new Map<string, { count: number; resetAt: number }>();

function memoryHit(key: string, limit: number, windowSec: number): RateLimitResult {
    const now = Date.now();

    // Drop expired windows so the map cannot grow without bound.
    if (memoryWindows.size > 5000) {
        for (const [k, w] of memoryWindows) if (w.resetAt <= now) memoryWindows.delete(k);
    }

    const current = memoryWindows.get(key);
    if (!current || current.resetAt <= now) {
        memoryWindows.set(key, { count: 1, resetAt: now + windowSec * 1000 });
        return { ok: true };
    }

    current.count += 1;
    if (current.count > limit) {
        return { ok: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
    }
    return { ok: true };
}

async function redisHit(key: string, limit: number, windowSec: number): Promise<RateLimitResult> {
    const res = await fetch(`${REDIS_URL}/pipeline`, {
        method: "POST",
        headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify([
            ["INCR", key],
            ["EXPIRE", key, String(windowSec), "NX"],
            ["TTL", key],
        ]),
        cache: "no-store",
        signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) throw new Error(`Upstash responded ${res.status}`);

    const [incr, , ttl] = (await res.json()) as Array<{ result?: number; error?: string }>;
    const count = Number(incr?.result);
    if (!Number.isFinite(count)) throw new Error(incr?.error || "Unexpected Upstash reply");

    if (count > limit) {
        const remaining = Number(ttl?.result);
        return { ok: false, retryAfter: remaining > 0 ? remaining : windowSec };
    }
    return { ok: true };
}

export async function rateLimit(
    scope: string,
    identifier: string,
    limit: number,
    windowSec: number
): Promise<RateLimitResult> {
    const key = `ratelimit:${scope}:${identifier}`;

    if (REDIS_URL && REDIS_TOKEN) {
        try {
            return await redisHit(key, limit, windowSec);
        } catch (error) {
            console.error("[rateLimit] Redis unavailable, falling back to memory:", error);
        }
    }
    return memoryHit(key, limit, windowSec);
}

/**
 * The caller's IP as Vercel reports it. Vercel overwrites x-real-ip and
 * x-forwarded-for at its edge, so unlike cf-connecting-ip (the apex is not
 * behind Cloudflare) a client cannot forge them.
 */
export function getClientIp(request: NextRequest): string {
    return (
        request.headers.get("x-real-ip") ||
        request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
        "unknown"
    );
}
