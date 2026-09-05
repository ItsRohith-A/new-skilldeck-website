import { cache } from "react";
import { fetchFromBackend } from "./apiProxy";

export interface PartnerLogo {
    src: string;
    alt: string;
}

/**
 * Server-side partner logos so the strip is present in the initial HTML.
 * The client component still refreshes them, but crawlers get the alt text.
 */
export const getPartnerLogos = cache(async (limit = 50): Promise<PartnerLogo[]> => {
    try {
        const res = await fetchFromBackend("/tenants", {
            queryParams: new URLSearchParams({ fields: "logo,legalName", limit: String(limit) }),
            prefix: "/api/v1/skilldeck",
            next: { tags: ["tenants"] },
        });

        if (!res.ok) return [];

        const json = await res.json();
        return (json?.data || [])
            .filter((t: { logo?: string }) => Boolean(t?.logo))
            .map((t: { logo: string; legalName?: string; name?: string }) => ({
                src: t.logo,
                alt: t.legalName || t.name || "Training Partner",
            }));
    } catch {
        return [];
    }
});
