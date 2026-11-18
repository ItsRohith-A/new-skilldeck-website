import { Fragment, type ReactNode } from 'react';
import { Link2, Plus, SearchX } from 'lucide-react';
import type { FaqItem } from '@/lib/faqs';
import { normalizeRichText } from '@/components/services/richText';

export interface FaqGroup {
    category: string;
    faqs: (FaqItem & { id: string })[];
}

interface FaqListProps {
    groups: FaqGroup[];
    openIds: Set<string>;
    onToggle: (id: string) => void;
    searchQuery: string;
    onReset: () => void;
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Wraps the search term in <mark> inside a plain-text question. */
function highlight(text: string, query: string): ReactNode {
    const q = query.trim();
    if (!q) return text;
    return text.split(new RegExp(`(${escapeRegExp(q)})`, 'gi')).map((part, i) =>
        part.toLowerCase() === q.toLowerCase()
            ? <mark key={i} className="bg-brand-primary/15 text-brand-primary rounded px-0.5">{part}</mark>
            : <Fragment key={i}>{part}</Fragment>
    );
}

const ANSWER_CLASSES =
    'body-medium text-slate-600 [&_p]:my-2 first:[&_p]:mt-0 last:[&_p]:mb-0 [&_a]:text-brand-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:font-medium [&_a]:break-words [&_strong]:font-semibold [&_strong]:text-slate-800 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:my-1';

export default function FaqList({ groups, openIds, onToggle, searchQuery, onReset }: FaqListProps) {
    if (!groups.length) {
        return (
            <div className="text-center py-16 px-6 bg-white rounded-3xl border border-dashed border-slate-300">
                <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto mb-4">
                    <SearchX className="w-7 h-7" />
                </div>
                <h3 className="heading-card mb-2">No matching questions</h3>
                <p className="body-small mb-5">Try a different word, or browse all topics.</p>
                <button
                    type="button"
                    data-no-loader="true"
                    onClick={onReset}
                    className="inline-flex items-center rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                    Show all questions
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {groups.map((group) => (
                <section key={group.category} aria-label={group.category}>
                    <div className="flex items-baseline justify-between gap-3 mb-3 px-1">
                        <h2 className="heading-section2">{group.category}</h2>
                        <span className="body-small shrink-0">
                            {group.faqs.length} {group.faqs.length === 1 ? 'question' : 'questions'}
                        </span>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.04)] divide-y divide-slate-100 overflow-hidden">
                        {group.faqs.map((faq) => {
                            const isOpen = openIds.has(faq.id);
                            return (
                                <div
                                    key={faq.id}
                                    id={faq.id}
                                    className={`group/faq relative scroll-mt-28 transition-colors ${isOpen ? 'bg-brand-primary/[0.03]' : 'hover:bg-slate-50/70'}`}
                                >
                                    <span
                                        aria-hidden
                                        className={`absolute left-0 top-0 h-full w-1 bg-brand-gradient transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                                    />
                                    <h3>
                                        <button
                                            type="button"
                                            data-no-loader="true"
                                            onClick={() => onToggle(faq.id)}
                                            aria-expanded={isOpen}
                                            aria-controls={`${faq.id}-answer`}
                                            className="w-full flex items-start justify-between gap-4 px-5 md:px-7 py-5 text-left"
                                        >
                                            <span className={`text-[15px] md:text-base 2xl:text-lg font-semibold leading-snug transition-colors ${isOpen ? 'text-brand-primary' : 'text-slate-900'}`}>
                                                {highlight(faq.question, searchQuery)}
                                            </span>
                                            <span
                                                className={`mt-0.5 shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-200 ${isOpen
                                                    ? 'rotate-45 border-transparent bg-brand-primary text-white'
                                                    : 'border-slate-200 text-slate-500 group-hover/faq:border-brand-primary/40 group-hover/faq:text-brand-primary'
                                                    }`}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </span>
                                        </button>
                                    </h3>

                                    {/* Every answer stays in the DOM (collapsed with CSS) for crawlers and the FAQPage schema. */}
                                    <div
                                        id={`${faq.id}-answer`}
                                        role="region"
                                        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="px-5 md:px-7 pb-6 -mt-1">
                                                {/* Answer HTML comes from the CMS editor, sanitized in lib/faqs */}
                                                <div
                                                    className={ANSWER_CLASSES}
                                                    dangerouslySetInnerHTML={{ __html: normalizeRichText(faq.answer) }}
                                                />
                                                <a
                                                    href={`#${faq.id}`}
                                                    data-no-loader="true"
                                                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-brand-primary transition-colors"
                                                >
                                                    <Link2 className="w-3.5 h-3.5" />
                                                    Link to this answer
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            ))}
        </div>
    );
}
