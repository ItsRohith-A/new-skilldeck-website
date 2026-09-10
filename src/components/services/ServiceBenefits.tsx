import React from "react";
import { ServiceBenefitsData } from "./types";
import ServiceIconWrapper from "./ServiceIconWrapper";
import ServiceSectionIntro from "./ServiceSectionIntro";
import { accentAt, TILE_ACCENTS } from "./accents";

interface ServiceBenefitsProps {
    benefits?: ServiceBenefitsData;
}

/** Benefits as an asymmetric bento grid — the first outcome gets a larger, featured tile. */
export default function ServiceBenefits({ benefits = {} }: ServiceBenefitsProps) {
    const points = (benefits.points || []).filter((p) => p?.title);
    if (points.length === 0) return null;

    return (
        <section id="benefits" className="scroll-mt-24 section-y bg-slate-50/70">
            <div className="container mx-auto px-4 lg:px-0 space-y-10">
                <ServiceSectionIntro
                    numeral="02"
                    kicker={benefits.tagline || "The Outcome"}
                    title={benefits.title || "Expected Outcomes & Business Advantages"}
                    description={benefits.description}
                    align="center"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {points.map((point, i) => {
                        const featured = i === 0;
                        // The featured tile carries the full brand ramp; the rest take one
                        // accent each, so colour reads as a system instead of confetti.
                        const accent = accentAt(TILE_ACCENTS, i);

                        if (featured) {
                            return (
                                <div
                                    key={i}
                                    className="group relative overflow-hidden rounded-3xl p-6 md:p-7 border border-brand-dark bg-brand-dark text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:col-span-2"
                                >
                                    {/* Brand bloom, warmed on hover — the section's single loud moment. */}
                                    <div
                                        aria-hidden="true"
                                        className="absolute -top-24 -right-16 w-72 h-72 rounded-full blur-3xl opacity-30 group-hover:opacity-45 transition-opacity duration-500 pointer-events-none"
                                        style={{ background: "var(--gradient-brand)" }}
                                    />
                                    <span
                                        aria-hidden="true"
                                        className="absolute inset-x-0 top-0 h-1"
                                        style={{ background: "var(--gradient-brand)" }}
                                    />

                                    <div className="relative space-y-3">
                                        <ServiceIconWrapper
                                            iconString={point.icon}
                                            className="w-12 h-12 rounded-2xl shadow-lg shadow-black/20"
                                            iconClassName="w-6 h-6 text-white"
                                            defaultIcon="Check"
                                            fallbackBgClass="text-white bg-brand-gradient"
                                        />
                                        <h3 className="text-xl lg:text-2xl font-extrabold leading-snug">{point.title}</h3>
                                        {point.description && (
                                            <p className="text-sm text-white/70 leading-relaxed">{point.description}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div
                                key={i}
                                className="group relative overflow-hidden rounded-3xl p-6 md:p-7 bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                                {/* Accent rule wipes in on hover, tinted to this card's icon. */}
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-x-0 top-0 h-1 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500"
                                    style={{ backgroundColor: accent.hex }}
                                />

                                <div className="space-y-3">
                                    <ServiceIconWrapper
                                        iconString={point.icon}
                                        className="w-12 h-12 rounded-2xl group-hover:scale-105 transition-transform duration-300"
                                        iconClassName="w-6 h-6"
                                        defaultIcon="Check"
                                        fallbackBgClass={accent.chip}
                                    />
                                    <h3 className="text-base lg:text-lg font-extrabold leading-snug text-brand-dark">{point.title}</h3>
                                    {point.description && (
                                        <p className="text-sm text-brand-muted leading-relaxed">{point.description}</p>
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
