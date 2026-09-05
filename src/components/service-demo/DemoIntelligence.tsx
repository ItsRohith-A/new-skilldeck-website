import React from "react";
import { Gauge, Sparkles, TriangleAlert, Wand2 } from "lucide-react";
import Image from "next/image";
import { DemoSectionHeading } from "./primitives";
import { demoImages } from "./images";
import IntelligenceStream from "./IntelligenceStream";
import { sectionPad, shell } from "./theme";

const CAPABILITIES = [
    {
        icon: TriangleAlert,
        title: "At-risk detection",
        description: "Attendance, submission and engagement signals combine into one risk score per learner, updated nightly.",
        metric: "11 days",
        metricLabel: "earlier warning, on average",
    },
    {
        icon: Wand2,
        title: "Assisted course drafting",
        description: "Turn an outline into a module structure, session plan and draft assessments your faculty then edits.",
        metric: "70%",
        metricLabel: "less time to first draft",
    },
    {
        icon: Gauge,
        title: "Revenue forecasting",
        description: "Pipeline stage, historical conversion and seasonality project the quarter — with the assumptions shown.",
        metric: "±4%",
        metricLabel: "forecast variance",
    },
];

const SIGNALS = ["Attendance", "Submissions", "Assessment scores", "Session engagement", "Payment history", "Support threads"];

/**
 * Intelligence — the page's second dark moment, placed after the reader knows
 * what the platform does, so automation reads as leverage rather than novelty.
 * The concentric rings are pure CSS and decorative.
 */
export default function DemoIntelligence() {
    return (
        <section
            id="intelligence"
            className={`relative overflow-hidden scroll-mt-24 ${sectionPad}`}
            style={{ background: "var(--sd-ink)" }}
        >
            <div
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[52rem] h-[52rem] rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ background: "radial-gradient(circle, #0E9A8D 0%, transparent 60%)" }}
            />

            <div className={`${shell} relative`}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    <div className="lg:col-span-6">
                        <DemoSectionHeading
                            dark
                            eyebrow="Intelligence layer"
                            title="The system notices what a busy team cannot"
                            description="Every action on the platform is already structured data. We use it to flag the learner about to drop, draft the work nobody enjoys, and tell you where the quarter lands — with the reasoning visible, never a black box."
                        />

                        <div className="mt-8">
                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Signals we read</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {SIGNALS.map((signal) => (
                                    <span
                                        key={signal}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-white/70"
                                    >
                                        <Sparkles className="w-3 h-3 text-[var(--sd-accent)]" aria-hidden="true" />
                                        {signal}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Live loop, replacing the static ring diagram: signals in, engine,
                        insight out — with the dashboard sample kept as the reference for
                        what it reads. */}
                    <div className="lg:col-span-6 space-y-4">
                        <IntelligenceStream />

                        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                            <span className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 border border-white/10">
                                <Image
                                    src={demoImages.intelligence.src}
                                    alt={demoImages.intelligence.alt}
                                    fill
                                    sizes="96px"
                                    className="object-cover"
                                />
                            </span>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-white leading-snug">
                                    Reads the same numbers your team does
                                </p>
                                <p className="mt-1 text-[11px] text-white/45 leading-snug">
                                    Nightly refresh · every score links back to the records behind it
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Capability row */}
                <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
                    {CAPABILITIES.map((capability) => (
                        <div
                            key={capability.title}
                            className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300"
                        >
                            <span className="w-11 h-11 rounded-xl bg-[var(--sd-primary)]/20 flex items-center justify-center">
                                <capability.icon className="w-5 h-5 text-[var(--sd-accent)]" aria-hidden="true" />
                            </span>
                            <h3 className="mt-4 text-base font-extrabold text-white leading-snug">{capability.title}</h3>
                            <p className="mt-2 text-sm text-white/55 leading-relaxed">{capability.description}</p>

                            <div className="mt-5 pt-4 border-t border-white/10">
                                <p className="text-2xl font-black text-white leading-none tracking-tight">{capability.metric}</p>
                                <p className="mt-1 text-[11px] text-white/40 font-semibold">{capability.metricLabel}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
