"use client";

import SectionTag from "@/components/ui/SectionTag";
import { Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";

interface SyllabusItem {
    title: string;
    value: string;
}

interface CourseSyllabusProps {
    data: SyllabusItem[];
}

export default function CourseSyllabus({ data }: CourseSyllabusProps) {
    const [openIndexes, setOpenIndexes] = useState<number[]>([0]); // Default first item open

    const handleToggle = (index: number) => {
        if (openIndexes.includes(index)) {
            setOpenIndexes(openIndexes.filter((i) => i !== index));
        } else {
            setOpenIndexes([...openIndexes, index]);
        }
    };

    const handleExpandAll = () => {
        if (openIndexes.length === data.length) {
            setOpenIndexes([]);
        } else {
            setOpenIndexes(data.map((_, i) => i));
        }
    };

    // Calculate total projects from the HTML content strings
    const totalProjects = useMemo(() => {
        let count = 0;
        data.forEach((item) => {
            if (item.value.toLowerCase().includes("project:")) {
                count++;
            }
        });
        return count || data.length; // Fallback to 1 project per module if none matched explicitly
    }, [data]);

    if (!data || data.length === 0) return null;

    return (
        <section className="py-6 md:py-12 bg-white" id="course-syllabus">
            <div className="container mx-auto px-4 lg:px-0 max-w-4xl">
                {/* Header */}
                <div className="space-y-2 mb-4">
                    <SectionTag text="Curriculum" />
                    <h2 className="text-2xl md:text-3xl font-bold heading-Color tracking-tight">
                        Week by week, with the projects attached
                    </h2>
                    <p className="text-sm text-gray-500">
                        Expand any module to see the topics and what you&apos;ll build at the end of it.
                    </p>
                </div>

                {/* Subheader bar */}
                <div className="bg-[#FAF9FF] border border-[#ECE9F9] rounded-2xl p-4 flex items-center justify-between gap-4 mb-8">
                    <span className="text-xs font-bold capitalize text-[#7C3AED]">
                        {data.length} modules • {totalProjects} graded projects
                    </span>
                    <button
                        type="button"
                        onClick={handleExpandAll}
                        className="text-xs font-bold text-[#7C3AED] hover:underline cursor-pointer flex items-center gap-1"
                    >
                        {openIndexes.length === data.length ? "Collapse all ↑" : "Expand all ↓"}
                    </button>
                </div>

                {/* Timeline Accordion Container */}
                <div className="relative space-y-6">
                    {/* Vertical timeline line */}
                    <div className="absolute left-[16px] md:left-[24px] top-6 bottom-6 w-[2px] bg-purple-100" />

                    {data.map((module, index) => {
                        const isOpen = openIndexes.includes(index);

                        return (
                            <div key={index} className="relative group">
                                {/* Left floating numbering badge sitting on the vertical line */}
                                <div
                                    className={`absolute left-[4px] md:left-[8px] top-3 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs md:text-sm z-10 transition-colors border ${isOpen
                                        ? "bg-[#7C3AED] text-white border-[#7C3AED] shadow-md shadow-[#7C3AED]/20"
                                        : "bg-white text-[#7C3AED] border-purple-200"
                                        }`}
                                >
                                    {index + 1}
                                </div>

                                {/* Accordion card with margin-left to prevent overlap */}
                                <div
                                    className={`ml-10 md:ml-14 rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen
                                        ? "border-[#7C3AED]/30 bg-purple-50/5 shadow-lg shadow-purple-900/5"
                                        : "border-gray-200 bg-white hover:border-purple-300"
                                        }`}
                                >
                                    {/* Closed / Header button */}
                                    <button
                                        type="button"
                                        onClick={() => handleToggle(index)}
                                        className="w-full flex items-center justify-between p-4 text-left group/btn"
                                    >
                                        <div className="space-y-1">
                                            <h3 className="text-sm md:text-base font-bold text-[#101A3D] group-hover/btn:text-[#7C3AED] transition-colors">
                                                {module.title}
                                            </h3>
                                        </div>
                                        <div
                                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? "bg-purple-100 text-[#7C3AED]" : "bg-gray-100 text-gray-500"
                                                }`}
                                        >
                                            {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                                        </div>
                                    </button>

                                    {/* Expanded content */}
                                    {isOpen && (
                                        <div className="px-4 pb-6 pt-0 border-t border-purple-100/50">
                                            <div className="syllabus-jodit-wrapper text-[13px] text-gray-700 leading-relaxed font-bold pt-4">
                                                <style dangerouslySetInnerHTML={{
                                                    __html: `
                                                    .syllabus-jodit-wrapper .skilldeck-content ul {
                                                        list-style: none !important;
                                                        padding-left: 0 !important;
                                                        margin-top: 0.5rem !important;
                                                        margin-bottom: 0.5rem !important;
                                                        display: flex;
                                                        flex-direction: column;
                                                        gap: 0.5rem;
                                                    }
                                                    .syllabus-jodit-wrapper .skilldeck-content li {
                                                        position: relative !important;
                                                        padding-left: 1.5rem !important;
                                                        list-style-type: none !important;
                                                        font-weight: 700 !important;
                                                        color: #374151 !important; /* text-gray-700 */
                                                    }
                                                    .syllabus-jodit-wrapper .skilldeck-content li::before {
                                                        content: '' !important;
                                                        position: absolute !important;
                                                        left: 0 !important;
                                                        top: 0.2rem !important;
                                                        width: 1rem !important;
                                                        height: 1rem !important;
                                                        border-radius: 9999px !important;
                                                        background-color: #ECFDF5 !important; /* bg-emerald-50 */
                                                        border: 1px solid #A7F3D0 !important; /* border-emerald-200 */
                                                        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23059669' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E") !important;
                                                        background-size: 0.55rem !important;
                                                        background-repeat: no-repeat !important;
                                                        background-position: center !important;
                                                    }
                                                    .syllabus-jodit-wrapper .skilldeck-content p {
                                                        margin-bottom: 0.5rem !important;
                                                        color: #4B5563 !important; /* text-gray-600 */
                                                        font-weight: 500 !important;
                                                    }
                                                ` }} />
                                                <div className="skilldeck-content" dangerouslySetInnerHTML={{ __html: module.value }} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
