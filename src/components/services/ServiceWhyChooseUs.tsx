import React from "react";
import { ServiceWhyChooseUsData } from "./types";
import ServiceIconWrapper from "./ServiceIconWrapper";
import ServiceSectionIntro from "./ServiceSectionIntro";
import { accentAt, TILE_ACCENTS } from "./accents";

interface ServiceWhyChooseUsProps {
    whyservice?: ServiceWhyChooseUsData;
    serviceName: string;
}

/** Short taglines in a 5-wide split leave a dead half-screen, so the grid widens with the count. */
const GRID_BY_COUNT: Record<number, string> = {
    1: "grid-cols-1 lg:grid-cols-2",
    2: "grid-cols-2",
    3: "grid-cols-2 lg:grid-cols-3",
};
const DEFAULT_GRID = "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4";

/** Narrative "why it matters" chapter — full-width intro over an even card grid. */
export default function ServiceWhyChooseUs({
    whyservice = {},
    serviceName
}: ServiceWhyChooseUsProps) {
    const points = (whyservice.points || []).filter((p) => p?.title);
    const title = whyservice.title || `Why optimize ${serviceName}?`;
    const gridCols = GRID_BY_COUNT[points.length] || DEFAULT_GRID;

    return (
        /* Sits on the same white ground as the hero, so a full section-y on both
           sides of the seam reads as a gap rather than a break. */
        <section id="why" className="scroll-mt-24 pt-4 md:pt-6 pb-10 md:pb-16 2xl:pb-20">
            <div className="container mx-auto px-4 lg:px-0 space-y-6 sm:space-y-10 lg:space-y-12">
                <ServiceSectionIntro
                    numeral="01"
                    kicker={whyservice.tagline || "The Reality"}
                    title={title}
                    description={whyservice.description}
                />

                {points.length > 0 && (
                    <div className={`grid gap-2.5 sm:gap-4 lg:gap-5 ${gridCols}`}>
                        {points.map((point, i) => (
                            <div
                                key={i}
                                className="group relative bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 p-3.5 sm:p-5 lg:p-6 shadow-sm overflow-hidden hover:shadow-lg hover:border-brand-primary/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                            >
                                {/* Brand rule wipes across the card top on hover. */}
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-x-0 top-0 h-0.5 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500"
                                    style={{ background: "var(--gradient-brand)" }}
                                />

                                <div className="flex items-center justify-between gap-2 sm:gap-3">
                                    <ServiceIconWrapper
                                        iconString={point.icon}
                                        className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-2xl group-hover:scale-105 transition-transform duration-300 shrink-0"
                                        iconClassName="w-4 h-4 sm:w-5 sm:h-5"
                                        defaultIcon="Activity"
                                        fallbackBgClass={accentAt(TILE_ACCENTS, i).chip}
                                    />
                                    <span className="text-base sm:text-2xl font-black text-slate-100 leading-none select-none group-hover:text-brand-primary/15 transition-colors duration-300">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="mt-2.5 sm:mt-4 text-xs sm:text-sm lg:text-base font-bold text-brand-dark leading-snug">
                                        {point.title}
                                    </h3>
                                    {point.description && (
                                        <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-xs text-brand-muted leading-tight sm:leading-relaxed">
                                            {point.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
