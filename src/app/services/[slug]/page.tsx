import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchFromBackend } from "@/lib/apiProxy";
import { env } from "@/lib/env";
import MainNav from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CourseRelatedLinks from "@/components/category/courses/overview/CourseRelatedLinks";
import CourseAccordionSection from "@/components/category/courses/overview/CourseAccordionSection";
import { fetchPlans } from "@/lib/plans";
import { getServicesCategories } from "@/lib/services";

// Import modular components
import { ServiceData } from "@/components/services/types";
import ServiceHero from "@/components/services/ServiceHero";
import ServiceHeroCentered from "@/components/services/ServiceHeroCentered";
import ServiceHeroDark from "@/components/services/ServiceHeroDark";
import ServiceWhyChooseUs from "@/components/services/ServiceWhyChooseUs";
import ServiceBenefits from "@/components/services/ServiceBenefits";
import ServiceApproach from "@/components/services/ServiceApproach";
import ServiceAddons from "@/components/services/ServiceAddons";
import ServiceStrategyComponent from "@/components/services/ServiceStrategy";
import ServiceWhyOpt from "@/components/services/ServiceWhyOpt";
import ServiceBusiness from "@/components/services/ServiceBusiness";
import ServiceFaq from "@/components/services/ServiceFaq";
import ServiceChapterDots, { ServiceChapterItem } from "@/components/services/ServiceChapterDots";
import ServiceMobileCta from "@/components/services/ServiceMobileCta";
import PricingSection from "@/components/Pricing/PricingSection";

export const revalidate = false; // Pure On-Demand ISR: cached permanently on Edge CDN until webhook purge

export async function generateStaticParams() {
    try {
        const categories = await getServicesCategories();
        const slugs = new Set<string>();
        categories.forEach(cat => {
            (cat.services || []).forEach(svc => {
                if (svc.slug) slugs.add(svc.slug);
            });
        });
        return Array.from(slugs).map(slug => ({ slug }));
    } catch (error) {
        console.error("Error generating static params for services:", error);
        return [];
    }
}

interface ServiceParams {
    slug: string;
}

// Function to fetch service data
async function getServiceData(slug: string, pageUrl?: string): Promise<ServiceData | null> {
    try {
        const response = await fetchFromBackend(`/services/${slug}`, {
            next: { tags: [`service-${slug}`, 'services'] }
        });

        if (!response.ok) {
            return null;
        }

        const cacheStatus = response.headers.get('x-cache');
        if (cacheStatus && cacheStatus.toUpperCase().includes('MISS') && pageUrl) {
            import("@/lib/cloudflare").then(({ purgeCloudflareCache }) => {
                purgeCloudflareCache([pageUrl]).catch(err => {
                    console.error("[Cloudflare Purge Error] in getServiceData:", err);
                });
            }).catch(err => {
                console.error("[Import Error] cloudflare:", err);
            });
        }

        const json = await response.json();
        return json.data || json;
    } catch (error) {
        console.error("Error fetching service:", error);
        return null;
    }
}

// Metadata Generator
export async function generateMetadata({ params }: { params: Promise<ServiceParams> }): Promise<Metadata> {
    const { slug } = await params;
    const baseUrl = env.NEXT_PUBLIC_SITE_URL || 'https://skilldeck.net';
    const pageUrl = `${baseUrl.replace(/\/$/, '')}/services/${slug}`;

    const service = await getServiceData(slug, pageUrl);

    if (!service) {
        return {
            title: "Service Not Found",
        };
    }

    const ogImage = service.ogImage || service.banner?.media?.url || service.servicecard?.thumbnail;

    return {
        title: service.metaTitle || `${service.name} | SkillDeck`,
        description: service.metaDescription,
        keywords: service.keywords,
        robots: service.metaRobots || {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: pageUrl,
        },
        openGraph: {
            title: service.ogTitle || service.metaTitle || service.name,
            description: service.ogDescription || service.metaDescription,
            url: pageUrl,
            type: "website",
            ...(ogImage ? { images: [{ url: ogImage, alt: service.banner?.media?.alt || service.name }] } : {}),
        },
        ...(ogImage
            ? {
                twitter: {
                    card: "summary_large_image" as const,
                    title: service.ogTitle || service.metaTitle || service.name,
                    description: service.ogDescription || service.metaDescription,
                    images: [ogImage],
                },
            }
            : {}),
    };
}

// Service Page Component
export default async function ServicePage({ params }: { params: Promise<ServiceParams> }) {
    const { slug } = await params;
    const siteUrl = env.NEXT_PUBLIC_SITE_URL || 'https://skilldeck.net';
    const pageUrl = `${siteUrl.replace(/\/$/, '')}/services/${slug}`;

    const [service, plans] = await Promise.all([
        getServiceData(slug, pageUrl),
        fetchPlans("USD")
    ]);

    if (!service) {
        notFound();
    }

    // JSON-LD Schemas
    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": service.name,
        "description": service.metaDescription || service.name,
        "provider": {
            "@type": "Organization",
            "name": "SkillDeck",
            "sameAs": "https://www.skilldeck.net"
        }
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": siteUrl
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Services",
                "item": `${siteUrl}/services`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": service.name,
                "item": pageUrl
            }
        ]
    };

    let serviceFaqSchema: any = null;
    if (service.faqs?.accordions && service.faqs.accordions.length > 0) {
        serviceFaqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "name": `FAQ for ${service.name}`,
            "mainEntity": service.faqs.accordions.map((faq: any) => ({
                "@type": "Question",
                "name": faq.title,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.description?.replace(/<[^>]*>?/gm, '')
                }
            }))
        };
    }

    // Section presence — drives the chapter rail on the right edge
    const hasWhy = Boolean(service.whyservice?.title) || (service.whyservice?.points || []).length > 0;
    const hasBenefits = (service.benefits?.points || []).length > 0;
    const hasApproach =
        (service.approach?.steps || []).length > 0 ||
        (service.approach?.kpis?.kpiCategory || []).length > 0 ||
        (service.approach?.tools?.content || []).length > 0;
    const hasStrategy = (service.strategy?.points || []).length > 0 || (service.strategy?.stats || []).length > 0;
    const hasWhyOpt = (service.whyopt?.points || []).length > 0 || (service.whyopt?.stats || []).length > 0;
    const hasBusiness = (service.business?.points || []).length > 0 || (service.business?.stats || []).length > 0;
    const hasAddons =
        (service.addons?.cards || []).length > 0 ||
        (service.addons?.content?.points || []).length > 0 ||
        (service.addons?.highlight?.points || []).length > 0;
    const hasFaq = (service.faqs?.accordions || []).some((f) => f?.title);

    const chapters: ServiceChapterItem[] = [
        ...(hasWhy ? [{ id: "why", label: "The Reality" }] : []),
        ...(hasBenefits ? [{ id: "benefits", label: "The Outcome" }] : []),
        ...(hasApproach ? [{ id: "approach", label: "How We Work" }] : []),
        ...(hasStrategy ? [{ id: "strategy", label: "Strategy" }] : []),
        ...(hasWhyOpt ? [{ id: "credentials", label: "Why SkillDeck" }] : []),
        ...(hasBusiness ? [{ id: "expertise", label: "Our Expertise" }] : []),
        ...(hasAddons ? [{ id: "addons", label: "Add-Ons" }] : []),
        { id: "plans", label: "Plans" },
        ...(hasFaq ? [{ id: "faq", label: "FAQ" }] : []),
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            {serviceFaqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceFaqSchema) }}
                />
            )}
            <MainNav />

            <main className="flex-1">
                {/* Hero Section */}
                <ServiceHero
                    banner={service.banner}
                    servicestats={service.servicestats}
                    serviceName={service.name}
                    servicecard={service.servicecard}
                    serviceCategory={service.serviceCategory}
                    fallbackTagline={service.servicecard?.tagline}
                    description={service.description}
                    highlights={service.whyservice?.points}
                    brochureUrl={service.leadmagnet?.[0]?.broucher?.url}
                    clientsCount={service.servicecard?.clients}
                />

                {/* ── Hero variants under client review ────────────────────────────
                    Two alternative layouts render below the live hero so the client
                    can compare them on real content. Delete these three blocks and
                    the two imports once a direction is picked. */}
                <HeroVariantLabel index="02" name="Centered spotlight" note="Message-first, product shot as a wide stage" />
                <ServiceHeroCentered
                    banner={service.banner}
                    servicestats={service.servicestats}
                    serviceName={service.name}
                    servicecard={service.servicecard}
                    serviceCategory={service.serviceCategory}
                    fallbackTagline={service.servicecard?.tagline}
                    description={service.description}
                    highlights={service.whyservice?.points}
                    brochureUrl={service.leadmagnet?.[0]?.broucher?.url}
                    clientsCount={service.servicecard?.clients}
                />

                <HeroVariantLabel index="03" name="Dark immersive" note="Inverted stage, glass proof strip" />
                <ServiceHeroDark
                    banner={service.banner}
                    servicestats={service.servicestats}
                    serviceName={service.name}
                    servicecard={service.servicecard}
                    serviceCategory={service.serviceCategory}
                    fallbackTagline={service.servicecard?.tagline}
                    description={service.description}
                    highlights={service.whyservice?.points}
                    brochureUrl={service.leadmagnet?.[0]?.broucher?.url}
                    clientsCount={service.servicecard?.clients}
                />

                {/* Chapter rail */}
                <ServiceChapterDots items={chapters} />

                {/* 01 — Why Choose Us */}
                <ServiceWhyChooseUs
                    whyservice={service.whyservice}
                    serviceName={service.name}
                />

                {/* 02 — Benefits */}
                <ServiceBenefits benefits={service.benefits} />

                {/* 03 — Our Approach / Framework */}
                <ServiceApproach approach={service.approach} media={service.strategy?.media} />

                {/* Pricing Plans Section */}
                <PricingSection plans={plans} />

                {/* 04 — Strategy Section */}
                <ServiceStrategyComponent strategy={service.strategy} />

                {/* 05 — Why Opt / Core Value Proposition */}
                <ServiceWhyOpt whyopt={service.whyopt} />

                {/* 06 — Business / Our Expertise Section */}
                <ServiceBusiness business={service.business} />

                {/* 07 — Highlight & Addons Section */}
                <ServiceAddons addons={service.addons} />

                {/* 08 — FAQ Accordion Section */}
                <ServiceFaq faqs={service.faqs} serviceName={service.name} />

                {/* Bottom and Internal Sections */}
                {(service.bottomSection?.value || service.internalSection?.value) && (
                    <div className="container mx-auto px-2 lg:px-0 pb-12 md:pb-16 2xl:pb-20 space-y-6">
                        {service.bottomSection?.value && (
                            <CourseAccordionSection
                                title={service.bottomSection.title || ""}
                                value={service.bottomSection.value || ""}
                            />
                        )}
                        {service.internalSection?.value && (
                            <CourseRelatedLinks
                                title={service.internalSection.title || ""}
                                value={service.internalSection.value || ""}
                            />
                        )}
                    </div>
                )}
            </main>

            <ServiceMobileCta serviceName={service.name} />

            <Footer />
        </div>
    );
}

/** Review-only separator between the hero variants; remove with the variants. */
function HeroVariantLabel({ index, name, note }: { index: string; name: string; note: string }) {
    return (
        <div className="border-y border-dashed border-slate-300 bg-slate-100/70">
            <div className="container mx-auto px-2 lg:px-0 py-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-brand-primary">
                    Hero option {index}
                </span>
                <span className="text-sm font-bold text-brand-dark">{name}</span>
                <span className="text-xs text-brand-muted">{note}</span>
            </div>
        </div>
    );
}
