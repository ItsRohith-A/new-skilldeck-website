import Link from "next/link";
import MainNav from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import type { Metadata } from "next";
import { getAllServices } from "@/lib/services";

export const metadata: Metadata = {
    title: "HTML Sitemap | SkillDeck",
    robots: { index: true, follow: true },
    alternates: { canonical: "/sitemap-html" },
};

const categories = [
    {
        title: "GENERAL",
        links: [
            { name: "home", href: "/" },
            { name: "blog", href: "/blog" },
            { name: "careers", href: "/careers" },
            { name: "contact us", href: "/contact-us" },
            { name: "companies", href: "/companies" },
            { name: "faq", href: "/faq" },
            { name: "pricing", href: "/pricing" },
            { name: "about us", href: "/about-us" },
            { name: "register", href: "/register" },
        ]
    },
    {
        title: "LEGAL",
        links: [
            { name: "privacy policy", href: "/privacy-policy" },
            { name: "terms of service", href: "/terms-of-service" },
            { name: "cookie policy", href: "/cookie-policy" },
        ]
    }
];

export default async function SitemapPage() {
    // Service pages exist only in the CMS, so this page — the one crawlers use to
    // reach everything — has to read them at request time.
    let serviceLinks: { name: string; href: string }[] = [];
    try {
        const services = await getAllServices();
        serviceLinks = services
            .filter((service) => service.slug)
            .map((service) => ({
                name: service.service_name || service.slug,
                href: `/services/${service.slug}`,
            }));
    } catch (error) {
        console.error("Error fetching services for the HTML sitemap", error);
    }

    const sections = serviceLinks.length > 0
        ? [categories[0], { title: "SERVICES", links: serviceLinks }, ...categories.slice(1)]
        : categories;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <MainNav />
            <main className="flex-1 py-20 lg:py-32 px-4 lg:px-0">
                <div className="container mx-auto">
                    <h1 className="heading-section mb-8">HTML Sitemap</h1>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 mb-10">
                        <div className="space-y-10">
                            {sections.map((category, idx) => (
                                <div key={idx}>
                                    <div className="bg-gray-100 border-l-4 border-brand-primary py-2 px-4 mb-4 rounded-r-lg">
                                        <h2 className="body-small font-bold text-brand-dark tracking-wider uppercase">
                                            {category.title}
                                        </h2>
                                    </div>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 list-disc list-inside px-4">
                                        {category.links.map((link, lidx) => (
                                            <li key={lidx} className="text-gray-600 marker:text-gray-400">
                                                <Link
                                                    href={link.href}
                                                    className="body-small hover:text-brand-primary hover:underline transition-colors capitalize decoration-1 underline-offset-4"
                                                >
                                                    {link.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                        <Link href="/" className="text-brand-primary font-medium hover:underline flex items-center gap-2 body-small">
                            ← Back to homepage
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
