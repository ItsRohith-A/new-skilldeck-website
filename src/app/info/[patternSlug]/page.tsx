import { notFound } from 'next/navigation';
import { env } from '@/lib/env';
import { Metadata } from 'next';
import { Suspense } from 'react';

// Components
import PatternHero from '@/components/patterns/PatternHero';
import PatternContent from '@/components/patterns/PatternContent';
import PatternSidebar from '@/components/patterns/PatternSidebar';
import CourseOverview from '@/components/category/courses/overview/CourseOverview';
import CourseFAQ from '@/components/category/courses/overview/CourseFAQ';
import CourseRelatedLinks from '@/components/category/courses/overview/CourseRelatedLinks';
import CourseAccordionSection from '@/components/category/courses/overview/CourseAccordionSection';
import TopPartnersSection from "@/components/category/courses/overview/TopPartnersSection";
import Footer from '@/components/shared/Footer';
import MainNav from '@/components/shared/Navbar';
import { SchedulesProvider } from "@/context/SchedulesContext";
import DOMPurify from "@/lib/dompurify";

import { fetchFromBackend } from "@/lib/apiProxy";
import { fetchPlans } from "@/lib/plans";
import { getAllServices } from "@/lib/services";

// Service detail sections, reused below the pattern content the same way the
// course sections are — a service pattern is a page about a service.
import { ServiceData } from "@/components/services/types";
import ServiceBenefits from "@/components/services/ServiceBenefits";
import ServiceApproach from "@/components/services/ServiceApproach";
import ServiceStrategyComponent from "@/components/services/ServiceStrategy";
import ServiceWhyOpt from "@/components/services/ServiceWhyOpt";
import ServiceBusiness from "@/components/services/ServiceBusiness";
import ServiceAddons from "@/components/services/ServiceAddons";
import ServiceMoreServicesCards from "@/components/services/ServiceMoreServicesCards";
import PricingSection from "@/components/Pricing/PricingSection";

/** Force rel="nofollow noreferrer" on every <a> tag in raw HTML */
function injectNofollow(html: string): string {
    if (!html) return "";
    return html.replace(/<a\b([^>]*?)>/gi, (match, attrs) => {
        if (/\brel=/i.test(attrs)) {
            return match.replace(/\brel="[^"]*"/i, 'rel="nofollow noreferrer"');
        }
        return `<a${attrs} rel="nofollow noreferrer">`;
    });
}

async function getPatternData(patternSlug: string) {
    try {
        const response = await fetchFromBackend(`/patterns/${patternSlug}`, {
            next: { tags: [`pattern-${patternSlug}`] }
        });

        if (!response.ok) {
            console.error(`[PatternPage] Backend fetch failed: ${response.status}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error resolving pattern data:', error);
        return null;
    }
}

async function getRelatedPatterns(parentSlug: string, patternFor: 'course' | 'service' = 'course') {
    if (!parentSlug) return [];
    try {
        const queryParams = new URLSearchParams({
            select: 'title,slug',
            patternFor,
            ...(patternFor === 'service' ? { serviceSlug: parentSlug } : { courseSlug: parentSlug }),
        });

        const res = await fetchFromBackend(`/patterns`, { queryParams });

        if (!res.ok) return [];
        const data = await res.json();
        return data.data || [];
    } catch (e) {
        console.error("Failed to fetch related patterns", e);
        return [];
    }
}

/**
 * The pattern payload carries only enough of the service to identify it, so the
 * full document is fetched from the service endpoint that already serves the
 * service page — same shape, same cache tags, no second projection to maintain.
 */
async function getServiceDetail(slug: string): Promise<ServiceData | null> {
    if (!slug) return null;
    try {
        const res = await fetchFromBackend(`/services/${slug}`, {
            next: { tags: [`service-${slug}`, 'services'] }
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data || json;
    } catch (error) {
        console.error("Failed to fetch service detail for pattern", error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ patternSlug: string }> }): Promise<Metadata> {
    const { patternSlug } = await params;
    const data = await getPatternData(patternSlug);

    if (!data || !data.pattern) {
        return {
            title: 'Pattern Not Found',
            description: 'The requested pattern could not be found.'
        };
    }

    const { pattern, seo } = data;
    const title = seo?.metaTitle || pattern.title || 'SkillDeck Training Pattern';
    const description = seo?.metaDescription || pattern.smallDescription || pattern.description || '';
    const baseUrl = env.NEXT_PUBLIC_SITE_URL || 'https://skilldeck.net';

    const patternBase = seo?.canonicalUrl
        ? (seo.canonicalUrl.startsWith('/') ? seo.canonicalUrl.slice(1) : seo.canonicalUrl)
        : `info/${patternSlug}`;
    const canonical = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}${patternBase}`;

    return {
        title,
        description,
        robots: {
            index: !seo?.metaRobots?.includes('noindex'),
            follow: !seo?.metaRobots?.includes('nofollow'),
        },
        alternates: {
            canonical: canonical,
        },
        openGraph: {
            title: seo?.ogTitle || title,
            description: seo?.ogDescription || description,
            images: seo?.ogImage ? [{ url: seo.ogImage }] : (pattern.photo?.url ? [{ url: pattern.photo.url }] : []),
        },
    };
}

export default async function PatternPage({ params }: { params: Promise<{ patternSlug: string }> }) {
    const { patternSlug } = await params;
    const data = await getPatternData(patternSlug);

    if (!data || !data.pattern) {
        return notFound();
    }

    const { pattern, course, service, seo } = data;

    // A pattern hangs off either a course or a service; only one is ever present.
    const parentTitle = course?.course_title || service?.name;

    // Fetch related patterns from whichever parent this pattern belongs to
    const relatedPatterns = service?.slug
        ? await getRelatedPatterns(service.slug, 'service')
        : course?.slug
            ? await getRelatedPatterns(course.slug, 'course')
            : [];

    // A service pattern shows the full service below its own content, mirroring
    // the course sections. Each of these degrades to nothing on failure so the
    // pattern content still renders.
    const [serviceDetail, plans, allServices] = service?.slug
        ? await Promise.all([
            getServiceDetail(service.slug),
            fetchPlans("USD").catch(() => []),
            getAllServices().catch(() => []),
        ])
        : [null, [], []];

    // Resolve internal sections
    const internalSection = seo?.internalSection || course?.internalSection;
    const bottomSection = seo?.bottomSection || course?.bottomSection;

    // FAQ items combining pattern and course FAQs
    const faqItems = pattern.faqs || course?.faqs || [];

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col">
            <MainNav />

            <main className="flex-grow">
                <PatternHero data={pattern} courseTitle={parentTitle} />

                {/* Content Layout with Sidebar */}
                <div className="container mx-auto px-4 lg:px-0 py-8 md:py-12">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                        {/* Left Sidebar */}
                        {relatedPatterns.length > 0 && (
                            <aside className="w-full lg:w-80 shrink-0">
                                <PatternSidebar
                                    patterns={relatedPatterns}
                                    currentSlug={patternSlug}
                                    courseTitle={parentTitle}
                                />
                            </aside>
                        )}

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                            {pattern.content && (
                                <article className="bg-white rounded-2xl border border-slate-200/60 p-4 md:p-8 shadow-sm mb-8">
                                    <PatternContent content={pattern.content} />
                                </article>
                            )}


                        </div>
                    </div>
                </div>

                {/* Reuse Course Components with dynamic schedules mapping */}
                {course && (
                    <div className="border-t border-slate-200/60 bg-white">
                        <Suspense fallback={
                            <div className="py-20 flex items-center justify-center">
                                <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                            </div>
                        }>
                            <SchedulesProvider>
                                <div className="container mx-auto px-2 lg:px-0 md:py-12">
                                    <TopPartnersSection courseSlug={course.slug} courseTitle={course?.course_title || course?.course_name} />
                                </div>

                                <CourseOverview
                                    data={course}
                                    courseSlug={course.slug}
                                    courseName={course.course_title}
                                />
                            </SchedulesProvider>
                        </Suspense>
                    </div>
                )}

                {/* Reuse the service sections, minus the hero and FAQ the
                    pattern page already provides of its own. */}
                {serviceDetail && (
                    <div className="border-t border-slate-200/60 bg-white">
                        <Suspense fallback={
                            <div className="py-20 flex items-center justify-center">
                                <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                            </div>
                        }>
                            <ServiceBenefits benefits={serviceDetail.benefits} />

                            <ServiceApproach
                                approach={serviceDetail.approach}
                                strategy={serviceDetail.strategy}
                                media={serviceDetail.strategy?.video || serviceDetail.strategy?.media}
                            />

                            <PricingSection plans={plans} />

                            <ServiceStrategyComponent strategy={serviceDetail.strategy} />

                            <ServiceWhyOpt whyopt={serviceDetail.whyopt} />

                            <ServiceBusiness business={serviceDetail.business} />

                            <ServiceAddons addons={serviceDetail.addons} />

                            <ServiceMoreServicesCards
                                services={allServices}
                                currentSlug={serviceDetail.slug || service.slug}
                                currentName={serviceDetail.name}
                            />
                        </Suspense>
                    </div>
                )}


                {/* FAQs Section */}
                {faqItems.length > 0 && (
                    <div className="container mx-auto px-4 py-8 border-t border-slate-200/60">
                        <CourseFAQ items={faqItems} />
                    </div>
                )}
                {/* Bottom & Internal Link Sections */}
                {(internalSection?.value || bottomSection?.value) && (
                    <div className="space-y-6 container mx-auto px-4 py-8">
                        {bottomSection?.value && (
                            <CourseAccordionSection
                                title={bottomSection.title}
                                value={injectNofollow(DOMPurify.sanitize(bottomSection.value))}
                            />
                        )}
                        {internalSection?.value && (
                            <CourseRelatedLinks
                                title={internalSection.title}
                                value={injectNofollow(DOMPurify.sanitize(internalSection.value))}
                            />
                        )}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
