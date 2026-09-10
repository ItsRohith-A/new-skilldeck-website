import { getAllServices } from "@/lib/services";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const baseUrl = "https://skilldeck.net";

  const routes = [
    "/",
    "/about-us",
    "/blog",
    "/careers",
    "/contact-us",
    "/companies",
    "/companies/schedules",
    "/cookie-policy",
    "/faq",
    "/pricing",
    "/privacy-policy",
    "/register",
    "/terms-of-service",
    "/sitemap-html",
  ];

  // Service pages are CMS-driven, so their list has to come from the API rather
  // than a hardcoded array — a newly published service was otherwise invisible
  // to search engines.
  let serviceRoutes: string[] = [];
  try {
    const services = await getAllServices();
    serviceRoutes = services
      .filter((service) => service.slug)
      .map((service) => "/services/" + service.slug);
  } catch (error) {
    console.error("Error fetching services for main sitemap", error);
  }

  const allRoutes = [...routes, ...serviceRoutes];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
      .map(
        (route) => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === "/" ? "1.0" : "0.8"}</priority>
  </url>`
      )
      .join("")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
