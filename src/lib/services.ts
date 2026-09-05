import { fetchFromBackend } from "./apiProxy";
import { cache } from "react";

export interface ServiceCardSummary {
    tagline?: string;
    title?: string;
    icon?: string;
    thumbnail?: string;
    content?: string;
    ratings?: string;
    clients?: string;
    points?: string[];
}

export interface ServiceItem {
    slug: string;
    service_name: string;
    name?: string;
    order?: number;
    category_slug: string;
    servicecard?: ServiceCardSummary;
}

export interface CategoryWithServices {
    _id: string;
    name: string;
    slug: string;
    services: ServiceItem[];
    order?: number;
}

export const getServicesCategories = cache(async (): Promise<CategoryWithServices[]> => {
    try {
        // 1. Fetch categories
        const catRes = await fetchFromBackend("/service-categories", {
            queryParams: new URLSearchParams({
                select: "_id,name,slug,order",
                sort: "order",
                limit: "100",
            }),
            cache: "force-cache",
            next: { tags: ['service-categories', 'services'] },
        });

        if (!catRes.ok) return [];
        const catData = await catRes.json();
        const categories = catData.data || [];

        // 2. Fetch all services
        const servicesRes = await fetchFromBackend("/services", {
            queryParams: new URLSearchParams({
                limit: "100",
                select: "name,slug,servicecard,order,service_category_slug,serviceCategory"
            }),
            cache: "force-cache",
            next: { tags: ['service-categories', 'services'] },
        });

        const servicesData = servicesRes.ok ? await servicesRes.json() : { data: [] };
        const allServices = servicesData.data || [];

        // 3. Map services into categories using in-memory filtering by serviceCategory.slug or service_category_slug
        const categoriesWithServices = categories.map((cat: any) => {
            const services = allServices
                .filter((s: any) => {
                    const catSlug = s.service_category_slug || s.serviceCategory?.slug;
                    return catSlug === cat.slug;
                })
                .map((s: any) => ({
                    slug: s.slug,
                    service_name: s.name || s.service_name || "Untitled Service",
                    name: s.name,
                    order: s.order || 0,
                    category_slug: cat.slug,
                    servicecard: s.servicecard
                }))
                .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

            return {
                _id: cat._id,
                name: cat.name,
                slug: cat.slug,
                order: cat.order || 0,
                services
            };
        });

        return categoriesWithServices.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    } catch (error) {
        console.error("Error fetching categories and services:", error);
        return [];
    }
});


/**
 * Flat list of every published service. The platform currently runs a single
 * service category, so the home page lists services directly rather than
 * grouping them behind category tabs.
 */
export const getAllServices = cache(async (): Promise<ServiceItem[]> => {
    const categories = await getServicesCategories();
    return categories
        .flatMap((cat) => cat.services || [])
        .sort((a, b) => (a.order || 0) - (b.order || 0));
});
