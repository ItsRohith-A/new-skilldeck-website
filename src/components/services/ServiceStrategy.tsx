"use client";

import { ArrowUpRight } from "lucide-react";
import { ServiceStrategy } from "./types";
import ServiceIconWrapper from "./ServiceIconWrapper";
import ServiceSectionIntro from "./ServiceSectionIntro";
import { Button } from "@/components/ui/Button";
import { useLeadModal } from "@/components/Forms/LeadModalContext";

interface ServiceStrategyProps {
    strategy?: ServiceStrategy;
}

/**
 * `strategy.media` is rendered by `ServiceApproach` instead — the approach
 * timeline has the empty column that suits it, and this section reads better
 * as a clean 2-up card grid.
 */
export default function ServiceStrategyComponent({ strategy = {} }: ServiceStrategyProps) {
    const { openModal } = useLeadModal();

    const points = (strategy.points || []).filter((p) => p?.title);
    const stats = (strategy.stats || []).filter((s) => s?.value);
    if (points.length === 0 && stats.length === 0) return null;

    const title = strategy.title || "Smart Strategies That Scale";

    return (
        <section id="strategy" className="scroll-mt-24 section-y bg-slate-50/70 relative overflow-hidden">
            <div
                aria-hidden="true"
                className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
                style={{ background: "var(--gradient-brand)" }}
            />
            <div className="container mx-auto px-2 lg:px-0 relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                    <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 self-start">
                        <ServiceSectionIntro
                            numeral="04"
                            kicker={strategy.tagline || "Strategic Edge"}
                            title={title}
                            description={strategy.description}
                        />

                        {stats.length > 0 && (
                            <div className="flex flex-wrap gap-x-1 lg:gap-x-6 gap-y-5 pt-2">
                                {stats.map((stat, i) => (
                                    <div key={i} className={`max-w-[200px] ${i > 0 ? "sm:pl-6 sm:border-l border-slate-200" : ""}`}>
                                        <p className="text-xl lg:text-2xl font-black text-brand-primary leading-none">{stat.value}</p>
                                        <p className="text-xs font-semibold text-brand-muted mt-1.5">
                                            {stat.tagline || stat.description}
                                        </p>
                                        {stat.tagline && stat.description && (
                                            <p className="text-[11px] text-brand-muted/70 mt-0.5 leading-snug">
                                                {stat.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {strategy.cta && (
                            <Button
                                onClick={() => openModal({ source: "service-strategy", formTitle: strategy.cta })}
                                variant="primary"
                                className="rounded-full font-bold"
                            >
                                {strategy.cta}
                                <ArrowUpRight className="w-4 h-4" />
                            </Button>
                        )}
                    </div>

                    {points.length > 0 && (
                        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {points.map((point, i) => (
                                <div
                                    key={i}
                                    className="group bg-white rounded-2xl border border-slate-100 p-5 space-y-2.5 shadow-sm hover:shadow-md hover:border-brand-primary/30 hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    <ServiceIconWrapper
                                        iconString={point.icon}
                                        className="w-10 h-10 rounded-xl"
                                        iconClassName="w-5 h-5"
                                        defaultIcon="Sparkles"
                                        fallbackBgClass="bg-brand-primary/10 text-brand-primary"
                                    />
                                    <h4 className="text-sm font-bold text-brand-dark">{point.title}</h4>
                                    {point.description && <p className="text-xs text-brand-muted leading-relaxed">{point.description}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
