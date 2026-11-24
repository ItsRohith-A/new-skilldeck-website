import { redirectOrNotFound } from '@/lib/redirects';
import { buildCanonical } from '@/lib/canonical';
import { env } from '@/lib/env';
import { Metadata } from 'next';
import { Suspense, cache } from 'react';

// Components
import PatternHero from '@/components/patterns/PatternHero';
import PatternContent from '@/components/patterns/PatternContent';
import PatternSidebar from '@/components/patterns/PatternSidebar';
// Course and service patterns both repeat their parent page's body verbatim.
// Both halves now load client-side, after a user gesture, so each pattern URL
// carries only its own editorial content. See the components for the reasoning.
import CourseOverviewGated from '@/components/category/courses/overview/CourseOverviewGated';
import PatternServiceSections from '@/components/patterns/PatternServiceSections';
import CourseFAQ from '@/components/category/courses/overview/CourseFAQ';
import CourseRelatedLinks from '@/components/category/courses/overview/CourseRelatedLinks';
import CourseAccordionSection from '@/components/category/courses/overview/CourseAccordionSection';
import TopPartnersSection from "@/components/category/courses/overview/TopPartnersClientWrapper";
import Footer from '@/components/shared/Footer';
import MainNav from '@/components/shared/Navbar';
import { SchedulesProvider } from "@/context/SchedulesContext";
import DOMPurify from "@/lib/dompurify";

import { fetchFromBackend } from "@/lib/apiProxy";
import { getAllPatterns } from "@/lib/patterns";

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

export async function generateStaticParams() {
    const patterns = await getAllPatterns();
    return patterns.map((pattern) => ({ patternSlug: pattern.slug }));
}

export const revalidate = false; // Pure On-Demand ISR: held on the CDN until a webhook purge

const getPatternData = cache(async (patternSlug: string) => {
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
});

const getRelatedPatterns = cache(async (parentSlug: string, patternFor: 'course' | 'service' = 'course') => {
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
});

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
    // The CMS seeds this field automatically and nothing in the admin can edit
    // it, so every stored value points outside this section — either at a
    // deleted /services/* URL or at a bare slug that resolves to a 404. Only a
    // canonical already inside /info/ is honoured (one pattern declared a
    // duplicate of another); anything else is discarded and the page declares
    // its own address, which is correct for all 58 records as they stand.
    const storedCanonical = seo?.canonicalUrl?.startsWith("/info/")
        ? seo.canonicalUrl
        : undefined;

    const canonical = buildCanonical({
        stored: storedCanonical,
        fallbackPath: `/info/${patternSlug}`,
    });

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
        return await redirectOrNotFound(`/info/${patternSlug}`);
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


    // Resolve internal sections.
    //
    // The `|| course?.*` fallbacks are deliberately gone: they put the course's
    // copy on every pattern that hangs off it, which is the duplication this
    // page is being trimmed for. A pattern shows its own SEO sections or none.
    const internalSection = seo?.internalSection;
    const bottomSection = seo?.bottomSection;

    // An empty array is truthy, so length is what decides whether this pattern
    // really has FAQs of its own. The course's FAQs are duplicate content and
    // now load with the rest of the course body, behind the gate.
    const faqItems = Array.isArray(pattern.faqs) && pattern.faqs.length > 0 ? pattern.faqs : [];

    // These pages carry the FAQs and sit three or four levels deep, but shipped
    // no structured data at all — the course and service pages both mark up the
    // equivalent content.
    const siteUrl = (env.NEXT_PUBLIC_SITE_URL || "https://skilldeck.net").replace(/\/$/, "");

    const faqSchema = faqItems.length > 0
        ? {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "name": `FAQ for ${pattern.title}`,
            "mainEntity": faqItems.map((faq: any) => ({
                "@type": "Question",
                "name": faq.title,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": (faq.value || faq.answer)?.replace(/<[^>]*>?/gm, '')
                }
            }))
        }
        : null;

    // A pattern hangs off a service or a course, so the trail differs by parent.
    const crumbs: { name: string; item: string }[] = [{ name: "Home", item: siteUrl }];
    if (service?.slug) {
        crumbs.push({ name: service.name || "Services", item: `${siteUrl}/services/${service.slug}` });
    } else if (course?.category?.slug) {
        crumbs.push({ name: course.category.name || "Courses", item: `${siteUrl}/${course.category.slug}` });
        if (course.slug) {
            crumbs.push({
                name: course.course_title || course.slug,
                item: `${siteUrl}/${course.category.slug}/${course.slug}`,
            });
        }
    }
    crumbs.push({ name: pattern.title || patternSlug, item: `${siteUrl}/info/${patternSlug}` });

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": crumbs.map((crumb, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": crumb.name,
            "item": crumb.item
        }))
    };

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
            <MainNav />

            <main className="flex-grow">
                <PatternHero data={pattern} courseTitle={parentTitle} patternSlug={patternSlug} />

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
                                <div className="container mx-auto px-4 lg:px-0 md:py-12">
                                    <TopPartnersSection courseSlug={course.slug} courseTitle={course?.course_title || course?.course_name} />
                                </div>

                                <CourseOverviewGated
                                    courseSlug={course.slug}
                                    courseTitle={course.course_title}
                                />
                            </SchedulesProvider>
                        </Suspense>
                    </div>
                )}

                {/* Reuse the service sections, minus the hero and FAQ the
                    pattern page already provides of its own. */}
                {service?.slug && (
                    <div className="border-t border-slate-200/60 bg-white">
                        <Suspense fallback={
                            <div className="py-20 flex items-center justify-center">
                                <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                            </div>
                        }>
                            <PatternServiceSections
                                serviceSlug={service.slug}
                                serviceName={service.name}
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
