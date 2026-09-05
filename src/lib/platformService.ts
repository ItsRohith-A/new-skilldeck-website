import { env } from "./env";
import { cache } from "react";

const BASE_URL = `${env.SERVER_URL}/api/v1/skilldeck`; // Internal Backend URL

export interface PlatformBlog {
    _id: string;
    title: string;
    slug: string;
    smallDescription: string;
    thumbnail: string;
    tenantId: string;
    bidAmount?: number;
    createdAt: string;
}

export interface PlatformSchedule {
    _id: string;
    product: {
        title: string;
        slug: string;
    };
    startsAt: string;
    endsAt: string;
    tenantId: string;
    bidAmount?: number;
}

export async function getBlogs(page = 1, limit = 20) {
    try {
        const res = await fetch(`${BASE_URL}/blogs?page=${page}&limit=${limit}`, {
            next: { tags: ['blogs'] }
        });
        if (!res.ok) throw new Error("Failed to fetch blogs");
        return await res.json();
    } catch (error: unknown) {
        const err = error as any;
        if (err?.cause?.code === 'ECONNREFUSED' || err?.cause?.code === 'ETIMEDOUT' || err?.message?.includes('fetch failed') || err?.message?.includes('Failed to fetch')) {
            if (!(global as any)._backendUnreachable_getBlogs) {
                console.warn('Warning: Backend not reachable (getBlogs). Returning empty blogs.');
                (global as any)._backendUnreachable_getBlogs = true;
            }
        } else {
            console.error("Error fetching blogs:", error);
        }
        return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }
}

export const getSchedules = cache(async (params: {
    page?: number;
    limit?: number;
    slug?: string;
    timezone?: string;
    currency?: string;
    category?: string;
    tenantId?: string;
} = {}, pageUrl?: string) => {

    try {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.slug) queryParams.append('slug', params.slug);
        if (params.tenantId) queryParams.append('tenantId', params.tenantId);
        if (params.timezone) queryParams.append('timezone', params.timezone);
        if (params.currency) queryParams.append('currency', params.currency);
        if (params.category) queryParams.append('category', params.category);

        const finalUrl = `${BASE_URL}/schedules?${queryParams.toString()}`;
        console.log("[platformService] getSchedules URL:", finalUrl);

        const res = await fetch(finalUrl, {
            next: { tags: ['schedules'] }
        });
        if (!res.ok) throw new Error("Failed to fetch schedules");

        const cacheStatus = res.headers.get('x-cache');
        if (cacheStatus && cacheStatus.toUpperCase().includes('MISS') && pageUrl) {
            import("./cloudflare").then(({ purgeCloudflareCache }) => {
                purgeCloudflareCache([pageUrl]).catch(err => {
                    console.error("[Cloudflare Purge Error] in getSchedules:", err);
                });
            }).catch(err => {
                console.error("[Import Error] cloudflare in getSchedules:", err);
            });
        }

        return await res.json();
    } catch (error: unknown) {
        const err = error as any;
        if (err?.cause?.code === 'ECONNREFUSED' || err?.cause?.code === 'ETIMEDOUT' || err?.message?.includes('fetch failed') || err?.message?.includes('Failed to fetch')) {
            if (!(global as any)._backendUnreachable_getSchedules) {
                console.warn('Warning: Backend not reachable (getSchedules). Returning empty structure.');
                (global as any)._backendUnreachable_getSchedules = true;
            }
        } else {
            console.error("Error fetching schedules:", error);
        }
        return { data: [], tenants: [], meta: { total: 0, page: params.page || 1, limit: params.limit || 20, totalPages: 0 } };
    }
});

export async function trackAction(data: {
    tenantId: string;
    contentType: "blog" | "schedule" | "listing";
    contentId: string;
    contentSlug: string;
    contentTitle: string;
    action: "view" | "click" | "lead";
}) {
    const url = `${BASE_URL}/track`;
    await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-ip": "122.172.86.48" },
        body: JSON.stringify(data),
    }).catch(console.error);
}

export async function getTenants(params: {
    page?: number;
    limit?: number;
    featured?: boolean;
    timezone?: string;
    currency?: string;
    userIp?: string;
    search?: string;
} = {}) {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append('fields', 'id,name,legalName,slug,logo,industry,companySize,foundedYear,address,platformProfile[shortDescription,description,trainingAreas,website]');

        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        else queryParams.append('limit', '12');

        if (params.featured !== undefined) {
            queryParams.append('featured', params.featured.toString());
        }

        if (params.timezone) queryParams.append('timezone', params.timezone);
        if (params.currency) queryParams.append('currency', params.currency);
        if (params.search) queryParams.append('search', params.search);

        const res = await fetch(`${BASE_URL}/tenants?${queryParams.toString()}`, {
            headers: {
                "x-user-ip": params.userIp || "127.0.0.1"
            },
            cache: "no-store"
        });

        if (!res.ok) throw new Error("Failed to fetch tenants");
        return await res.json();
    } catch (error: unknown) {
        const err = error as any;
        if (err?.cause?.code === 'ECONNREFUSED' || err?.cause?.code === 'ETIMEDOUT' || err?.message?.includes('fetch failed') || err?.message?.includes('Failed to fetch')) {
            if (!(global as any)._backendUnreachable_getTenants) {
                console.warn('Warning: Backend not reachable (getTenants). Returning empty tenants.');
                (global as any)._backendUnreachable_getTenants = true;
            }
        } else {
            console.error("Error fetching tenants:", error);
        }
        return { data: [], total: 0, page: params.page || 1, totalPages: 1 };
    }
}

export async function getTenantProfile(id: string) {
    try {
        const res = await fetch(`${BASE_URL}/tenants/${id}?fields=all`, {
            next: { tags: ['tenants'] }
        });
        if (!res.ok) {
            return null;
        }
        return await res.json();
    } catch (error: any) {
        if (error?.cause?.code === 'ECONNREFUSED' || error?.message?.includes('fetch failed')) {
            // Backend offline
        } else {
            console.error(`Error fetching tenant profile for ${id}:`, error);
        }
        return null;
    }
}
