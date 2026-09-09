import React from "react";
import { ServiceStrategy } from "./types";
import ServiceItemIcon from "./ServiceItemIcon";
import ServiceIconWrapper from "./ServiceIconWrapper";
import ServiceSectionIntro from "./ServiceSectionIntro";
import ServiceCtaBanner from "./ServiceCtaBanner";
import { accentAt, STAT_ACCENTS, TILE_ACCENTS } from "./accents";

interface ServiceWhyOptProps {
    whyopt?: ServiceStrategy;
}

/**
 * "How we partner" credentials chapter — sticky intro beside partner cards,
 * closing on a dark stats band. The old flat two-column list left most of the
 * row width empty and read as small print.
 */
export default function ServiceWhyOpt({ whyopt = {} }: ServiceWhyOptProps) {
    const points = (whyopt.points || []).filter((p) => p?.title);
    const stats = (whyopt.stats || []).filter((s) => s?.value);
    if (points.length === 0 && stats.length === 0) return null;

    return (
        <section id="credentials" className="scroll-mt-24 section-y relative overflow-hidden">
            <div
                aria-hidden="true"
                className="absolute -top-24 -left-32 w-96 h-96 rounded-full blur-3xl opacity-[0.07] pointer-events-none"
                style={{ background: "var(--gradient-brand)" }}
            />

            <div className="container mx-auto px-2 lg:px-0 relative space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                    <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 self-start">
                        <ServiceSectionIntro
                            numeral="05"
                            kicker={whyopt.tagline || "Why SkillDeck"}
                            title={whyopt.title || "Core Value Proposition"}
                            description={whyopt.description}
                        />

                        {whyopt.cta && (
                            <ServiceCtaBanner title={whyopt.cta} source="service-why-opt" />
                        )}
                    </div>

                    {points.length > 0 && (
                        <div className="lg:col-span-7 space-y-3">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-brand-secondary">
                                How We Partner
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {points.map((point, i) => {
                                    const accent = accentAt(TILE_ACCENTS, i);
                                    return (
                                        <li
                                            key={i}
                                            className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm p-5 flex items-start gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
                                        >
                                            <span
                                                aria-hidden="true"
                                                className="absolute inset-y-0 left-0 w-1 scale-y-0 origin-top group-hover:scale-y-100 transition-transform duration-500"
                                                style={{ backgroundColor: accent.hex }}
                                            />
                                            <ServiceIconWrapper
                                                iconString={point.icon}
                                                className="w-11 h-11 rounded-xl"
                                                iconClassName="w-5 h-5"
                                                defaultIcon="Check"
                                                fallbackBgClass={accent.chip}
                                            />
                                            <div className="min-w-0">
                                                <p className="text-base font-extrabold text-brand-dark leading-snug">
                                                    {point.title}
                                                </p>
                                                {point.description && (
                                                    <p className="text-sm text-brand-muted leading-relaxed mt-1">
                                                        {point.description}
                                                    </p>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>

                {stats.length > 0 && (
                    <div className="relative overflow-hidden rounded-3xl bg-brand-dark p-6 md:p-8">
                        <div
                            aria-hidden="true"
                            className="absolute -top-28 -right-20 w-80 h-80 rounded-full blur-3xl opacity-25 pointer-events-none"
                            style={{ background: "var(--gradient-brand)" }}
                        />
                        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-white/10">
                            {stats.map((stat, i) => (
                                <div key={i} className="flex items-center gap-4 lg:px-6 first:lg:pl-0 last:lg:pr-0">
                                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                        <ServiceItemIcon
                                            iconString={stat.icon}
                                            className={`w-5 h-5 ${accentAt(STAT_ACCENTS, i).text}`}
                                            defaultIcon="ShieldAlert"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-2xl font-black text-white leading-none tracking-tight">
                                            {stat.value}
                                        </p>
                                        <p className="text-xs text-white/60 font-semibold mt-1.5 leading-snug">
                                            {stat.description}
                                        </p>
                                        {/* {stat.tagline && stat.description && (
                                            <p className="text-[11px] text-white/40 mt-0.5 leading-snug">
                                                {stat.tagline}
                                            </p>
                                        )} */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
