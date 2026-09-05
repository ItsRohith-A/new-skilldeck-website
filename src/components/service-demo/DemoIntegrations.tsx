import React from "react";
import Image from "next/image";
import {
    BarChart3,
    CalendarDays,
    CreditCard,
    Mail,
    MessageCircle,
    Plug,
    Video,
    Webhook,
} from "lucide-react";
import { DemoSectionHeading } from "./primitives";
import { demoAccentAt, sectionPad, shell } from "./theme";
import { Reveal } from "./motion";

const INTEGRATIONS = [
    { icon: Video, name: "Video conferencing", note: "Zoom, Meet, Teams" },
    { icon: CreditCard, name: "Payments", note: "Stripe, Razorpay, PayPal" },
    { icon: MessageCircle, name: "Messaging", note: "WhatsApp, SMS gateways" },
    { icon: Mail, name: "Email delivery", note: "Your domain, your sender" },
    { icon: CalendarDays, name: "Calendars", note: "Two-way sync with Google & Outlook" },
    { icon: BarChart3, name: "Analytics", note: "GA4, Meta, warehouse exports" },
];

/**
 * Ecosystem — a hub-and-spoke: the platform node sits in the middle of the row
 * on desktop with connector lines drawn either side, and the whole thing
 * degrades to a plain stacked grid on small screens where lines would lie.
 */
export default function DemoIntegrations() {
    return (
        <section className={`bg-[var(--sd-surface)] ${sectionPad}`}>
            <div className={shell}>
                <DemoSectionHeading
                    eyebrow="Ecosystem"
                    title="Connects to the tools your team already pays for"
                    description="Native integrations for the common stack, a documented API and webhooks for everything else."
                    align="center"
                />

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center">
                    {/* Left column */}
                    <div className="lg:col-span-4 space-y-4">
                        {INTEGRATIONS.slice(0, 3).map((integration, i) => (
                            <IntegrationTile key={integration.name} integration={integration} index={i} align="right" />
                        ))}
                    </div>

                    {/* Hub — the real wordmark rather than a stand-in icon.
                        It sits on a white plate inside a gradient ring: the mark carries
                        its own brand colours, which would fight the teal ramp if it were
                        dropped straight onto the dark tile. */}
                    <Reveal from="scale" className="lg:col-span-4 flex justify-center">
                        <div className="relative">
                            <div
                                aria-hidden="true"
                                className="absolute -inset-10 rounded-full blur-3xl opacity-25 pointer-events-none"
                                style={{ background: "var(--sd-gradient)" }}
                            />

                            <div
                                className="relative rounded-3xl p-[2px] shadow-2xl shadow-[#0E9A8D]/25"
                                style={{ background: "var(--sd-gradient)" }}
                            >
                                <div className="rounded-[calc(1.5rem-1px)] bg-white px-7 py-6 flex flex-col items-center gap-3">
                                    <Image
                                        src="/logos/mainlogo.svg"
                                        alt="SkillDeck"
                                        width={191}
                                        height={43}
                                        className="w-[9.5rem] h-auto"
                                    />
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--sd-surface)] border border-[var(--sd-line)] px-2.5 py-1">
                                        <Plug className="w-3 h-3 text-[var(--sd-primary)]" aria-hidden="true" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--sd-muted)]">
                                            Core platform
                                        </span>
                                    </span>
                                </div>
                            </div>

                            {/* Connector lines — desktop only, where the layout actually is a hub */}
                            <span
                                aria-hidden="true"
                                className="hidden lg:block absolute top-1/2 right-full w-10 h-px bg-gradient-to-l from-[var(--sd-primary)]/50 to-transparent"
                            />
                            <span
                                aria-hidden="true"
                                className="hidden lg:block absolute top-1/2 left-full w-10 h-px bg-gradient-to-r from-[var(--sd-primary)]/50 to-transparent"
                            />
                        </div>
                    </Reveal>

                    {/* Right column */}
                    <div className="lg:col-span-4 space-y-4">
                        {INTEGRATIONS.slice(3).map((integration, i) => (
                            <IntegrationTile key={integration.name} integration={integration} index={i + 3} align="left" />
                        ))}
                    </div>
                </div>

                {/* Developer strip */}
                <div className="mt-10 rounded-2xl border border-[var(--sd-line)] bg-white p-6 md:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="flex items-start gap-4">
                        <span className="w-11 h-11 rounded-xl bg-[var(--sd-primary)]/10 flex items-center justify-center shrink-0">
                            <Webhook className="w-5 h-5 text-[var(--sd-primary)]" aria-hidden="true" />
                        </span>
                        <div>
                            <p className="text-base font-extrabold text-[var(--sd-text)]">Anything not on the list</p>
                            <p className="mt-1 text-sm text-[var(--sd-muted)] leading-relaxed max-w-xl">
                                REST API, event webhooks and scheduled exports — so your data team can wire SkillDeck
                                into the warehouse without waiting on our roadmap.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 shrink-0">
                        {["REST API", "Webhooks", "CSV exports"].map((chip) => (
                            <span
                                key={chip}
                                className="rounded-full border border-[var(--sd-line)] bg-[var(--sd-surface)] px-3 py-1.5 text-xs font-bold text-[var(--sd-text)]"
                            >
                                {chip}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function IntegrationTile({
    integration,
    index,
    align,
}: {
    integration: (typeof INTEGRATIONS)[number];
    index: number;
    align: "left" | "right";
}) {
    const accent = demoAccentAt(index);
    return (
        <Reveal from={align === "right" ? "left" : "right"} delay={(index % 3) * 0.08}>
        <div
            className={`group flex items-center gap-3.5 rounded-2xl border border-[var(--sd-line)] bg-white p-4 hover:border-[var(--sd-primary)]/30 hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-0.5 transition-all duration-300 ${align === "right" ? "lg:flex-row-reverse lg:text-right" : ""
                }`}
        >
            <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent.chip}`}>
                <integration.icon className="w-5 h-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
                <p className="text-sm font-extrabold text-[var(--sd-text)] leading-snug">{integration.name}</p>
                <p className="mt-0.5 text-xs text-[var(--sd-muted)] truncate">{integration.note}</p>
            </div>
        </div>
        </Reveal>
    );
}
