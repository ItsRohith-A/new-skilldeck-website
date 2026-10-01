import { fetchFromBackend } from "@/lib/apiProxy";
import { isNoindex, SitemapUrl, unavailableResponse, urlsetXml, xmlResponse } from "@/lib/sitemap";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

async function fetchSitemapData(queryParams: Record<string, string>): Promise<any[]> {
    const res = await fetchFromBackend('/sitemap', { queryParams: new URLSearchParams(queryParams) });
    if (!res.ok) throw new Error(`/sitemap ${JSON.stringify(queryParams)} responded ${res.status}`);
    const data = await res.json();
    return data.data || [];
}

export async function GET(request: NextRequest, context: { params: Promise<Record<string, string>> }): Promise<Response> {
    const params = await context.params;
    const slug: string = params.slug || params["slug.xml"] || "";
    const categorySlug = slug.replace(/\.xml$/, '');

    try {
        // Only a 404 means the category does not exist. Anything else is the
        // backend failing, which must not reach Google as a 404 — that makes it
        // drop the whole sitemap.
        const categoryRes = await fetchFromBackend(`/categories/${encodeURIComponent(categorySlug)}`);
        if (categoryRes.status === 404) {
            return new Response("Not Found", { status: 404 });
        }
        if (!categoryRes.ok) {
            throw new Error(`/categories/${categorySlug} responded ${categoryRes.status}`);
        }
        const category = await categoryRes.json();

        const courses = await fetchSitemapData({ select: 'courses', category: categorySlug });

        // A noindex category page is left out, but its courses carry their own
        // robots setting and stay listed — this sitemap is the only place they
        // are submitted from.
        const urls: SitemapUrl[] = isNoindex(category.metaRobots)
            ? []
            : [{ path: `/${categorySlug}`, priority: '0.9' }];

        for (const course of courses) {
            urls.push({ path: `/${categorySlug}/${course.course_slug}`, priority: '0.8' });
        }

        // A failed location lookup fails the whole sitemap rather than serving it
        // with those pages missing.
        const locationResults = await Promise.all(
            courses.map((course: any) => fetchSitemapData({ select: 'location', course: course.course_slug }))
        );
        for (const locations of locationResults) {
            for (const loc of locations) {
                urls.push({ path: `/${categorySlug}/${loc.location_slug}`, priority: '0.7' });
            }
        }

        return xmlResponse(urlsetXml(urls));
    } catch (error) {
        console.error(`Error generating category sitemap for ${categorySlug}:`, error);
        return unavailableResponse();
    }
}
