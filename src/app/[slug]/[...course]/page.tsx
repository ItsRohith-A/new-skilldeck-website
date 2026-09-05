import CourseHero from "@/components/category/courses/CourseHero";
import CourseAccordionSection from "@/components/category/courses/overview/CourseAccordionSection";
import CourseOverview from "@/components/category/courses/overview/CourseOverview";
import CourseRelatedLinks from "@/components/category/courses/overview/CourseRelatedLinks";
import TopPartnersSection from "@/components/category/courses/overview/TopPartnersSection";
import Footer from "@/components/shared/Footer";
import MainNav from "@/components/shared/Navbar";
import { SchedulesProvider } from "@/context/SchedulesContext";
import { fetchFromBackend } from "@/lib/apiProxy";
import { env } from "@/lib/env";
import { Metadata } from "next";
import { notFound } from "next/navigation";

const STATIC_ASSET_PATTERNS = [
    /^\/_next\//,
    /^\/api\//,
    /\.(ico|png|jpg|jpeg|gif|svg|webp|css|js|map|txt|xml|json)$/i,
    /favicon\.ico$/,
    /robots\.txt$/,
    /sitemap.*\.xml$/
];

function isStaticAsset(slug: string): boolean {
    return STATIC_ASSET_PATTERNS.some(pattern => pattern.test(slug) || pattern.test(`/${slug}`));
}

export function formatLocation(slug: string): string {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export async function generateStaticParams() {
    try {
        const res = await fetchFromBackend('/courses/name-and-ids');
        if (!res.ok) return [];
        const courses = await res.json();

        return courses.map((course: any) => ({
            slug: course.category_slug,
            course: [course.slug],
        }));
    } catch (error) {
        console.error("Error generating static params for courses:", error);
        return [];
    }
}

export const revalidate = false; // Pure On-Demand ISR: cached permanently on Edge CDN until webhook purge

async function getCourse(slug: string, location?: string, pageUrl?: string) {
    if (slug?.includes('.') || (location && location.includes('.'))) {
        return null;
    }
    try {
        const apiPath = location ? `/courses/${slug}/${location}` : `/courses/${slug}`;
        const response = await fetchFromBackend(apiPath, {
            next: { tags: [`course-${slug}`, 'courses'] }
        });

        if (!response.ok) {
            return null;
        }

        const cacheStatus = response.headers.get('x-cache');
        if (cacheStatus && cacheStatus.toUpperCase().includes('MISS') && pageUrl) {
            import("@/lib/cloudflare").then(({ purgeCloudflareCache }) => {
                purgeCloudflareCache([pageUrl]).catch(err => {
                    console.error("[Cloudflare Purge Error] in getCourse:", err);
                });
            }).catch(err => {
                console.error("[Import Error] cloudflare:", err);
            });
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching course:", error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string, course: string[] }> }): Promise<Metadata> {
    const { slug, course: courseParts } = await params;

    if (isStaticAsset(slug) || courseParts.some(isStaticAsset)) {
        return {};
    }

    const courseSlug = courseParts[0];
    const locationSlug = courseParts[1];

    const baseUrl = env.NEXT_PUBLIC_SITE_URL || 'https://skilldeck.net';
    const pageUrl = `${baseUrl.replace(/\/$/, '')}/${slug}/${courseParts.join('/')}`;

    const course = await getCourse(courseSlug, locationSlug, pageUrl);

    if (!course) {
        return {
            title: "Course Not Found",
        };
    }

    const courseBase = course.canonicalUrl
        ? (course.canonicalUrl.startsWith('/') ? course.canonicalUrl.slice(1) : course.canonicalUrl)
        : `${slug}/${courseSlug}`;
    const canonicalPath = locationSlug
        ? `${courseBase}/${locationSlug}`
        : courseBase;

    return {
        title: course.metaTitle || course.course_title,
        description: course.metaDescription,
        keywords: course.keywords,
        robots: course.metaRobots || {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}${canonicalPath}`,
        },
        openGraph: {
            title: course.ogTitle || course.metaTitle,
            description: course.ogDescription || course.metaDescription,
        },
    };
}

export default async function CoursePage({
    params,
}: {
    params: Promise<{ slug: string, course: string[] }>;
}) {
    const { slug: categorySlug, course: courseParts } = await params;

    if (isStaticAsset(categorySlug) || courseParts.some(isStaticAsset)) {
        notFound();
    }

    const courseSlug = courseParts[0];
    const locationSlug = courseParts[1];

    const siteUrl = env.NEXT_PUBLIC_SITE_URL || 'https://skilldeck.net';
    const pageUrl = `${siteUrl.replace(/\/$/, '')}/${categorySlug}/${courseParts.join('/')}`;

    const course = await getCourse(courseSlug, locationSlug, pageUrl);

    if (!course) {
        notFound();
    }

    if (course.category?.slug && course.category.slug !== categorySlug) {
        notFound();
    }

    const courseSchema = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": course.course_title,
        "description": course.metaDescription || course.course_title,
        "provider": {
            "@type": "Organization",
            "name": "SkillDeck",
            "sameAs": "https://www.skilldeck.net"
        }
    };

    const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": course.course_title,
        "description": course.metaDescription || course.course_title,
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": course.aggregateRating?.ratingValue || 4.5,
            "reviewCount": course.aggregateRating?.reviewCount || 2700
        }
    };

    let faqSchema = null;
    if (course.faqs && course.faqs.length > 0) {
        faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "name": `FAQ for ${course.course_title}`,
            "mainEntity": course.faqs.map((faq: any) => ({
                "@type": "Question",
                "name": faq.title,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.value?.replace(/<[^>]*>?/gm, '')
                }
            }))
        } as any;
    }

    const itemListElement = [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": env.NEXT_PUBLIC_SITE_URL
        },
        {
            "@type": "ListItem",
            "position": 2,
            "name": course.category?.name || "Courses",
            "item": `${env.NEXT_PUBLIC_SITE_URL}/${course.category?.slug || ""}`
        }
    ];

    if (locationSlug) {
        itemListElement.push({
            "@type": "ListItem",
            "position": 3,
            "name": course.course_name || course.course_title,
            "item": `${env.NEXT_PUBLIC_SITE_URL}/${categorySlug}/${courseSlug}`
        });
        itemListElement.push({
            "@type": "ListItem",
            "position": 4,
            "name": formatLocation(locationSlug),
            "item": `${env.NEXT_PUBLIC_SITE_URL}/${categorySlug}/${courseParts.join('/')}`
        });
    } else {
        itemListElement.push({
            "@type": "ListItem",
            "position": 3,
            "name": course.course_title,
            "item": `${env.NEXT_PUBLIC_SITE_URL}/${categorySlug}/${courseSlug}`
        });
    }

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": itemListElement
    };

    return (
        <SchedulesProvider slug={courseSlug}>
            <div className="flex flex-col min-h-screen">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
                />
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
                <main className="flex-1 bg-white">
                    <CourseHero
                        course={course}
                        courseSlug={courseSlug}
                        locationSlug={locationSlug}
                    />
                    <div className="container mx-auto px-2 lg:px-0 md:py-12">
                        <TopPartnersSection courseSlug={courseSlug} courseTitle={course?.course_name || course?.title} />
                    </div>
                    <CourseOverview
                        data={course}
                        courseSlug={courseSlug}
                        courseName={course.course_name}
                    />
                    <div className="container mx-auto px-2 lg:px-0 pb-16 space-y-12">
                        {(course.bottomSection?.value || course.internalSection?.value) && (
                            <div className="space-y-6">
                                {course.bottomSection?.value && (
                                    <CourseAccordionSection
                                        title={course.bottomSection.title}
                                        value={course.bottomSection.value}
                                    />
                                )}
                                {course.internalSection?.value && (
                                    <CourseRelatedLinks
                                        title={course.internalSection.title}
                                        value={course.internalSection.value}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </main>
                <Footer />
            </div>
        </SchedulesProvider>
    );
}
