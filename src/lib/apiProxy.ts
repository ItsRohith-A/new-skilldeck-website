import { NextRequest } from "next/server";
import { purgeCloudflareCache } from "./cloudflare";
import { env } from "./env";

const inFlightRequests = new Map<string, Promise<Response>>();

interface FetchOptions {
  request?: NextRequest;
  queryParams?: URLSearchParams;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  next?: RequestInit["next"];
  cache?: RequestCache;
  skipPurge?: boolean;
  prefix?: string;
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
  const { request, queryParams, method = "GET", body, next, cache, prefix } = options || {};

  const routePrefix = prefix || ((endpoint.startsWith("/schedules") || endpoint.startsWith("/tenants")) ? "/api/v1/skilldeck" : "/api/v1/content");
  let backendUrl = `${env.API_BASE_URL}${routePrefix}${endpoint}`;
  if (queryParams && queryParams.toString()) {
    backendUrl += `?${queryParams.toString()}`;
  }

  const headers: Record<string, string> = {
    "x-api-key": env.API_KEY,
    "Content-Type": "application/json",
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
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        let response = await fetch(backendUrl, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
          cache,
          next: next || (isGET ? { tags: ['default'] } : undefined),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

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
