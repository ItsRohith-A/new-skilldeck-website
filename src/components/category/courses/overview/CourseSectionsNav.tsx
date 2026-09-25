"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import { X, Layers, ChevronRight } from "lucide-react";

export interface SectionLink {
    id: string;
    label: string;
}

interface CourseSectionsNavProps {
    sections: SectionLink[];
    /** Element whose on-screen span decides when the nav shows. Defaults to the course overview block. */
    regionId?: string;
}

export default function CourseSectionsNav({ sections, regionId }: CourseSectionsNavProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false); // For < 2xl screens
    const [isDismissed, setIsDismissed] = useState(false); // User closed completely
    const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || "overview");
    const containerRef = useRef<HTMLDivElement>(null);

    // Ids whose section rendered nothing. A wrapper can sit in the DOM with no
    // content — reviews is mounted unconditionally and its client component
    // returns null when the course has no testimonials — so presence alone is
    // not enough to say the section exists; it has to occupy space.
    const [emptyIds, setEmptyIds] = useState<string[]>([]);

    const validSections = useMemo(
        () => sections.filter((s) => Boolean(s.id) && !emptyIds.includes(s.id)),
        [sections, emptyIds]
    );

    // Sections load and collapse after mount, so this is re-checked whenever one
    // of them changes size rather than once on mount.
    useEffect(() => {
        const ids = sections.map((s) => s.id).filter(Boolean);

        const recompute = () => {
            const empty = ids.filter((id) => {
                const el = document.getElementById(id);
                return !el || el.offsetHeight === 0;
            });
            setEmptyIds((prev) =>
                prev.length === empty.length && prev.every((v, i) => v === empty[i]) ? prev : empty
            );
        };

        recompute();

        if (typeof ResizeObserver === "undefined") return;

        const observer = new ResizeObserver(recompute);
        for (const id of ids) {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        }
        return () => observer.disconnect();
    }, [sections]);

    useEffect(() => {
        const handleScroll = () => {
            const overviewEl = regionId
                ? document.getElementById(regionId)
                : document.getElementById("course-overview") || document.getElementById("overview");
            if (!overviewEl) return;

            const overviewRect = overviewEl.getBoundingClientRect();
            // Show only while within the course overview area
            const shouldShow = overviewRect.top < 300 && overviewRect.bottom > 150;
            setIsVisible(shouldShow);

            // Determine active section based on scroll offset
            const offset = 140;
            let current = validSections[0]?.id || "overview";

            for (const section of validSections) {
                const el = document.getElementById(section.id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= offset) {
                        current = section.id;
                    }
                }
            }
            setActiveSection(current);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [validSections, regionId]);

    // Close flyout menu on outside click on < 2xl screens
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsExpanded(false);
            }
        };

        if (isExpanded) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isExpanded]);

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        const el = document.getElementById(id);
        if (el) {
            const offset = 85; // Header offset
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = el.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    if (!isVisible || validSections.length === 0 || isDismissed) return null;

    const activeItem = validSections.find((s) => s.id === activeSection) || validSections[0];

    return (
        <div ref={containerRef} className="z-40 select-none">
            {/* 1. Ultra-Wide Screens (>= 2xl / 1536px+): Docked cleanly in left screen gutter */}
            <aside
                aria-label="Page Sections Navigation"
                className="hidden 2xl:block fixed left-4 3xl:left-8 top-1/2 -translate-y-1/2 z-50 animate-in fade-in slide-in-from-left-4 duration-300 pointer-events-auto"
            >
                <div className="bg-white/95 backdrop-blur-md border border-purple-100 shadow-[0_12px_40px_-8px_rgba(124,58,237,0.16),0_4px_16px_-2px_rgba(0,0,0,0.06)] rounded-[22px] p-2 w-30 flex flex-col gap-1">
                    {/* Header */}
                    <div className="flex items-center justify-between px-2 pt-0.5 pb-1.5 border-b border-purple-50">
                        <span className="text-[8.5px] font-bold uppercase tracking-widest text-[#7C3AED]">
                            SECTIONS
                        </span>
                        <button
                            type="button"
                            onClick={() => setIsDismissed(true)}
                            aria-label="Dismiss Sections"
                            className="text-slate-400 hover:text-slate-600 rounded-full p-0.5 hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>

                    {/* Section Links */}
                    <nav className="flex flex-col gap-0.5 py-0.5">
                        {validSections.map((section) => {
                            const isActive = activeSection === section.id;
                            return (
                                <button
                                    key={section.id}
                                    type="button"
                                    onClick={() => scrollToSection(section.id)}
                                    style={isActive ? { background: "linear-gradient(125deg, rgba(92,63,250,1) 0%, rgba(203,59,149,1) 48%, rgba(254,106,27,1) 100%)" } : undefined}
                                    className={cn(
                                        "flex items-center gap-1.5 w-full text-left transition-all duration-200 text-[10px]",
                                        isActive
                                            ? "text-white font-bold rounded-full px-2 py-1.5 shadow-md shadow-purple-500/25"
                                            : "px-2 py-1 text-slate-700 hover:text-slate-950 hover:bg-purple-50/60 rounded-xl font-semibold"
                                    )}
                                >
                                    <span className={cn(
                                        "w-1.5 h-1.5 rounded-full shrink-0",
                                        isActive ? "bg-white/60" : "bg-[#A855F7]"
                                    )} />
                                    <span className="truncate">{section.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* 2. Standard Laptops, Tablets & Mobile (< 2xl): Floating Pill Trigger with Flyout.
                On mobile it sits bottom-left so it doesn't cover the reading column;
                from md up it docks to the left edge, vertically centred. */}
            <div className="block 2xl:hidden fixed z-50 pointer-events-auto left-1.5 sm:left-2 bottom-[100px] md:bottom-auto md:top-1/2 md:-translate-y-1/2">
                {!isExpanded ? (
                    <button
                        type="button"
                        onClick={() => setIsExpanded(true)}
                        aria-label="Open Course Sections"
                        className="bg-white/95 backdrop-blur-md border border-purple-200/80 shadow-[0_8px_30px_rgba(124,58,237,0.2)] rounded-full py-2 px-3 flex items-center gap-2 text-slate-800 hover:scale-105 transition-all group"
                    >
                        <span className="text-[11px] font-extrabold capitalize tracking-wider text-[#7C3AED]">
                            {activeItem?.label || "Sections"}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                ) : (
                    <div className="bg-white/98 backdrop-blur-md border border-purple-100 shadow-[0_16px_48px_rgba(124,58,237,0.25)] rounded-[22px] p-2 w-30 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between px-2 pt-0.5 pb-1.5 border-b border-purple-50">
                            <span className="text-[11px] font-semibold tracking-widest text-[#7C3AED]">
                                SECTIONS
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsExpanded(false)}
                                aria-label="Close"
                                className="text-slate-400 hover:text-slate-600 rounded-full p-0.5 hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>

                        {/* Section Links */}
                        <nav className="flex flex-col gap-0.5 py-0.5 max-h-[60vh] overflow-y-auto no-scrollbar">
                            {validSections.map((section) => {
                                const isActive = activeSection === section.id;
                                return (
                                    <button
                                        key={section.id}
                                        type="button"
                                        onClick={() => scrollToSection(section.id)}
                                        style={isActive ? { background: "linear-gradient(125deg, rgba(92,63,250,1) 0%, rgba(203,59,149,1) 48%, rgba(254,106,27,1) 100%)" } : undefined}
                                        className={cn(
                                            "flex items-center gap-1.5 w-full text-left transition-all duration-200 text-[11px]",
                                            isActive
                                                ? "text-white font-bold rounded-full px-2 py-1.5 shadow-md shadow-purple-500/25"
                                                : "px-2 py-1 text-slate-700 hover:text-slate-950 hover:bg-purple-50/60 rounded-xl font-semibold"
                                        )}
                                    >
                                        <span className="truncate">{section.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
}
