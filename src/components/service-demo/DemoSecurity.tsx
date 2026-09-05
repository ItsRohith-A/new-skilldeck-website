import React from "react";
import { DatabaseBackup, Globe2, KeyRound, Lock, Radio, ScrollText, ShieldCheck, Timer } from "lucide-react";
import { DemoPhoto, DemoSectionHeading } from "./primitives";
import { demoImages } from "./images";
import { sectionPad, shell } from "./theme";
import { CountUp, Reveal } from "./motion";

const CONTROLS = [
    { icon: Lock, title: "Encrypted end to end", note: "TLS in transit, AES-256 at rest" },
    { icon: KeyRound, title: "Granular access", note: "Role, branch and record-level rules" },
    { icon: ScrollText, title: "Full audit trail", note: "Every change attributed and exportable" },
    { icon: Globe2, title: "Regional residency", note: "Choose where learner data lives" },
    { icon: DatabaseBackup, title: "Point-in-time restore", note: "35-day recovery window" },
    { icon: ShieldCheck, title: "Continuous testing", note: "Independent penetration tests" },
];

const UPTIME = [
    { period: "Last 30 days", value: "100%", width: "w-full" },
    { period: "Last 90 days", value: "99.98%", width: "w-[99%]" },
    { period: "Trailing year", value: "99.95%", width: "w-[97%]" },
];

const INFRA_FACTS = [
    { icon: Globe2, value: "3", label: "Regions, active-active" },
    { icon: Timer, value: "<15 min", label: "Recovery objective" },
    { icon: Radio, value: "24/7", label: "On-call engineering" },
];

/** Named so the "3 regions" claim above is something the reader can check. */
const REGIONS = ["Mumbai", "Frankfurt", "N. Virginia"];

/**
 * Security — three stacked bands rather than two columns.
 *
 * The earlier 5/7 split left the right column short and the page blank beneath
 * it, because six small tiles simply are not as tall as a heading plus a panel
 * plus a photo. Bands keep every row full at any width: intro beside the uptime
 * panel, then the controls across the full width, then the infrastructure strip.
 */
export default function DemoSecurity() {
    return (
        <section id="security" className={`bg-white ${sectionPad} scroll-mt-24`}>
            <div className={shell}>
                {/* Band 1 — claim + live reliability readout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                    <div className="lg:col-span-6">
                        <DemoSectionHeading
                            eyebrow="Security & reliability"
                            title="Learner data handled like it belongs to someone"
                            description="Because it does. Every control below is a default on every plan, not an enterprise upsell."
                        />
                    </div>

                    <div className="lg:col-span-6">
                        <div className="rounded-2xl border border-[var(--sd-line)] bg-[var(--sd-surface)]/70 p-6 space-y-5">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-extrabold text-[var(--sd-text)]">Platform uptime</p>
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[var(--sd-primary)]">
                                    <span className="w-2 h-2 rounded-full bg-[var(--sd-primary)] animate-pulse" aria-hidden="true" />
                                    Operational
                                </span>
                            </div>

                            {UPTIME.map((row) => (
                                <div key={row.period} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-[var(--sd-muted)] font-semibold">{row.period}</span>
                                        <span className="font-black text-[var(--sd-text)]">{row.value}</span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${row.width}`}
                                            style={{ background: "var(--sd-gradient)" }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Band 2 — controls, three across so the row fills */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {CONTROLS.map((control, i) => (
                        <Reveal key={control.title} delay={i * 0.06}>
                        <div className="group flex items-start gap-4 h-full rounded-2xl border border-[var(--sd-line)] bg-white p-5 hover:border-[var(--sd-primary)]/30 hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-0.5 transition-all duration-300">
                            <span className="w-11 h-11 rounded-xl bg-[var(--sd-primary)]/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                                <control.icon className="w-5 h-5 text-[var(--sd-primary)]" aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-sm font-extrabold text-[var(--sd-text)] leading-snug">{control.title}</p>
                                <p className="mt-1 text-xs text-[var(--sd-muted)] leading-relaxed">{control.note}</p>
                            </div>
                        </div>
                        </Reveal>
                    ))}
                </div>

                {/* Band 3 — the infrastructure itself, with the numbers on top of it */}
                <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    <DemoPhoto
                        src={demoImages.security.src}
                        alt={demoImages.security.alt}
                        aspect="aspect-[16/9] lg:aspect-[21/9]"
                        className="lg:col-span-8"
                        sizes="(max-width: 1024px) 100vw, 62vw"
                    >
                        <span className="absolute bottom-4 left-4 right-4 inline-flex items-center gap-2 rounded-lg bg-black/50 backdrop-blur-sm px-3 py-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--sd-accent)] animate-pulse shrink-0" aria-hidden="true" />
                            <span className="text-[11px] font-semibold text-white">
                                Multi-region infrastructure, monitored around the clock
                            </span>
                        </span>
                    </DemoPhoto>

                    {/* Facts panel.
                        Three bare numbers stretched to the photo's height left the card
                        mostly empty. It now carries a header, icon-led rows and the actual
                        region names, which both fills the column and makes the "3 regions"
                        claim checkable. */}
                    <div className="lg:col-span-4 rounded-2xl border border-[var(--sd-line)] bg-[var(--sd-surface)]/70 p-6 flex flex-col">
                        <div className="flex items-center justify-between gap-3 pb-4 border-b border-[var(--sd-line)]">
                            <p className="text-sm font-extrabold text-[var(--sd-text)]">Infrastructure</p>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--sd-primary)]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--sd-primary)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--sd-primary)] animate-pulse" aria-hidden="true" />
                                Healthy
                            </span>
                        </div>

                        <div className="flex-1 flex flex-col justify-center gap-4 py-5">
                            {INFRA_FACTS.map((fact) => (
                                <div key={fact.label} className="flex items-center gap-3.5">
                                    <span className="w-10 h-10 rounded-xl bg-white border border-[var(--sd-line)] flex items-center justify-center shrink-0">
                                        <fact.icon className="w-4.5 h-4.5 text-[var(--sd-primary)]" aria-hidden="true" />
                                    </span>
                                    <div className="min-w-0">
                                        <CountUp
                                            value={fact.value}
                                            className="block text-xl font-black text-[var(--sd-text)] leading-none tracking-tight"
                                        />
                                        <p className="mt-1 text-xs font-semibold text-[var(--sd-muted)] leading-snug">
                                            {fact.label}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-[var(--sd-line)]">
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--sd-muted)]">
                                Live regions
                            </p>
                            <div className="mt-2.5 flex flex-wrap gap-1.5">
                                {REGIONS.map((region) => (
                                    <span
                                        key={region}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--sd-line)] bg-white px-2.5 py-1 text-[11px] font-semibold text-[var(--sd-text)]"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="w-1.5 h-1.5 rounded-full bg-[var(--sd-primary)]"
                                        />
                                        {region}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
