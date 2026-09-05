"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Briefcase, Building2, Check, GraduationCap, Mic, TrendingUp } from "lucide-react";
import { useLeadModal } from "@/components/Forms/LeadModalContext";
import { DemoSectionHeading } from "./primitives";
import { demoImages } from "./images";
import { sectionPad, shell } from "./theme";
import { panelTransition, Reveal } from "./motion";

const USE_CASES = [
    {
        id: "institutes",
        photo: demoImages.useCases.institutes,
        icon: GraduationCap,
        label: "Coaching institutes",
        accent: "#0E9A8D",
        headline: "Multi-branch batches without a spreadsheet per branch",
        body: "Run every centre on the same programme structure while each branch keeps its own batches, fees and counsellors — with a single roll-up for the founder.",
        pain: "Every centre keeps its own fee sheet, and month-end never reconciles.",
        outcomes: [
            { value: "42%", label: "less admin time per batch" },
            { value: "3.1x", label: "faster fee reconciliation" },
        ],
        checklist: [
            "Branch-level roles and permissions",
            "Per-centre fee plans",
            "Consolidated revenue reporting",
            "Cross-branch batch transfers",
        ],
    },
    {
        id: "corporate",
        photo: demoImages.useCases.corporate,
        icon: Briefcase,
        label: "Corporate L&D",
        accent: "#6366F1",
        headline: "Compliance training your auditors can actually verify",
        body: "Assign programmes by department, track completion against deadlines, and export the evidence trail without asking anyone for a screenshot.",
        pain: "Proving who completed what means chasing managers for screenshots.",
        outcomes: [
            { value: "96%", label: "on-time completion" },
            { value: "0", label: "manual evidence chasing" },
        ],
        checklist: [
            "Department-based assignment",
            "Deadline and reminder automation",
            "Exportable audit trail",
            "Manager-level dashboards",
        ],
    },
    {
        id: "universities",
        photo: demoImages.useCases.universities,
        icon: Building2,
        label: "Universities",
        accent: "#0891B2",
        headline: "Continuing-education programmes that pay for themselves",
        body: "Stand up short courses and executive programmes alongside the degree calendar, with their own admissions flow, pricing and faculty allocation.",
        pain: "Short courses get run on the degree system, or on nothing at all.",
        outcomes: [
            { value: "18 days", label: "to launch a new programme" },
            { value: "2.4x", label: "growth in short-course intake" },
        ],
        checklist: [
            "Separate admissions funnels",
            "Faculty allocation and load view",
            "Certificate issuance at scale",
            "Department-level P&L",
        ],
    },
    {
        id: "creators",
        photo: demoImages.useCases.creators,
        icon: Mic,
        label: "Independent educators",
        accent: "#EC4899",
        headline: "A studio-grade academy without a studio-grade team",
        body: "Sell cohorts and self-paced courses from the same catalogue, run the live sessions, and keep the learner relationship instead of renting it from a marketplace.",
        pain: "The marketplace owns your learner list, your pricing and your margin.",
        outcomes: [
            { value: "8 min", label: "to publish a new cohort" },
            { value: "100%", label: "of the learner list stays yours" },
        ],
        checklist: [
            "Cohort and evergreen catalogue",
            "Own checkout and pricing",
            "Learner CRM included",
            "Your domain, your branding",
        ],
    },
];

/** How long each audience holds before the set advances on its own. */
const ROTATE_MS = 7000;

/**
 * Use cases — a tab set rather than four parallel cards. Each audience gets the
 * full panel width and its own accent, so what the reader sees is the difference
 * between them, not a repeated shape.
 *
 * The set advances on its own so a passive reader still meets all four, with a
 * progress bar under the active tab showing that it will. Hovering pauses it,
 * and any manual choice ends the rotation for good — nothing is more irritating
 * than a panel that moves on while you are reading the one you picked.
 */
export default function DemoUseCases() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const inView = useInView(sectionRef, { margin: "0px 0px -120px 0px" });
    const reduced = useReducedMotion();
    const { openModal } = useLeadModal();

    const [activeId, setActiveId] = useState(USE_CASES[0].id);
    const [autoRotate, setAutoRotate] = useState(true);
    const [paused, setPaused] = useState(false);

    const active = USE_CASES.find((useCase) => useCase.id === activeId) ?? USE_CASES[0];
    const rotating = autoRotate && !paused && inView && !reduced;

    useEffect(() => {
        if (!rotating) return;

        const timer = setInterval(() => {
            setActiveId((current) => {
                const index = USE_CASES.findIndex((useCase) => useCase.id === current);
                return USE_CASES[(index + 1) % USE_CASES.length].id;
            });
        }, ROTATE_MS);

        return () => clearInterval(timer);
    }, [rotating]);

    const pick = (id: string) => {
        setActiveId(id);
        setAutoRotate(false);
    };

    return (
        <section id="solutions" className={`bg-[var(--sd-surface)] ${sectionPad} scroll-mt-24`}>
            <div className={shell} ref={sectionRef}>
                <Reveal>
                    <DemoSectionHeading
                        eyebrow="Who it's for"
                        title="Built for the way each teaching business actually runs"
                        description="Same platform, four very different operating models. Pick the one closest to yours."
                        align="center"
                    />
                </Reveal>

                {/* Tabs */}
                <div
                    role="tablist"
                    aria-label="Use cases"
                    className="mt-10 flex flex-wrap justify-center gap-2"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    onFocus={() => setPaused(true)}
                    onBlur={() => setPaused(false)}
                >
                    {USE_CASES.map((useCase) => {
                        const isActive = useCase.id === active.id;
                        return (
                            <button
                                key={useCase.id}
                                role="tab"
                                type="button"
                                aria-selected={isActive}
                                aria-controls={`panel-${useCase.id}`}
                                id={`tab-${useCase.id}`}
                                onClick={() => pick(useCase.id)}
                                className={`relative inline-flex items-center gap-2 overflow-hidden rounded-full border px-4 py-2.5 text-sm font-bold transition-colors duration-300 ${isActive
                                    ? "border-transparent text-white"
                                    : "border-[var(--sd-line)] bg-white text-[var(--sd-muted)] hover:text-[var(--sd-text)] hover:border-[var(--sd-primary)]/40"
                                    }`}
                            >
                                {/* One shared pill slides between tabs rather than each tab
                                    fading its own background in and out. */}
                                {isActive && (
                                    <motion.span
                                        layoutId="use-case-pill"
                                        aria-hidden="true"
                                        className="absolute inset-0 rounded-full shadow-lg shadow-slate-300/50"
                                        style={{ backgroundColor: useCase.accent }}
                                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                                    />
                                )}

                                {/* Countdown to the next audience, so the rotation is
                                    announced rather than surprising. */}
                                {isActive && rotating && (
                                    <motion.span
                                        key={`${useCase.id}-progress`}
                                        aria-hidden="true"
                                        className="absolute bottom-0 left-0 h-0.5 bg-white/60"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: ROTATE_MS / 1000, ease: "linear" }}
                                    />
                                )}

                                <useCase.icon className="relative w-4 h-4" aria-hidden="true" />
                                <span className="relative">{useCase.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Panel */}
                <div
                    role="tabpanel"
                    id={`panel-${active.id}`}
                    aria-labelledby={`tab-${active.id}`}
                    className="mt-8 rounded-3xl border border-[var(--sd-line)] bg-white overflow-hidden shadow-sm"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={panelTransition}
                            className="grid grid-cols-1 lg:grid-cols-12"
                        >
                            <div className="lg:col-span-7 p-7 md:p-10 flex flex-col">
                                {/* The problem in their words, before the answer */}
                                <p
                                    className="text-sm font-semibold text-[var(--sd-muted)] border-l-2 pl-3"
                                    style={{ borderColor: active.accent }}
                                >
                                    {active.pain}
                                </p>

                                <h3 className="mt-5 text-xl md:text-2xl font-extrabold text-[var(--sd-text)] leading-snug">
                                    {active.headline}
                                </h3>
                                <p className="mt-3 text-sm md:text-base text-[var(--sd-muted)] leading-relaxed max-w-xl">
                                    {active.body}
                                </p>

                                <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                                    {active.checklist.map((item) => (
                                        <li
                                            key={item}
                                            className="flex items-start gap-2.5 text-sm text-[var(--sd-text)] font-medium"
                                        >
                                            <span
                                                className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                                                style={{ backgroundColor: `${active.accent}1f` }}
                                            >
                                                <Check
                                                    className="w-2.5 h-2.5"
                                                    style={{ color: active.accent }}
                                                    aria-hidden="true"
                                                />
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                {/* Closes the trailing whitespace and gives each audience its
                                    own ask, rather than one generic CTA far below. */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        openModal({
                                            source: `service-demo-use-case-${active.id}`,
                                            formTitle: `SkillDeck for ${active.label.toLowerCase()}`,
                                            defaultValues: { subject: `Walkthrough — ${active.label}` },
                                        })
                                    }
                                    className="group mt-auto pt-7 inline-flex items-center gap-2 self-start text-sm font-bold"
                                    style={{ color: active.accent }}
                                >
                                    See a walkthrough for {active.label.toLowerCase()}
                                    <ArrowRight
                                        className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>

                            {/* Photo panel — the audience made concrete, with the outcome
                                numbers over it as glass cards. */}
                            <div className="lg:col-span-5 relative min-h-[20rem]">
                                <Image
                                    src={active.photo.src}
                                    alt={active.photo.alt}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 40vw"
                                    className="object-cover"
                                />
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0"
                                    style={{
                                        background: `linear-gradient(200deg, ${active.accent}1f 0%, rgba(6,33,49,0.78) 100%)`,
                                    }}
                                />

                                <div className="relative h-full p-6 md:p-7 flex flex-col justify-between gap-5">
                                    <span className="inline-flex self-start items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                                        <TrendingUp className="w-3 h-3" aria-hidden="true" />
                                        Typical outcome
                                    </span>

                                    <div className="grid grid-cols-2 gap-3">
                                        {active.outcomes.map((outcome, i) => (
                                            <motion.div
                                                key={outcome.label}
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.12 + i * 0.08, duration: 0.4 }}
                                                className="rounded-xl bg-white/12 backdrop-blur-md border border-white/20 p-3.5"
                                            >
                                                <p className="text-2xl md:text-3xl font-black leading-none tracking-tight text-white">
                                                    {outcome.value}
                                                </p>
                                                <p className="mt-1.5 text-[11px] font-semibold text-white/75 leading-snug">
                                                    {outcome.label}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
