import ArticleBody from "@/components/Blogs/ArticleBody";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { fetchFromBackend } from "@/lib/apiProxy";
import { fetchBlogBySlug, fetchBlogs, fetchCategories } from "@/lib/blogs";
import { env } from "@/lib/env";
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const revalidate = false; // Pure On-Demand ISR: cached permanently on Edge CDN until webhook purge

export async function generateStaticParams() {
    try {
        const blogsResult = await fetchBlogs('All', { limit: 20, sortBy: 'createdAt', order: 'desc' });
        return (blogsResult.data || []).map((blog: any) => ({
            slug: blog.slug,
        }));
    } catch (error) {
        console.error("Error generating static params for blogs:", error);
        return [];
    }
}

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { slug } = await params;
    const baseUrl = env.NEXT_PUBLIC_SITE_URL || 'https://skilldeck.net';
    const pageUrl = `${baseUrl.replace(/\/$/, '')}/blog/${slug}`;
    const singleArticle = await fetchBlogBySlug(slug, undefined, pageUrl);

    if (!singleArticle) {
        return {
            title: 'Article Not Found',
        };
    }

    const blogBase = singleArticle.canonicalUrl
        ? (singleArticle.canonicalUrl.startsWith('/') ? singleArticle.canonicalUrl.slice(1) : singleArticle.canonicalUrl)
        : `blog/${slug}`;
    const canonicalPath = blogBase;

    return {
        title: `${singleArticle.title}`,
        description: singleArticle.shortDescription || singleArticle.title,
        robots: {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}${canonicalPath}`,
        },
    };
}

async function getCourses(courseIds: string[], pageUrl?: string) {
    if (!courseIds || courseIds.length === 0) return [];
    const queryParams = new URLSearchParams({
        select: 'category_slug'
    });

    try {
        const response = await fetchFromBackend('/courses/batch', {
            method: 'POST',
            body: {
                ids: courseIds
            },
            queryParams,
            next: { tags: ['courses'] }
        });

        if (!response.ok) {
            console.error(`Batch fetch failed with status ${response.status}`);
            return [];
        }

        // Check if API returned cache miss and pageUrl is provided to purge Cloudflare page cache
        const cacheStatus = response.headers.get('x-cache');
        if (cacheStatus && cacheStatus.toUpperCase().includes('MISS') && pageUrl) {
            import("@/lib/cloudflare").then(({ purgeCloudflareCache }) => {
                purgeCloudflareCache([pageUrl]).catch(err => {
                    console.error("[Cloudflare Purge Error] in getCourses:", err);
                });
            }).catch(err => {
                console.error("[Import Error] cloudflare in getCourses:", err);
            });
        }

        const data = await response.json();
        return data.courses || data.data || data;
    } catch (error) {
        console.error("Error fetching courses batch:", error);
        return [];
    }
}

export default async function BlogDetailPage({ params }: Props) {
    const category = 'All';
    const { slug } = await params;

    const siteUrl = env.NEXT_PUBLIC_SITE_URL || 'https://skilldeck.net';
    const pageUrl = `${siteUrl.replace(/\/$/, '')}/blog/${slug}`;

    const [categories, blogsResult, singleArticle] = await Promise.all([
        fetchCategories(pageUrl),
        fetchBlogs(category, {}, pageUrl),
        fetchBlogBySlug(slug, undefined, pageUrl)
    ]);

    if (!singleArticle) {
        notFound();
    }
    // Fetch full course details if IDs are present
    const courseIds = [
        ...(singleArticle.marketCourses || [])
    ].filter((id: string, index: number, self: string[]) => id && typeof id === 'string' && self.indexOf(id) === index);

    if (courseIds.length > 0) {
        const fullCourses = await getCourses(courseIds, pageUrl);
        singleArticle.marketCourses = fullCourses;
    }

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": singleArticle.title,
        "description": singleArticle.shortDescription || singleArticle.title,
        "image": singleArticle.coverImage?.url || "https://cloud-local.skilldeck.net/7c33d526-309d-4fc9-83ac-1312cb8c343b/public/uploads/skilldeck_logo-f60d95bc-7df7-45fe-87ac-2e014025a085.png",
        "datePublished": singleArticle.createdAt,
        "dateModified": singleArticle.updatedAt || singleArticle.createdAt,
        "author": {
            "@type": "Organization",
            "name": "SkillDeck",
            "url": "https://www.skilldeck.net"
        },
        "publisher": {
            "@type": "Organization",
            "name": "SkillDeck",
            "logo": {
                "@type": "ImageObject",
                "url": "https://cloud-local.skilldeck.net/7c33d526-309d-4fc9-83ac-1312cb8c343b/public/uploads/skilldeck_logo-f60d95bc-7df7-45fe-87ac-2e014025a085.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://www.skilldeck.net/blog/${slug}`
        }
    };

    let faqSchema = null;
    if (singleArticle.faqs && singleArticle.faqs.length > 0) {
        faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "name": `FAQ for ${singleArticle.title}`,
            "mainEntity": singleArticle.faqs.map((faq: any) => ({
                "@type": "Question",
                "name": faq.title,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": (faq.value || faq.answer)?.replace(/<[^>]*>?/gm, '')
                }
            }))
        } as any;
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
            <Navbar />
            <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" /></div>}>
                <ArticleBody
                    categories={categories}
                    blogs={blogsResult.data || []}
                    selectedCategory={category}
                    singleArticle={singleArticle}
                />
            </Suspense>
            <Footer />
        </>
    );
}
