import { HelpCircle, Search, X } from 'lucide-react';

interface FaqHeroProps {
    searchQuery: string;
    onSearch: (query: string) => void;
    totalQuestions: number;
    totalTopics: number;
}

export default function FaqHero({ searchQuery, onSearch, totalQuestions, totalTopics }: FaqHeroProps) {
    return (
        <section className="pt-28 lg:pt-36 pb-10 lg:pb-14 px-4 lg:px-0 relative overflow-hidden">
            <div className="absolute -top-10 -left-24 w-[420px] h-[420px] bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-[480px] h-[480px] bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto text-center relative z-10">
                <div className="badge-brand mb-5">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Help Center
                </div>
                <h1 className="heading-hero mb-4">
                    Frequently Asked <span className="text-brand-gradient">Questions</span>
                </h1>
                <p className="body-large mb-8 max-w-2xl mx-auto">
                    Everything about building, running and growing your training business on SkillDeck.
                </p>

                <div className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                        type="search"
                        aria-label="Search the FAQs"
                        placeholder="Search questions, e.g. “custom domain” or “refunds”"
                        value={searchQuery}
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full pl-13 pr-12 py-4 rounded-2xl bg-white/90 backdrop-blur border border-slate-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all text-slate-900 placeholder-slate-400 shadow-[0_10px_40px_-12px_rgba(92,63,250,0.25)] [&::-webkit-search-cancel-button]:hidden"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            data-no-loader="true"
                            onClick={() => onSearch('')}
                            aria-label="Clear search"
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {totalQuestions > 0 && (
                    <p className="body-small mt-4">
                        <strong className="text-slate-900">{totalQuestions}</strong> answers across{' '}
                        <strong className="text-slate-900">{totalTopics}</strong> {totalTopics === 1 ? 'topic' : 'topics'}
                    </p>
                )}
            </div>
        </section>
    );
}
