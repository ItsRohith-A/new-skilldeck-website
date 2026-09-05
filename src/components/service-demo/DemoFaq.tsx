"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { useLeadModal } from "@/components/Forms/LeadModalContext";
import { DemoSectionHeading } from "./primitives";
import { Reveal } from "./motion";
import { sectionPad, shell } from "./theme";

const FAQS = [
    {
        question: "How long does it take to go live?",
        answer:
            "Most academies run their first cohort on SkillDeck inside three to four weeks. The work that takes time is not configuration — it is agreeing who owns which stage of admissions. We run that session with you in week one.",
    },
    {
        question: "What happens to the data we already have?",
        answer:
            "Migration is included. We move learners, batches, fee history and course structures from spreadsheets or your current system, then run both in parallel for a cycle so you can check the numbers against something you trust.",
    },
    {
        question: "Do we pay per learner?",
        answer:
            "No. Pricing is per active batch and the modules you switch on, so a seasonal intake spike does not produce a surprise invoice. Storage, updates and support are in the plan rather than billed separately.",
    },
    {
        question: "Can it work alongside tools we are keeping?",
        answer:
            "Yes. Video, payments, messaging and calendars connect natively, and anything else goes through the REST API, webhooks or scheduled exports. Nothing on the platform is a dead end for your data team.",
    },
    {
        question: "Who owns the learner relationship?",
        answer:
            "You do. Learner records, contact details and course content are yours, exportable at any time in a documented format — including on the way out, which is the only time that promise actually matters.",
    },
    {
        question: "What does support look like after launch?",
        answer:
            "A named onboarding lead through the first cohort, then 24/7 support for anything that blocks a live session. Product questions go to the same team that built the module you are asking about.",
    },
];

/**
 * FAQ — the objections that stop a demo booking, answered before the closing
 * ask rather than left for the sales call.
 *
 * Answers stay mounted and collapse with a height animation, so the text is in
 * the DOM for search and for anyone reading with assistive tech.
 */
export default function DemoFaq() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const { openModal } = useLeadModal();

    return (
        <section id="faq" className={`bg-[var(--sd-surface)] ${sectionPad} scroll-mt-24`}>
            <div className={shell}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                    <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
                        <Reveal>
                            <DemoSectionHeading
                                eyebrow="Questions"
                                title="The things teams ask before they switch"
                                description="Short answers. The long version is a 30-minute call with someone who has migrated an academy before."
                            />
                        </Reveal>

                        <Reveal delay={0.1}>
                            <button
                                type="button"
                                onClick={() =>
                                    openModal({
                                        source: "service-demo-faq",
                                        formTitle: "Ask the SkillDeck team",
                                        defaultValues: { subject: "Question about the platform" },
                                    })
                                }
                                className="group w-full rounded-2xl border border-[var(--sd-line)] bg-white p-5 text-left hover:border-[var(--sd-primary)]/40 hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <p className="text-sm font-extrabold text-[var(--sd-text)]">Still not sure?</p>
                                <p className="mt-1 text-xs text-[var(--sd-muted)] leading-relaxed">
                                    Ask us the awkward question — pricing edge cases, migration horror stories, the lot.
                                </p>
                                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--sd-primary)]">
                                    Ask the team
                                    <ArrowRight
                                        className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                                        aria-hidden="true"
                                    />
                                </span>
                            </button>
                        </Reveal>
                    </div>

                    <div className="lg:col-span-8">
                        <ul className="divide-y divide-[var(--sd-line)] border-y border-[var(--sd-line)]">
                            {FAQS.map((faq, index) => {
                                const isOpen = openIndex === index;
                                return (
                                    <li key={faq.question}>
                                        <button
                                            type="button"
                                            onClick={() => setOpenIndex(isOpen ? null : index)}
                                            aria-expanded={isOpen}
                                            aria-controls={`faq-answer-${index}`}
                                            className="group w-full flex items-start gap-4 py-5 text-left"
                                        >
                                            <span className="text-xs font-black text-[var(--sd-primary)]/40 pt-1 w-6 shrink-0 tabular-nums">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                            <span className="flex-1 text-sm md:text-base font-bold text-[var(--sd-text)] group-hover:text-[var(--sd-primary)] transition-colors">
                                                {faq.question}
                                            </span>
                                            <span
                                                className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isOpen
                                                    ? "bg-[var(--sd-primary)] text-white"
                                                    : "bg-white border border-[var(--sd-line)] text-[var(--sd-primary)]"
                                                    }`}
                                            >
                                                {isOpen ? (
                                                    <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                                                ) : (
                                                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                                                )}
                                            </span>
                                        </button>

                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div
                                                    id={`faq-answer-${index}`}
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                                    className="overflow-hidden"
                                                >
                                                    <p className="pl-10 pr-10 pb-5 text-sm text-[var(--sd-muted)] leading-relaxed">
                                                        {faq.answer}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
