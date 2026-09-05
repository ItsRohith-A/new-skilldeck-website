import React from "react";
import { ArrowUpRight, CreditCard, Layers, MessagesSquare, Radio, Users } from "lucide-react";
import { DemoCard, DemoSectionHeading } from "./primitives";
import { BuilderMock } from "./mocks";
import { demoAccentAt, sectionPad, shell } from "./theme";
import { Reveal } from "./motion";

const SERVICES = [
    {
        icon: Radio,
        title: "Live class delivery",
        description: "Scheduling, attendance and recordings that land back on the learner's timeline automatically.",
    },
    {
        icon: Users,
        title: "Admissions CRM",
        description: "Every enquiry tracked from first touch to paid seat, with follow-ups your counsellors actually run.",
    },
    {
        icon: CreditCard,
        title: "Payments & plans",
        description: "Instalments, part-payments and refunds reconciled without a second finance sheet.",
    },
    {
        icon: MessagesSquare,
        title: "Learner engagement",
        description: "Nudges, announcements and doubt-clearing threads in the channel each cohort already uses.",
    },
];

/**
 * Core services — a bento: one feature-height card carrying the product visual,
 * four supporting cards beside it. Avoids the four-identical-tiles pattern while
 * keeping a single reading order on mobile.
 */
export default function DemoServices() {
    return (
        <section id="platform" className={`bg-[var(--sd-surface)] ${sectionPad} scroll-mt-24`}>
            <div className={shell}>
                <Reveal>
                    <DemoSectionHeading
                        eyebrow="What we run for you"
                        title="One platform for the work that keeps an academy alive"
                        description="Course delivery is the visible half. The other half — enrolments, money, learner follow-through — is where teams lose their week. SkillDeck covers both."
                    />
                </Reveal>

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
                    {/* Feature card.
                        A photo behind the builder panel fought it — the mock covered the
                        subject and what showed through was unreadable crop. Copy leads,
                        the panel sits on a tinted stage below it, and the capability chips
                        close the card. */}
                    <Reveal from="left" className="lg:col-span-5 flex">
                        <DemoCard className="flex flex-col w-full" interactive={false}>
                            <div className="p-6 md:p-7 space-y-3">
                                <div className="flex items-center gap-3">
                                    <span
                                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ background: "var(--sd-gradient)" }}
                                    >
                                        <Layers className="w-5 h-5 text-white" aria-hidden="true" />
                                    </span>
                                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--sd-primary)]">
                                        Most used
                                    </span>
                                </div>

                                <h3 className="text-xl font-extrabold text-[var(--sd-text)] leading-snug">
                                    Course &amp; cohort builder
                                </h3>
                                <p className="text-sm text-[var(--sd-muted)] leading-relaxed">
                                    Assemble a programme once — modules, live sessions, assessments, certificates — then
                                    clone it for every batch without rebuilding the structure.
                                </p>
                            </div>

                            {/* Tinted stage: the panel reads as product, not decoration */}
                            <div
                                className="relative flex-1 px-5 pt-5 pb-6 border-t border-[var(--sd-line)]"
                                style={{ background: "linear-gradient(180deg, #F4FAF9 0%, #EAF6F5 100%)" }}
                            >
                                <div
                                    aria-hidden="true"
                                    className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px"
                                    style={{ background: "var(--sd-gradient)" }}
                                />
                                <BuilderMock />


                            </div>
                        </DemoCard>
                    </Reveal>

                    {/* Supporting grid */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                        {SERVICES.map((service, i) => {
                            const accent = demoAccentAt(i);
                            return (
                                <Reveal key={service.title} delay={i * 0.08} className="flex">
                                    <DemoCard className="group p-6 flex flex-col w-full">
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-x-0 top-0 h-0.5 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500"
                                            style={{ backgroundColor: accent.hex }}
                                        />
                                        <span className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent.chip}`}>
                                            <service.icon className="w-5 h-5" aria-hidden="true" />
                                        </span>
                                        <h3 className="mt-4 text-base font-extrabold text-[var(--sd-text)] leading-snug">
                                            {service.title}
                                        </h3>
                                        <p className="mt-2 text-sm text-[var(--sd-muted)] leading-relaxed">
                                            {service.description}
                                        </p>
                                        <ArrowUpRight
                                            className="mt-4 w-4 h-4 text-slate-300 group-hover:text-[var(--sd-primary)] transition-colors"
                                            aria-hidden="true"
                                        />
                                    </DemoCard>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
