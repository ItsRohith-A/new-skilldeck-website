import { getAllPatterns } from "@/lib/patterns";
import { getAllServices } from "@/lib/services";
import { urlsetXml, xmlResponse } from "@/lib/sitemap";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
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
    "/grievance-redressal",
    "/pricing",
    "/privacy-policy",
    "/refund-policy",
    "/register",
    "/terms-of-service",
    "/web-templates",
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

  // Pattern pages (/info/<slug>) are the landing pages the redirect table
  // points the retired /services/* and *-software URLs at. They were in no
  // sitemap, so nothing told Google the destinations still existed.
  let patternRoutes: string[] = [];
  try {
    const patterns = await getAllPatterns();
    patternRoutes = patterns.map((pattern) => "/info/" + pattern.slug);
  } catch (error) {
    console.error("Error fetching patterns for main sitemap", error);
  }

  const allRoutes = [...routes, ...serviceRoutes, ...patternRoutes];

  return xmlResponse(urlsetXml(
    allRoutes.map((route) => ({ path: route, priority: route === "/" ? "1.0" : "0.8" }))
  ));
}
