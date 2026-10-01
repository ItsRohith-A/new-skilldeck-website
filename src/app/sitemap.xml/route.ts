import { fetchFromBackend } from "@/lib/apiProxy";
import { fetchAllPages, sitemapIndexXml, unavailableResponse, xmlResponse } from "@/lib/sitemap";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
    // `/sitemap?select=category` leaves out any category whose own page is
    // noindex — but the courses under it can still be indexable, and this index
    // was the only thing pointing at their sitemap. The full category list is
    // the source of truth; the per-category sitemap drops the noindex category
    // URL itself.
    let slugs: string[];
    try {
        const [categories, sitemapCategories] = await Promise.all([
            fetchAllPages<{ slug?: string }>('/categories', { select: 'slug' }),
            fetchFromBackend('/sitemap', { queryParams: new URLSearchParams({ select: 'category' }) })
                .then(async (res) => {
                    if (!res.ok) return [];
                    const data = await res.json();
                    return (Array.isArray(data) ? data : (data.data || [])) as { slug?: string }[];
                })
                .catch(() => []),
        ]);

        slugs = [...new Set(
            [...sitemapCategories, ...categories]
                .map((category) => category.slug)
                .filter((slug): slug is string => Boolean(slug))
        )];
    } catch (error) {
        console.error("Error fetching categories for sitemap index", error);
        return unavailableResponse();
    }

    return xmlResponse(sitemapIndexXml([
        '/main-sitemap.xml',
        '/blogs-sitemap.xml',
        ...slugs.map((slug) => `/${slug}.xml`),
    ]));
}
