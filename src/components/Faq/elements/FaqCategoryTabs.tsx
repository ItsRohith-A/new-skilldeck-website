import Link from 'next/link';
import { LayoutGrid, MessageCircle } from 'lucide-react';

export const ALL_TOPICS = 'All';

interface FaqCategoryTabsProps {
    /** Category names in CMS order (without "All"). */
    categories: string[];
    /** Number of FAQs per category name. */
    counts: Record<string, number>;
    total: number;
    activeCategory: string;
    onSelect: (category: string) => void;
}

const itemClass = (active: boolean) =>
    `group w-full flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition-all ${active
        ? 'bg-brand-primary/10 text-brand-primary font-semibold'
        : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
    }`;

const countClass = (active: boolean) =>
    `shrink-0 min-w-7 rounded-full px-2 py-0.5 text-center text-xs tabular-nums ${active ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-white'
    }`;

/** Topic navigation: a sticky list on desktop, a swipeable chip row on mobile. */
export default function FaqCategoryTabs({ categories, counts, total, activeCategory, onSelect }: FaqCategoryTabsProps) {
    const items = [
        { name: ALL_TOPICS, label: 'All topics', count: total },
        ...categories.map((name) => ({ name, label: name, count: counts[name] || 0 })),
    ];

    return (
        <>
            {/* Mobile / tablet */}
            <nav aria-label="FAQ topics" className="lg:hidden -mx-4 px-4 my-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex gap-2 w-max">
                    {items.map(({ name, label, count }) => {
                        const active = activeCategory === name;
                        return (
                            <button
                                key={name}
                                type="button"
                                data-no-loader="true"
                                onClick={() => onSelect(name)}
                                aria-pressed={active}
                                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all ${active
                                    ? 'border-transparent bg-brand-gradient text-white shadow-md'
                                    : 'border-slate-200 bg-white text-slate-600'
                                    }`}
                            >
                                {label}
                                <span className={`text-xs tabular-nums ${active ? 'text-white/80' : 'text-slate-400'}`}>{count}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* Desktop */}
            {/* self-stretch: the aside spans the whole FAQ column, so the panel inside has room to stick. */}
            <aside className="hidden lg:block self-stretch">
                {/* Never taller than the viewport below the navbar; a long topic list scrolls inside. */}
                <div className="sticky top-28 flex flex-col gap-4 max-h-[calc(100vh-8rem)]">
                    <nav aria-label="FAQ topics" className="flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-2.5 shadow-sm">
                        <p className="shrink-0 px-3.5 pt-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Browse by topic</p>
                        <ul className="min-h-0 space-y-0.5 overflow-y-auto overscroll-contain pr-0.5 [scrollbar-width:thin]">
                            {items.map(({ name, label, count }) => {
                                const active = activeCategory === name;
                                return (
                                    <li key={name}>
                                        <button
                                            type="button"
                                            data-no-loader="true"
                                            onClick={() => onSelect(name)}
                                            aria-current={active ? 'true' : undefined}
                                            className={itemClass(active)}
                                        >
                                            <span className="flex items-center gap-2 min-w-0">
                                                {name === ALL_TOPICS && <LayoutGrid className="w-4 h-4 shrink-0" />}
                                                <span className="truncate">{label}</span>
                                            </span>
                                            <span className={countClass(active)}>{count}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    <div className="shrink-0 rounded-2xl bg-slate-900 p-5 text-white relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-primary/40 rounded-full blur-2xl" />
                        <MessageCircle className="relative w-6 h-6 text-white/80 mb-3" />
                        <p className="relative font-semibold mb-1">Can&apos;t find an answer?</p>
                        <p className="relative text-sm text-slate-300 mb-4">Our team is happy to help with anything not covered here.</p>
                        <Link
                            href="/contact-us"
                            rel="nofollow"
                            className="relative inline-flex items-center justify-center w-full rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition-colors"
                        >
                            Contact us
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}
