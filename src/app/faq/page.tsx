import MainNav from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import FaqClient from "@/components/Faq/FaqClient";
import CourseAccordionSection from "@/components/category/courses/overview/CourseAccordionSection";
import CourseRelatedLinks from "@/components/category/courses/overview/CourseRelatedLinks";
import { fetchFaqPage } from "@/lib/faqs";
import { env } from "@/lib/env";
import type { Metadata } from 'next';

export const revalidate = false; // Pure On-Demand ISR: purged by the CMS "faqs" revalidation

const DEFAULT_TITLE = "Frequently Asked Questions | SkillDeck";
const DEFAULT_DESCRIPTION = "Find clear answers to common questions about SkillDeck's multi-site architecture, workflow automations, hosting infrastructure, multi-currency CRM payments, security compliance, and platform features.";

const getSiteUrl = () => (env.NEXT_PUBLIC_SITE_URL || "https://skilldeck.net").replace(/\/$/, "");

/** "noindex, follow" → { index: false, follow: true } */
function parseRobots(value?: string): Metadata["robots"] {
    if (!value) return { index: true, follow: true };
    const v = value.toLowerCase();
    return { index: !v.includes("noindex"), follow: !v.includes("nofollow") };
}

export async function generateMetadata(): Promise<Metadata> {
    const { seo } = await fetchFaqPage();
    const title = seo?.metaTitle || DEFAULT_TITLE;
    const description = seo?.metaDescription || DEFAULT_DESCRIPTION;
    // The CMS stores "faq" as the default canonical; anything else is a deliberate override.
    const canonical = seo?.canonicalUrl && seo.canonicalUrl !== "faq" ? seo.canonicalUrl : "/faq";

    return {
        title,
        description,
        ...(seo?.keywords?.length ? { keywords: seo.keywords } : {}),
        robots: parseRobots(seo?.metaRobots),
        alternates: { canonical },
        openGraph: {
            title: seo?.ogTitle || title,
            description: seo?.ogDescription || description,
            url: `${getSiteUrl()}/faq`,
            type: "website",
            ...(seo?.ogImage ? { images: [{ url: seo.ogImage }] } : {}),
        },
    };
}

export default async function FaqPage() {
    const { faqs, categories, seo } = await fetchFaqPage();
    const siteUrl = getSiteUrl();

    // The list is filtered client-side by search and category, but the schema
    // describes the page's full set — that is what FaqClient starts with and
    // what stays in the DOM once a filter is cleared.
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${siteUrl}/faq#faq`,
        "url": `${siteUrl}/faq`,
        "name": seo?.metaTitle || DEFAULT_TITLE,
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answerText
            }
        }))
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/10 to-white flex flex-col">
            {faqs.length > 0 && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
                />
            )}
            <MainNav />
            <main className="flex-1">
                <FaqClient
                    faqs={faqs}
                    categories={categories}
                    seoSections={
                        // Same SEO blocks as service and blog pages: "SEO Rich Content" then "SEO Internal section".
                        (seo?.bottomSection?.value || seo?.internalSection?.value) ? (
                            <div className="container mx-auto max-w-6xl px-4 lg:px-0 pb-12 md:pb-16 space-y-6">
                                {seo?.bottomSection?.value && (
                                    <CourseAccordionSection
                                        title={seo.bottomSection.title || ""}
                                        value={seo.bottomSection.value}
                                    />
                                )}
                                {seo?.internalSection?.value && (
                                    <CourseRelatedLinks
                                        title={seo.internalSection.title || ""}
                                        value={seo.internalSection.value}
                                    />
                                )}
                            </div>
                        ) : null
                    }
                />
            </main>
            <Footer />
        </div>
    );
}
