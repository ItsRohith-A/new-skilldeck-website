import { StatItem } from '@/types';
import { Sparkles } from 'lucide-react';
import TruncatedContent from '../ui/TruncatedContent';

interface CategoryHighlightsProps {
    stats?: StatItem[];
    keyPoints?: string;
    categoryName?: string;
}

const CategoryHighlights = ({ stats, keyPoints, categoryName }: CategoryHighlightsProps) => {
    // Default stats if none provided or empty
    const defaultStats = [
        { value: "4,000+", label: "Careers Transformed" },
        { value: "1,650+", label: "Global Experts" },
        { value: "250+", label: "Workshops Every Month" },
        { value: "100+", label: "Countries & Counting" },
    ];

    const displayStats = (stats && stats.length > 0) ? stats.map(stat => {
        const keys = Object.keys(stat);
        const valueKey = keys.find(k => k.toLowerCase().includes('value') || k.toLowerCase().includes('count')) || keys[0];
        const labelKey = keys.find(k => k.toLowerCase().includes('title') || k.toLowerCase().includes('label') || k.toLowerCase().includes('name')) || keys.find(k => k !== valueKey) || keys[1];

        return {
            value: stat[valueKey],
            label: stat[labelKey] || "Stat"
        };
    }) : defaultStats;

    if (!keyPoints && (!stats || stats.length === 0)) return null;

    return (
        <section className="py-12 md:py-20 bg-slate-50/50 relative overflow-hidden">
            {/* Subtle background glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-20 right-20 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center lg:text-left mb-8 ">
                        <div className="inline-flex items-center gap-2 bg-purple-50 rounded-full px-4 py-1.5 border border-purple-100/50 shadow-sm mb-4">
                            <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                            <span className="text-[11px] font-semibold text-purple-600 uppercase tracking-widest">Category Highlights</span>
                        </div>
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-800 tracking-tight leading-tight">
                            Why Choose <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Our Programs</span>?
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
                        {/* Highlights Card */}
                        <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                            <div className="space-y-4">
                                <h3 className="text-base md:text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
                                    <span className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center text-sm font-black">!</span>
                                    Key Takeaways of {categoryName}
                                </h3>
                                <TruncatedContent content={keyPoints || ''} maxLines={10} className='skilldeck-content text-slate-600 text-sm leading-relaxed' />
                            </div>
                        </div>

                        {/* Stats Column */}
                        <div className="lg:col-span-5 grid grid-cols-2 gap-4 md:gap-5">
                            {displayStats.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl p-4 border border-slate-100 shadow-md hover:shadow-xl flex flex-col justify-center items-center text-center group hover:border-purple-200 transition-all duration-300"
                                >
                                    <p className="text-xl md:text-2xl font-black text-purple-600 mb-2">
                                        {item.value}
                                    </p>
                                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                        {item.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategoryHighlights;
