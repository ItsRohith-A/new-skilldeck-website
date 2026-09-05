import CategoryAndBlogsListing from "@/components/Blogs/CategoryAndBlogsListing";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { fetchAggregatedBlogs, fetchBlogs, fetchCategories } from "@/lib/blogs";
import { env } from "@/lib/env";
import { Metadata } from 'next';
import { Suspense } from 'react';

import BlogGridSkeleton from "@/components/Blogs/CategoryAndBlogsListing/elements/BlogGridSkeleton";
import CourseRelatedLinks from "@/components/category/courses/overview/CourseRelatedLinks";
import { getCityContentByPath } from "@/lib/seo-registry";

export const revalidate = false; // Pure On-Demand ISR: cached permanently on Edge CDN until webhook purge

const baseUrl = env.NEXT_PUBLIC_SITE_URL || 'https://skilldeck.net';

export const metadata: Metadata = {
    title: "Blog | SkillDeck",
    description: "Latest insights, tutorials, and updates from the SkillDeck team.",
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}blog`,
    },
};

export default async function BlogPage() {
    const category = 'All';
    const page = 1;

    const siteUrl = env.NEXT_PUBLIC_SITE_URL || 'https://skilldeck.net';
    const pageUrl = `${siteUrl.replace(/\/$/, '')}/blog`;

    const [categories, skilldeckBlogs, partnerBlogs] = await Promise.all([
        fetchCategories(pageUrl),
        fetchBlogs(category, { page, limit: 12, sortBy: 'createdAt', order: 'desc' }, pageUrl),
        fetchAggregatedBlogs({ page: 1, limit: 100 }, pageUrl)
    ]);

    const cityContent = getCityContentByPath('/blog');

    return (
        <>
            <Navbar />
            <Suspense fallback={<BlogGridSkeleton />}>
                <CategoryAndBlogsListing
                    categories={categories}
                    initialBlogs={skilldeckBlogs.data || []}
                    initialMeta={skilldeckBlogs.meta || {}}
                    initialCategory={category}
                    partnerBlogs={partnerBlogs.data || []}
                />
            </Suspense>
            {cityContent && (
                <div className="container mx-auto px-4 lg:px-0 pb-16">
                    <CourseRelatedLinks title="Related Links" value={cityContent} />
                </div>
            )}
            <Footer />
        </>
    );
}
