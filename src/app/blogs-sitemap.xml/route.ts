import { fetchAllPages, unavailableResponse, urlsetXml, xmlResponse } from "@/lib/sitemap";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
    try {
        const blogs = await fetchAllPages('/blogs');

        return xmlResponse(urlsetXml(
            blogs
                .filter((blog: any) => blog.slug)
                .map((blog: any) => ({
                    path: `/blog/${blog.slug}`,
                    lastmod: blog.updatedAt || blog.createdAt,
                    priority: '0.7',
                }))
        ));
    } catch (error) {
        console.error("Error generating blogs sitemap:", error);
        return unavailableResponse();
    }
}
