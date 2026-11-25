import { NextRequest } from "next/server";
import { purgeCloudflareCache } from "./cloudflare";
import { env } from "./env";

const inFlightRequests = new Map<string, Promise<Response>>();

const IS_BUILD = process.env.NEXT_PHASE === "phase-production-build";
const RETRYABLE_STATUSES = new Set([429, 503]);
const RATE_LIMIT_RETRIES = IS_BUILD ? 6 : 3;
const MAX_RETRY_DELAY_MS = IS_BUILD ? 15000 : 5000;
const MAX_CONCURRENT_REQUESTS = 6;

let activeRequests = 0;
const queue: (() => void)[] = [];
let pauseUntil = 0;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function acquireSlot(): Promise<void> {
  if (typeof window !== "undefined") return;

  if (Date.now() < pauseUntil) {
    await sleep(pauseUntil - Date.now());
  }

  if (activeRequests < MAX_CONCURRENT_REQUESTS) {
    activeRequests++;
    return;
  }

  return new Promise((resolve) => {
    queue.push(async () => {
      if (Date.now() < pauseUntil) {
        await sleep(pauseUntil - Date.now());
      }
      activeRequests++;
      resolve();
    });
  });
}

function releaseSlot(): void {
  if (typeof window !== "undefined") return;

  activeRequests = Math.max(0, activeRequests - 1);
  if (queue.length > 0 && activeRequests < MAX_CONCURRENT_REQUESTS) {
    const next = queue.shift();
    if (next) next();
  }
}

function setRateLimitPause(delayMs: number): void {
  pauseUntil = Math.max(pauseUntil, Date.now() + delayMs);
}

/** Retry-After (seconds or HTTP date) or RateLimit-Reset when sent, else exponential backoff with jitter. */
function retryDelayMs(response: Response, attempt: number): number {
  const retryAfter = response.headers.get("retry-after");
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds) && seconds > 0) {
      return Math.min(seconds * 1000, MAX_RETRY_DELAY_MS);
    }
    const parsedDate = Date.parse(retryAfter);
    if (!Number.isNaN(parsedDate)) {
      const diff = parsedDate - Date.now();
      if (diff > 0) return Math.min(diff, MAX_RETRY_DELAY_MS);
    }
  }

  const resetHeader = response.headers.get("x-ratelimit-reset") || response.headers.get("ratelimit-reset");
  if (resetHeader) {
    const resetNum = Number(resetHeader);
    if (Number.isFinite(resetNum)) {
      if (resetNum > 1_000_000_000_000) {
        const diff = resetNum - Date.now();
        if (diff > 0) return Math.min(diff, MAX_RETRY_DELAY_MS);
      } else if (resetNum > 1_000_000_000) {
        const diff = resetNum * 1000 - Date.now();
        if (diff > 0) return Math.min(diff, MAX_RETRY_DELAY_MS);
      } else if (resetNum > 0) {
        return Math.min(resetNum * 1000, MAX_RETRY_DELAY_MS);
      }
    }
  }

  const base = response.status === 429 && IS_BUILD ? 1500 : 500;
  return Math.min(base * 2 ** (attempt - 1) + Math.random() * 250, MAX_RETRY_DELAY_MS);
}

interface FetchOptions {
  request?: NextRequest;
  queryParams?: URLSearchParams;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  next?: RequestInit["next"];
  cache?: RequestCache;
  skipPurge?: boolean;
  prefix?: string;
  /** Extra request headers (e.g. the visitor's IP as x-user-ip) */
  headers?: Record<string, string>;
}

export function getSubdomain(request: NextRequest): string | null {
  const host = request.headers.get("host");
  if (!host) return null;

  const hostname = host.split(":")[0];
  if (hostname === "localhost" || hostname.startsWith("127.") || hostname.startsWith("192.168.")) {
    return null;
  }

  const parts = hostname.split(".");
  if (parts.length > 2) {
    if (parts[0] === "www") {
      return null;
    }
    return parts[0];
  }
  return null;
}

export async function fetchFromBackend(endpoint: string, options?: FetchOptions): Promise<Response> {
  const { request, queryParams, method = "GET", body, next, cache, prefix, headers: extraHeaders } = options || {};

  const routePrefix = prefix || ((endpoint.startsWith("/schedules") || endpoint.startsWith("/tenants")) ? "/api/v1/skilldeck" : "/api/v1/content");
  let backendUrl = `${env.API_BASE_URL}${routePrefix}${endpoint}`;
  if (queryParams && queryParams.toString()) {
    backendUrl += `?${queryParams.toString()}`;
  }

  const headers: Record<string, string> = {
    "x-api-key": env.API_KEY,
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  if (request) {
    let clientIp = request.headers.get("x-client-ip");
    if (clientIp) {
      try {
        if (clientIp.trim().startsWith("{")) {
          const parsed = JSON.parse(clientIp);
          if (parsed && parsed.query) {
            clientIp = parsed.query;
          }
        }
      } catch (e) {}
      headers["x-user-ip"] = clientIp!;
    }

    const subdomain = getSubdomain(request);
    if (subdomain) {
      headers["X-Tenant-Subdomain"] = subdomain;
    }
  }

  try {
    const isGET = method === "GET";
    if (isGET && typeof window === "undefined") {
      const existing = inFlightRequests.get(backendUrl);
      if (existing) {
        const res = await existing;
        return res.clone();
      }
    }

    const fetchPromise = (async () => {
      await acquireSlot();
      try {
        const doFetch = async () => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000);
          try {
            return await fetch(backendUrl, {
              method,
              headers,
              body: body ? JSON.stringify(body) : undefined,
              cache,
              next: next || (isGET ? { tags: ['default'] } : undefined),
              signal: controller.signal,
            });
          } finally {
            clearTimeout(timeoutId);
          }
        };

        let response = await doFetch();

        // The backend rate-limits. A build prerenders every course in parallel,
        // and since the course page throws on any non-404 (so an outage never
        // caches as a permanent 404), a single 429 used to fail the whole
        // build. Back off and retry GETs, honouring Retry-After within a cap.
        if (isGET) {
          for (let attempt = 1; attempt <= RATE_LIMIT_RETRIES && RETRYABLE_STATUSES.has(response.status); attempt++) {
            const delay = retryDelayMs(response, attempt);
            if (response.status === 429) {
              setRateLimitPause(delay);
            }
            await sleep(delay);
            response = await doFetch();
          }
        }

        const isRetry = options && (options as any)._isRetry;
        if (response.status === 401 && !isRetry) {
          headers["Authorization"] = `Bearer ${env.API_KEY}`;
          delete headers["x-api-key"];

          const retryController = new AbortController();
          const retryTimeoutId = setTimeout(() => retryController.abort(), 15000);

          const retryResponse = await fetch(backendUrl, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
            cache: cache || (next ? undefined : "no-store"),
            next,
            signal: retryController.signal,
            ...({ _isRetry: true } as any),
          } as RequestInit);
          clearTimeout(retryTimeoutId);
          response = retryResponse;
        }

        return response;
      } finally {
        releaseSlot();
        if (isGET && typeof window === "undefined") {
          inFlightRequests.delete(backendUrl);
        }
      }
    })();

    if (isGET && typeof window === "undefined") {
      inFlightRequests.set(backendUrl, fetchPromise);
    }

    const response = await fetchPromise;

    if (response.ok && !options?.skipPurge && typeof window === "undefined") {
      const cacheStatus = response.headers.get("x-cache");
      const isMiss = cacheStatus && cacheStatus.toUpperCase().includes("MISS");

      if (isMiss) {
        let urlToPurge: string | null = null;
        if (request) {
          urlToPurge = request.headers.get("referer");
          if (urlToPurge && !urlToPurge.startsWith("http")) {
            const siteUrl = env.NEXT_PUBLIC_SITE_URL || "https://skilldeck.net";
            urlToPurge = `${siteUrl.replace(/\/$/, "")}${urlToPurge.startsWith("/") ? "" : "/"}${urlToPurge}`;
          }
        }

        if (urlToPurge) {
          const siteUrl = env.NEXT_PUBLIC_SITE_URL || "https://skilldeck.net";
          const host = siteUrl.replace(/^https?:\/\//, "").split("/")[0];
          if (host && (urlToPurge.includes(host) || urlToPurge.includes("localhost"))) {
            purgeCloudflareCache([urlToPurge]).catch((err) => {
              console.error("[Cloudflare Purge Error] Delayed catch:", err);
            });
          }
        }
      }
    }

    return response;
  } catch (error) {
    console.error(`[Fetch Failed] ${method} ${backendUrl}`, error);
    throw error;
  }
}
