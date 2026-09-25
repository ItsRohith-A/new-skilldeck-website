"use client";

import { useSchedules } from "@/context/SchedulesContext";
import { getCurrencySymbol } from "@/lib/courseCardHelpers";
import { courseSubject, titleFromSlug } from "@/lib/courseTitle";
import { mapToInstitute } from "@/lib/scheduleMapper";
import { useEffect, useMemo, useRef, useState } from "react";
import NoPartnersPromo from "./NoPartnersPromo";
import PartnerCompanyCard from "./PartnerCompanyCard";
import dynamic from "next/dynamic";

// Client-only and code-split: the comparison contributes nothing to the server
// HTML (so nothing for crawlers to weigh) and no JS until it is scrolled to.
const PartnerComparisonTable = dynamic(() => import("./PartnerComparisonTable"), {
    ssr: false,
    loading: () => <div className="h-64 rounded-2xl border border-slate-100 bg-slate-50/60 animate-pulse" />,
});
// Client-only and code-split: schedules list contains heavy booking modals, forms, and date pickers.
const PartnerSchedulesList = dynamic(() => import("./PartnerSchedulesList"), {
    ssr: false,
    loading: () => <SchedulesSkeleton />,
});
import {
    ComparisonTableSkeleton,
    PartnerCardsSkeleton,
    PartnerCardsSkeletonMobile,
    SchedulesSkeleton,
} from "./PartnerSkeletons";

interface TopPartnersSectionProps {
    courseSlug: string;
    courseTitle?: string;
    /** The location segment on a city URL, e.g. "mumbai". Absent on the plain course URL. */
    locationSlug?: string;
}

export default function TopPartnersSection({ courseSlug, courseTitle, locationSlug }: TopPartnersSectionProps) {
    const { schedules, loading, locationData, tenants } = useSchedules(courseSlug);
    const [compareList, setCompareList] = useState<string[]>([]);
    const [mobileIndex, setMobileIndex] = useState(0);
    const [comparisonVisible, setComparisonVisible] = useState(false);
    const [isNearViewport, setIsNearViewport] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const comparisonAnchor = useRef<HTMLDivElement>(null);

    const activeCurrency = locationData?.currency || "USD";

    const subject = courseSubject(courseTitle, courseSlug);
    const city = locationSlug ? titleFromSlug(locationSlug) : "";

    // Defer heavy computations and subcomponents until the section is near the viewport
    useEffect(() => {
        const el = sectionRef.current;
        if (!el || isNearViewport) return;
        if (typeof IntersectionObserver === "undefined") {
            setIsNearViewport(true);
            return;
        }
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    setIsNearViewport(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "350px 0px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [isNearViewport]);

    // Map raw tenants to cleaner institute profiles directly from useSchedules
    const institutesList = useMemo(() => {
        if (!tenants || tenants.length === 0) return [];
        return tenants.map((t: any, index: number) => mapToInstitute(t, index));
    }, [tenants]);

    // Map each institute to its lowest price schedule for display in the grid
    const partnersData = useMemo(() => {
        if (!institutesList || institutesList.length === 0) return [];

        const mapped = institutesList.map((inst, index) => {
            const instSchedules = (schedules || []).filter((sch) => {
                const match = sch.tenantId === inst.id || sch.tenantId === (inst as any)._id;
                return match;
            });

            let lowestPrice = 0;
            let lowestCompared = 0;
            let symbol = getCurrencySymbol(activeCurrency);
            let duration = "—";

            let minScheduleRank: number | null = null;

            if (instSchedules.length > 0) {
                // Default duration from first schedule
                if (instSchedules[0].totalSessions) {
                    duration = `${instSchedules[0].totalSessions} Sessions`;
                } else if (instSchedules[0].duration) {
                    duration = `${instSchedules[0].duration} Mins`;
                }

                // Find minimum schedule rank
                instSchedules.forEach((sch: any) => {
                    if (sch.rank !== null && sch.rank !== undefined) {
                        const r = Number(sch.rank);
                        if (!isNaN(r) && r > 0) {
                            if (minScheduleRank === null || r < minScheduleRank) {
                                minScheduleRank = r;
                            }
                        }
                    }
                });

                // Find pricing matching activeCurrency
                instSchedules.forEach((sch: any) => {
                    const priceObj = sch.pricing?.find(
                        (p: any) => p.currency?.code?.toUpperCase() === activeCurrency.toUpperCase()
                    );
                    if (priceObj) {
                        const sell = priceObj.comparedPrice || 0;
                        if (lowestPrice === 0 || sell < lowestPrice) {
                            lowestPrice = sell;
                            lowestCompared = priceObj.actualPrice || sell;
                            symbol = priceObj.currency?.symbol || symbol;
                        }
                    } else if (sch.currency?.toUpperCase() === activeCurrency.toUpperCase()) {
                        const sell = sch.price || 0;
                        if (lowestPrice === 0 || sell < lowestPrice) {
                            lowestPrice = sell;
                            lowestCompared = sch.price || sell;
                            symbol = getCurrencySymbol(sch.currency);
                        }
                    }
                });

                // FALLBACK: If no active currency price was found, search for USD instead
                if (lowestPrice === 0 && activeCurrency.toUpperCase() !== "USD") {
                    instSchedules.forEach((sch: any) => {
                        const priceObj = sch.pricing?.find(
                            (p: any) => p.currency?.code?.toUpperCase() === "USD"
                        );
                        if (priceObj) {
                            const sell = priceObj.comparedPrice || 0;
                            if (lowestPrice === 0 || sell < lowestPrice) {
                                lowestPrice = sell;
                                lowestCompared = priceObj.actualPrice || sell;
                                symbol = priceObj.currency?.symbol || "$";
                            }
                        } else if (sch.currency?.toUpperCase() === "USD") {
                            const sell = sch.price || 0;
                            if (lowestPrice === 0 || sell < lowestPrice) {
                                lowestPrice = sell;
                                lowestCompared = sch.price || sell;
                                symbol = "$";
                            }
                        }
                    });
                }
            }

            return {
                ...inst,
                lowestPrice,
                lowestCompared,
                symbol,
                duration,
                schedulesCount: instSchedules.length,
                schedules: instSchedules,
                rank: minScheduleRank
            };
        });

        // Only keep tenants who have schedules for this course, sorted by rank
        return mapped
            .filter((p) => p.schedulesCount > 0)
            .sort((a, b) => (a.rank || 999) - (b.rank || 999));
    }, [institutesList, schedules, activeCurrency]);

    const MAX_COMPARE = 4;
    /** Preselect three, leaving a free slot so "Add Company" is usable. */
    const DEFAULT_COMPARE = 3;

    // An empty compareList means "show the default top N", so any add/remove has to
    // start from that same default — otherwise the first tick would collapse the
    // table to a single column.
    const currentSelection = (prev: string[]) =>
        prev.length > 0 ? prev : partnersData.slice(0, DEFAULT_COMPARE).map(p => p.id);

    // What is actually on screen. An untouched compareList still shows the default
    // top N in the table, so the card checkboxes have to reflect that same set.
    const effectiveCompare = useMemo(
        () => currentSelection(compareList),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [compareList, partnersData]
    );

    useEffect(() => {
        const el = comparisonAnchor.current;
        if (!el || comparisonVisible) return;
        if (typeof IntersectionObserver === "undefined") {
            const t = setTimeout(() => setComparisonVisible(true), 0);
            return () => clearTimeout(t);
        }
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    setComparisonVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "300px 0px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [comparisonVisible, partnersData.length]);

    const handleCompareToggle = (id: string) => {
        setCompareList(prev => {
            const base = currentSelection(prev);
            if (base.includes(id)) return base.filter(item => item !== id);
            if (base.length >= MAX_COMPARE) return base;
            return [...base, id];
        });
    };

    const handleCompareAdd = (id: string) => {
        setCompareList(prev => {
            const base = currentSelection(prev);
            if (base.includes(id) || base.length >= MAX_COMPARE) return base;
            return [...base, id];
        });
    };

    const handleCompareRemove = (id: string) => {
        setCompareList(prev => currentSelection(prev).filter(item => item !== id));
    };

    const handleScrollToSchedules = () => {
        const element = document.getElementById("detailed-schedules");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const getRankColorClass = (index: number) => {
        const colors = [
            "bg-gradient-to-br from-indigo-500 to-purple-600 text-white",
            "bg-gradient-to-br from-blue-500 to-indigo-600 text-white",
            "bg-gradient-to-br from-emerald-400 to-teal-600 text-white",
            "bg-gradient-to-br from-orange-400 to-red-500 text-white",
            "bg-gradient-to-br from-pink-500 to-rose-600 text-white",
        ];
        return colors[index % colors.length];
    };

    const getBorderHoverClass = (index: number) => {
        const classes = [
            "hover:border-purple-200",
            "hover:border-blue-200",
            "hover:border-emerald-200",
            "hover:border-orange-200",
            "hover:border-pink-200",
        ];
        return classes[index % classes.length];
    };

    return (
        <div ref={sectionRef} className="w-full space-y-8 py-0" id="training-partners">
            {/* Header section — always rendered statically to prevent CLS layout shift */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black tracking-wider uppercase bg-purple-50 border border-purple-100 text-[#5544CC]">
                        Training Partners
                    </span>
                    <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
                        Top {subject ? `${subject} ` : ""}Training Institutes{" "}
                        <span className="bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] bg-clip-text text-transparent">
                            {city ? `in ${city}` : "Worldwide"}
                        </span>
                    </h2>
                    <p className="text-sm text-slate-500 max-w-2xl font-medium">
                        Compare top training providers and choose the best one for your learning journey.
                    </p>
                </div>
            </div>

            {(!isNearViewport || (loading && partnersData.length === 0)) ? (
                <>
                    <PartnerCardsSkeleton />
                    <PartnerCardsSkeletonMobile />
                </>
            ) : (
                <>
                    {/* Desktop View: Grid */}
                    <div className="hidden md:grid md:grid-cols-4 gap-6">
                        {partnersData.slice(0, 4).map((partner, index) => (
                            <PartnerCompanyCard
                                key={partner.id}
                                partner={partner}
                                index={index}
                                isCompared={effectiveCompare.includes(partner.id)}
                                onCompareToggle={handleCompareToggle}
                                onScrollToSchedules={handleScrollToSchedules}
                                rankColorClass={getRankColorClass(index)}
                                borderHoverClass={getBorderHoverClass(index)}
                            />
                        ))}
                    </div>

                    {/* Mobile View: Single card with Next/Prev navigation */}
                    {partnersData.length > 0 && (
                        <div className="block md:hidden space-y-4">
                            <div className="transition-all duration-300">
                                {partnersData.slice(0, 4).map((partner, index) => {
                                    if (index !== mobileIndex) return null;
                                    return (
                                        <PartnerCompanyCard
                                            key={partner.id}
                                            partner={partner}
                                            index={index}
                                            isCompared={effectiveCompare.includes(partner.id)}
                                            onCompareToggle={handleCompareToggle}
                                            onScrollToSchedules={handleScrollToSchedules}
                                            rankColorClass={getRankColorClass(index)}
                                            borderHoverClass={getBorderHoverClass(index)}
                                        />
                                    );
                                })}
                            </div>

                            {/* Carousel navigation controls */}
                            <div className="flex items-center justify-between px-2 pt-2 bg-slate-50/50 rounded-2xl border border-slate-100 p-3">
                                <button
                                    type="button"
                                    disabled={mobileIndex === 0}
                                    onClick={() => setMobileIndex(prev => Math.max(0, prev - 1))}
                                    className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
                                    aria-label="Previous provider"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                {/* Bullet indicators */}
                                <div className="flex items-center gap-1.5">
                                    {partnersData.slice(0, 4).map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setMobileIndex(index)}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === mobileIndex ? "bg-[#5544CC] w-5" : "bg-slate-300"
                                                }`}
                                            aria-label={`Go to slide ${index + 1}`}
                                        />
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    disabled={mobileIndex === Math.min(partnersData.length, 4) - 1}
                                    onClick={() => setMobileIndex(prev => Math.min(Math.min(partnersData.length, 4) - 1, prev + 1))}
                                    className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
                                    aria-label="Next provider"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Nobody has listed this course yet: speak to the learner who still
                wants it and to the institute that could be running it. */}
            {isNearViewport && !loading && partnersData.length === 0 && (
                <NoPartnersPromo
                    subject={subject}
                    courseSlug={courseSlug}
                    courseTitle={courseTitle}
                />
            )}

            {/* Side-by-side comparison — defaults to the top providers, refined by
                the Compare checkboxes on the cards. */}
            {loading && partnersData.length === 0 && <ComparisonTableSkeleton />}

            {partnersData.length > 0 && (
                <div ref={comparisonAnchor}>
                    {comparisonVisible ? (
                        <PartnerComparisonTable
                            partners={partnersData}
                            activeCurrency={activeCurrency}
                            maxCompare={MAX_COMPARE}
                            compact
                            courseSlug={courseSlug}
                            courseTitle={courseTitle}
                            locationSlug={locationSlug}
                            compareList={effectiveCompare}
                            onAdd={handleCompareAdd}
                            onRemove={handleCompareRemove}
                        />
                    ) : (
                        <ComparisonTableSkeleton />
                    )}
                </div>
            )}

            {/* Detailed Schedules Section */}
            {loading && (!schedules || schedules.length === 0) && <SchedulesSkeleton />}

            {schedules && schedules.length > 0 && (
                <PartnerSchedulesList
                    partnersData={partnersData}
                    activeCurrency={activeCurrency}
                    courseSlug={courseSlug}
                    courseTitle={courseTitle}
                    locationSlug={locationSlug}
                />
            )}
        </div>
    );
}
