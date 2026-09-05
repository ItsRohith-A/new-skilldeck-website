import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { env } from '@/lib/env';
import { CDNFactory } from '@/lib/cdn';

export const dynamic = 'force-dynamic';

const rawSiteUrl = env.NEXT_PUBLIC_SITE_URL;
const SITE_URL = (rawSiteUrl.includes('localhost') || rawSiteUrl.includes('127.0.0.1'))
    ? rawSiteUrl
    : rawSiteUrl.replace(/\/+$/, '');

export async function POST(request: NextRequest) {
    const secret = request.headers.get('x-revalidate-secret');

    // No hardcoded fallback secret. An unset REVALIDATE_SECRET must reject
    // every request, not silently authorize via a guessable shared value.
    if (!env.REVALIDATE_SECRET || secret !== env.REVALIDATE_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json().catch(() => ({}));
    const type = payload.type;
    const slug = payload.slug || payload.courseSlug;
    const categorySlug = payload.categorySlug;

    const paths = Array.isArray(payload.paths) ? payload.paths : [];
    const tags = Array.isArray(payload.tags) ? payload.tags : [];
    const urls = Array.isArray(payload.urls) ? payload.urls : [];

    for (const p of paths) if (p) revalidatePath(p);
    for (const t of tags) if (t) revalidateTag(t, 'max');

    const purgeUrls: string[] = [...urls];

    // ── Adapt every branch below to match backend cacheInvalidation types ──
    if ((type === 'course' || type === 'courses' || type === 'schedule' || type === 'schedules') && slug) {
        // Granular purge: only this specific course and its schedule
        revalidateTag(`course-${slug}`, 'max');
        revalidateTag(`schedules-${slug}`, 'max');
        if (categorySlug) {
            revalidatePath(`/${categorySlug}/${slug}`);
            purgeUrls.push(`${SITE_URL}/${categorySlug}/${slug}`);
        }
        revalidatePath(`/schedules/${slug}`);
        purgeUrls.push(`${SITE_URL}/schedules/${slug}`);
    } else if (type === 'course' || type === 'courses') {
        revalidateTag('courses', 'max');
        revalidatePath('/', 'layout');
    } else if (type === 'category' || type === 'categories') {
        if (slug) {
            revalidateTag(`category-${slug}`, 'max');
            revalidatePath(`/${slug}`);
            purgeUrls.push(`${SITE_URL}/${slug}`);
        } else {
            revalidateTag('categories', 'max');
            revalidateTag('courses', 'max');
        }
    } else if (type === 'service' || type === 'services') {
        if (slug) {
            revalidateTag(`service-${slug}`, 'max');
            revalidatePath(`/services/${slug}`);
            purgeUrls.push(`${SITE_URL}/services/${slug}`);
        } else {
            revalidateTag('services', 'max');
            revalidateTag('service-categories', 'max');
            revalidatePath('/');
        }
    } else if (type === 'service-category' || type === 'service-categories') {
        revalidateTag('service-categories', 'max');
        revalidateTag('services', 'max');
        revalidatePath('/');
    } else if (type === 'blog' || type === 'blogs') {
        if (slug) {
            revalidateTag(`blog-${slug}`, 'max');
            revalidatePath(`/blog/${slug}`);
            purgeUrls.push(`${SITE_URL}/blog/${slug}`);
            revalidatePath('/blog');
            purgeUrls.push(`${SITE_URL}/blog`);
        } else {
            revalidateTag('blogs', 'max');
            revalidatePath('/blog');
        }
    } else if (type === 'trainer' || type === 'trainers') {
        if (slug) {
            revalidateTag(`course-${slug}`, 'max');
            if (categorySlug) revalidatePath(`/${categorySlug}/${slug}`);
        } else {
            revalidateTag('courses', 'max');
        }
    } else if (type === 'pattern' || type === 'patterns') {
        if (slug) {
            revalidateTag(`pattern-${slug}`, 'max');
            revalidatePath(`/info/${slug}`);
            purgeUrls.push(`${SITE_URL}/info/${slug}`);
        } else {
            revalidateTag('patterns', 'max');
        }
    } else if (type === 'plan' || type === 'plans' || type === 'pricing') {
        // SkillDeck SaaS Subscription Plans (/pricing & homepage)
        revalidateTag('plans', 'max');
        revalidatePath('/pricing');
        revalidatePath('/');
        purgeUrls.push(`${SITE_URL}/pricing`, `${SITE_URL}/`);
    } else if (type === 'pricing-template' || type === 'pricing-templates') {
        // Schedule Pricing Templates
        revalidateTag('schedules', 'max');
        revalidateTag('plans', 'max');
        revalidatePath('/pricing');
        revalidatePath('/');
        purgeUrls.push(`${SITE_URL}/pricing`, `${SITE_URL}/`);
    } else if (type === 'llms-txt' || type === 'llms.txt') {
        revalidatePath('/llms.txt');
        purgeUrls.push(`${SITE_URL}/llms.txt`);
    } else if (type === 'ribbons' || type === 'ribbon') {
        revalidateTag('footer', 'max');
        revalidateTag('scripts', 'max');
        revalidatePath('/', 'layout');
        purgeUrls.push(`${SITE_URL}/*`);
    } else if (type === 'scripts') {
        revalidateTag('scripts', 'max');
        revalidatePath('/', 'layout');
        purgeUrls.push(`${SITE_URL}/*`);
    } else if (type === 'tenant' || type === 'tenants' || type === 'company') {
        revalidateTag('tenants', 'max');
        if (slug) {
            revalidatePath(`/companies/${slug}`);
            purgeUrls.push(`${SITE_URL}/companies/${slug}`);
        }
        revalidatePath('/companies');
    } else if (type === 'testimonial' || type === 'testimonials') {
        revalidateTag('testimonials', 'max');
        revalidatePath('/', 'layout');
    } else if (type === 'footer') {
        revalidateTag('footer', 'max');
        revalidatePath('/', 'layout');
        purgeUrls.push(`${SITE_URL}/*`);
    } else if (type === 'all') {
        revalidatePath('/', 'layout');
        purgeUrls.push(`${SITE_URL}/*`);
    } else if (!type && (paths.length || tags.length || urls.length)) {
        // generic paths/tags/urls already handled above
    } else if (!type) {
        return NextResponse.json({ error: 'Invalid params' }, { status: 400 });
    }

    if (purgeUrls.length > 0) {
        await CDNFactory.getProvider().purge(purgeUrls).catch((err) => {
            console.error('[Revalidate] Purge execution failed:', err);
        });
    }

    return NextResponse.json({ revalidated: true, type, slug, purged: purgeUrls });
}
