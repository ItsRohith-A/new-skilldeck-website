import React from "react";
import { Check } from "lucide-react";
import { DemoPhoto, DemoSectionHeading } from "./primitives";
import { OutcomeMock } from "./mocks";
import PipelineFlow from "./PipelineFlow";
import CohortClone from "./CohortClone";
import { demoImages } from "./images";
import { sectionPad, shell } from "./theme";
import { Reveal } from "./motion";

const STEPS = [
    {
        index: "01",
        title: "Capture demand without chasing it",
        description:
            "Enquiries from your site, ads and walk-ins land in one pipeline with owners, reminders and a counsellor script — nothing sits in a personal inbox.",
        bullets: ["Web, WhatsApp and call-in capture", "Auto-assigned follow-up windows", "Source-level cost per enrolment"],
        stats: [
            { value: "2.4x", label: "faster first response" },
            { value: "0", label: "leads stuck in an inbox" },
        ],
        replaces: ["Enquiry spreadsheet", "Personal inboxes", "Reminder sticky notes"],
        photo: demoImages.admissions,
        overlay: <PipelineFlow />,
    },
    {
        index: "02",
        title: "Deliver the programme on rails",
        description:
            "Batches inherit their structure from the programme template, so a new cohort is a two-minute setup instead of a week of copying schedules.",
        bullets: ["Reusable programme templates", "Live sessions with attendance sync", "Assessments and certificates built in"],
        stats: [
            { value: "2 min", label: "to open a new batch" },
            { value: "1", label: "template behind every cohort" },
        ],
        replaces: ["Copied schedules", "Duplicate course docs", "Paper attendance sheets"],
        photo: demoImages.classroom,
        overlay: <CohortClone />,
    },
    {
        index: "03",
        title: "Prove the outcome, then renew on it",
        description:
            "Completion, pass rates and engagement roll up per batch and per learner — the numbers your renewal conversation actually needs.",
        bullets: ["Cohort and learner-level reporting", "At-risk learner flags", "Renewal and referral tracking"],
        stats: [
            { value: "1 click", label: "to a cohort report" },
            { value: "31%", label: "lift in renewals" },
        ],
        replaces: ["Month-end report building", "Guesswork at renewal", "Ad-hoc check-in calls"],
        photo: demoImages.outcomes,
        overlay: <OutcomeMock />,
    },
];

/**
 * How it helps — alternating rows rather than a card grid, so the three phases
 * read as a sequence.
 *
 * Each row pairs a photograph with the matching product panel overlapping its
 * lower corner: the photo says who this is for, the panel says what they get.
 * Below `lg` the overlap would crush the photo, so the panel drops underneath.
 */
export default function DemoWorkflow() {
    return (
        <section id="how-it-works" className={`bg-white ${sectionPad} scroll-mt-24`}>
            <div className={shell}>
                <DemoSectionHeading
                    eyebrow="How it works"
                    title="From first enquiry to proven outcome"
                    description="Three phases, one record of truth. Nothing gets re-keyed between them."
                    align="center"
                />

                <div className="mt-14 md:mt-16 space-y-16 md:space-y-24">
                    {STEPS.map((step, i) => {
                        const flipped = i % 2 === 1;
                        return (
                            <div
                                key={step.index}
                                className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
                            >
                                <Reveal
                                    from={flipped ? "right" : "left"}
                                    className={`lg:col-span-6 space-y-5 ${flipped ? "lg:order-2" : ""}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span
                                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black text-white shrink-0"
                                            style={{ background: "var(--sd-gradient)" }}
                                        >
                                            {step.index}
                                        </span>
                                        <span aria-hidden="true" className="hidden sm:block flex-1 h-px bg-[var(--sd-line)]" />
                                    </div>

                                    <h3 className="text-xl md:text-2xl font-extrabold text-[var(--sd-text)] leading-snug">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm md:text-base text-[var(--sd-muted)] leading-relaxed max-w-xl">
                                        {step.description}
                                    </p>

                                    <ul className="space-y-2.5 pt-1">
                                        {step.bullets.map((bullet) => (
                                            <li key={bullet} className="flex items-start gap-2.5">
                                                <span className="mt-0.5 w-4 h-4 rounded-full bg-[var(--sd-primary)]/12 flex items-center justify-center shrink-0">
                                                    <Check className="w-2.5 h-2.5 text-[var(--sd-primary)]" aria-hidden="true" />
                                                </span>
                                                <span className="text-sm text-[var(--sd-text)] font-medium">{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Proof and displacement, so the copy column carries the
                                        same weight as the visual beside it instead of ending
                                        halfway up the row. */}
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        {step.stats.map((stat) => (
                                            <div key={stat.label} className="border-l-2 border-[var(--sd-primary)]/25 pl-3">
                                                <p className="text-2xl font-black text-[var(--sd-text)] leading-none tracking-tight">
                                                    {stat.value}
                                                </p>
                                                <p className="mt-1.5 text-xs font-semibold text-[var(--sd-muted)] leading-snug">
                                                    {stat.label}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="rounded-2xl border border-[var(--sd-line)] bg-[var(--sd-surface)]/60 p-4">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--sd-muted)]">
                                            Replaces
                                        </p>
                                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                                            {step.replaces.map((item) => (
                                                <span
                                                    key={item}
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--sd-line)] bg-white px-2.5 py-1 text-[11px] font-semibold text-[var(--sd-muted)] line-through decoration-[var(--sd-muted)]/40"
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </Reveal>

                                <Reveal
                                    from={flipped ? "left" : "right"}
                                    delay={0.1}
                                    className={`lg:col-span-6 ${flipped ? "lg:order-1" : ""}`}
                                >
                                    {/* Photo above, panel overlapping it in normal flow.
                                        Absolutely positioning the panel meant reserving a fixed
                                        gap for it — when the panel grew past that reserve it
                                        covered the photograph and hung off the bottom edge.
                                        A negative margin lets the overlap follow the panel's
                                        real height at every breakpoint. */}
                                    <div className="relative">
                                        <div
                                            aria-hidden="true"
                                            className="absolute -inset-4 rounded-[2rem] blur-2xl opacity-[0.12] pointer-events-none"
                                            style={{ background: "var(--sd-gradient)" }}
                                        />
                                        <DemoPhoto
                                            src={step.photo.src}
                                            alt={step.photo.alt}
                                            aspect="aspect-[16/10]"
                                            className="relative"
                                            sizes="(max-width: 1024px) 100vw, 46vw"
                                        />

                                        <div
                                            className={`relative z-10 -mt-10 sm:-mt-12 w-[92%] sm:w-[88%] ${flipped ? "ml-auto mr-0" : "mr-auto ml-0"
                                                }`}
                                        >
                                            {step.overlay}
                                        </div>
                                    </div>
                                </Reveal>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
