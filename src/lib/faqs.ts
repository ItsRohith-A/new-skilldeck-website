import { fetchFromBackend } from "./apiProxy";

export interface FaqItem {
    question: string;
    /** Sanitized HTML from the CMS rich-text editor. */
    answer: string;
    /** Answer as plain text, for search and FAQPage structured data. */
    answerText: string;
    /** Category name, as shown on the tabs. */
    category: string;
}

export interface FaqSeo {
    metaTitle?: string;
    metaDescription?: string;
    metaRobots?: string;
    keywords?: string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    canonicalUrl?: string;
}

export interface FaqPageData {
    /** Category names in CMS order; only categories with published FAQs. */
    categories: string[];
    faqs: FaqItem[];
    seo: FaqSeo | null;
}

interface FaqApiPayload {
    categories?: { name: string; slug: string; order: number }[];
    faqs?: { question: string; answer: string; category: string; order: number }[];
    seo?: FaqSeo | null;
}

/** Removes <script> tags, inline event handlers and javascript: links. Same rules as blog article bodies. */
function sanitizeAnswerHtml(html: string): string {
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, "")
        .replace(/href\s*=\s*["']\s*javascript:[^"']*/gi, 'href="#"');
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", apos: "'", nbsp: " " };

export function htmlToText(html: string): string {
    return html
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<(br|\/p|\/li|\/h\d)\s*\/?>/gi, " ")
        .replace(/<[^>]*>/g, "")
        .replace(/&(amp|lt|gt|quot|#39|apos|nbsp);/g, (_, e: string) => ENTITIES[e])
        .replace(/\s+/g, " ")
        .trim();
}

const EMPTY: FaqPageData = { categories: [], faqs: [], seo: null };

/**
 * FAQ page content from the CMS. A 404 (FAQs not set up for this account) gives an empty page;
 * any other failure throws, so an outage is never cached as an empty FAQ page.
 */
export async function fetchFaqPage(): Promise<FaqPageData> {
    const response = await fetchFromBackend("/faqs", { next: { tags: ["faqs"] } });

    if (response.status === 404) return EMPTY;
    if (!response.ok) {
        throw new Error(`[faq] /faqs responded ${response.status}`);
    }

    const data: FaqApiPayload = await response.json();
    const nameBySlug = new Map((data.categories || []).map((c) => [c.slug, c.name]));

    const faqs: FaqItem[] = (data.faqs || [])
        .filter((f) => nameBySlug.has(f.category))
        .map((f) => {
            const answer = sanitizeAnswerHtml(f.answer || "");
            return {
                question: f.question,
                answer,
                answerText: htmlToText(answer),
                category: nameBySlug.get(f.category)!,
            };
        });

    return {
        categories: (data.categories || []).map((c) => c.name),
        faqs,
        seo: data.seo || null,
    };
}
