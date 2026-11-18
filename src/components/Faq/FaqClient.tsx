"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import FaqHero from '@/components/Faq/elements/FaqHero';
import FaqCategoryTabs, { ALL_TOPICS } from '@/components/Faq/elements/FaqCategoryTabs';
import FaqList, { type FaqGroup } from '@/components/Faq/elements/FaqList';
import FaqCta from '@/components/Faq/elements/FaqCta';

import type { FaqItem } from '@/lib/faqs';

interface FaqClientProps {
    faqs: FaqItem[];
    /** Category names in CMS order. */
    categories: string[];
}

/** Stable anchor id per question, so an answer can be linked to (/faq#how-do-i-...). */
const toId = (question: string, used: Set<string>) => {
    const base = question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'faq';
    let id = base;
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    used.add(id);
    return id;
};

export default function FaqClient({ faqs, categories }: FaqClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>(ALL_TOPICS);
    const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());
    const listRef = useRef<HTMLElement>(null);

    const withIds = useMemo(() => {
        const used = new Set<string>();
        return faqs.map((faq) => ({ ...faq, id: toId(faq.question, used) }));
    }, [faqs]);

    const counts = useMemo(() => {
        const result: Record<string, number> = {};
        for (const faq of faqs) result[faq.category] = (result[faq.category] || 0) + 1;
        return result;
    }, [faqs]);

    const groups: FaqGroup[] = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        const matching = withIds.filter((faq) =>
            (activeCategory === ALL_TOPICS || faq.category === activeCategory) &&
            (!q || faq.question.toLowerCase().includes(q) || faq.answerText.toLowerCase().includes(q))
        );
        return categories
            .map((category) => ({ category, faqs: matching.filter((f) => f.category === category) }))
            .filter((g) => g.faqs.length > 0);
    }, [withIds, categories, activeCategory, searchQuery]);

    const shown = groups.reduce((sum, g) => sum + g.faqs.length, 0);

    // Open (and scroll to) the answer named in the URL hash, e.g. from a shared link.
    useEffect(() => {
        const openFromHash = () => {
            const id = decodeURIComponent(window.location.hash.slice(1));
            if (!id || !withIds.some((f) => f.id === id)) return;
            setActiveCategory(ALL_TOPICS);
            setSearchQuery('');
            setOpenIds((prev) => new Set(prev).add(id));
            requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
        };
        openFromHash();
        window.addEventListener('hashchange', openFromHash);
        return () => window.removeEventListener('hashchange', openFromHash);
    }, [withIds]);

    const toggle = (id: string) =>
        setOpenIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

    /**
     * Picking a topic shortens the page, and the browser keeps the old scroll position,
     * which can land in the footer. Bring the top of the list back into view instead.
     */
    const scrollToList = () => {
        const list = listRef.current;
        if (!list) return;
        requestAnimationFrame(() => {
            if (list.getBoundingClientRect().top < 0) list.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    };

    const selectCategory = (category: string) => {
        setActiveCategory(category);
        scrollToList();
    };

    const reset = () => {
        setActiveCategory(ALL_TOPICS);
        setSearchQuery('');
        scrollToList();
    };

    const filtered = activeCategory !== ALL_TOPICS || searchQuery.trim() !== '';

    return (
        <>
            <FaqHero
                searchQuery={searchQuery}
                onSearch={setSearchQuery}
                totalQuestions={faqs.length}
                totalTopics={categories.length}
            />

            <section ref={listRef} className="px-4 lg:px-0 pb-16 lg:pb-24 scroll-mt-28">
                <div className="container mx-auto max-w-6xl lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10 xl:gap-14 items-start">
                    <FaqCategoryTabs
                        categories={categories}
                        counts={counts}
                        total={faqs.length}
                        activeCategory={activeCategory}
                        onSelect={selectCategory}
                    />

                    <div className="min-w-0">
                        {filtered && (
                            <div className="mb-6 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-600">
                                <span>
                                    <strong className="text-slate-900">{shown}</strong> {shown === 1 ? 'result' : 'results'}
                                    {activeCategory !== ALL_TOPICS && <> in <strong className="text-brand-primary">{activeCategory}</strong></>}
                                    {searchQuery.trim() && <> for &ldquo;<strong className="text-slate-900">{searchQuery.trim()}</strong>&rdquo;</>}
                                </span>
                                <button
                                    type="button"
                                    data-no-loader="true"
                                    onClick={reset}
                                    className="font-medium text-brand-primary hover:underline"
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}

                        <FaqList groups={groups} openIds={openIds} onToggle={toggle} searchQuery={searchQuery} onReset={reset} />
                    </div>
                </div>
            </section>

            <FaqCta />
        </>
    );
}
