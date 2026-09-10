import { notFound } from "next/navigation";
import { redirectOrNotFound } from "@/lib/redirects";
import { Metadata } from "next";
import { cache } from "react";
import MainNav from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { getCategoryPageCourses } from "@/lib/categories";
import { fetchFromBackend } from "@/lib/apiProxy";
import { env } from "@/lib/env";
import CategoryHero from "@/components/category/CategoryHero";
import CategoryHighlights from "@/components/category/CategoryHighlights";
import CategoryCourses from "@/components/category/CategoryCourses";
import CategorySalaries from "@/components/category/CategorySalaries";
import CategoryCertification from "@/components/category/CategoryCertification";
import CategoryContact from "@/components/category/CategoryContact";
import FAQ from "@/components/shared/FAQ";
import Accordion from "@/components/ui/Accordion";
import { CategoryData } from "@/types";

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

export async function generateStaticParams() {
    try {
        const res = await fetchFromBackend('/categories', {
            queryParams: new URLSearchParams({ limit: '100' })
        });
        if (!res.ok) return [];
        const { data: categories } = await res.json();
        return categories.map((cat: { slug: string }) => ({
            slug: cat.slug,
        }));
    } catch (error) {
        console.error("Error generating static params for categories:", error);
        return [];
    }
}

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

async function getCategoryRaw(slug: string) {
    try {
        const res = await fetchFromBackend(`/categories/${slug}`);

        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error(`Failed to fetch category: ${res.status}`);
        }

        return res.json();
    } catch (error) {
        console.error("Error fetching category:", error);
        return null;
    }
}

const getCategory = cache(getCategoryRaw);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;

    if (isStaticAsset(slug)) {
        return {};
    }

    const category = await getCategory(slug);

    if (!category) {
        return {};
    }

    const baseUrl = env.NEXT_PUBLIC_SITE_URL || 'https://skilldeck.net';
    const categoryBase = category.canonicalUrl
        ? (category.canonicalUrl.startsWith('/') ? category.canonicalUrl.slice(1) : category.canonicalUrl)
        : `${slug}`;
    const canonicalPath = categoryBase;

    return {
        title: category.metaTitle || category.name,
        description: category.metaDescription,
        keywords: category.keywords,
        robots: category.metaRobots,
        alternates: {
            canonical: `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}${canonicalPath}`,
        },
        openGraph: {
            title: category.ogTitle || category.metaTitle || category.name,
            description: category.ogDescription || category.metaDescription,
            images: category.ogImage ? [category.ogImage] : undefined,
        }
    };
}

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params;

    if (isStaticAsset(slug)) {
        notFound();
    }

    const categoryData = getCategory(slug);
    const coursesData = getCategoryPageCourses(slug);

    // Parallel fetch
    const [categoryVal, courses] = await Promise.all([categoryData, coursesData]);
    const category = categoryVal as CategoryData;

    if (!category) {
        return await redirectOrNotFound(`/${slug}`);
    }

    let faqSchema = null;
    if (category.faqs && category.faqs.length > 0) {
        faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "name": `FAQ for ${category.name}`,
            "mainEntity": category.faqs.map((faq: any) => ({
                "@type": "Question",
                "name": faq.title,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.value?.replace(/<[^>]*>?/gm, '')
                }
            }))
        };
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
            <MainNav />
            <main className="flex-1">
                <CategoryHero data={category} />
                <CategoryCourses
                    categoryName={category.name}
                    courses={courses?.data || []}
                    meta={courses?.meta || { page: 1, limit: 6, total: 0, pages: 0 }}
                    slug={slug}
                />
                <CategoryHighlights stats={category.stats} keyPoints={category.key_points} categoryName={category.name} />
                <CategorySalaries
                    categoryName={category.name}
                    salaries={category.salaries}
                />
                <CategoryCertification categoryName={category.name} />

                {category.faqs && category.faqs.length > 0 && (
                    <div className="container mx-auto max-w-7xl px-6 my-8 md:my-12">
                        <FAQ items={category.faqs} />
                    </div>
                )}

                {category.bottomSection?.value && (
                    <Accordion items={[{
                        title: category.bottomSection.title || "Bottom Section",
                        value: category.bottomSection.value
                    }]} />
                )}

                {category.internalSection?.value && (
                    <Accordion items={[{
                        title: category.internalSection.title || "Internal Section",
                        value: category.internalSection.value
                    }]} />
                )}

                <CategoryContact />
            </main>
            <Footer />
        </div>
    );
}
