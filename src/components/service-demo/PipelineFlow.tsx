"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import { demoImages } from "./images";

/**
 * Admissions pipeline that actually runs.
 *
 * The static version was three columns of empty placeholder rows — it read as a
 * loading state and said nothing about admissions. Here leads advance stage by
 * stage on a loop: `layoutId` carries each card between columns so the movement
 * is a real transition rather than a fade, the stage counts follow, and a new
 * enquiry drops in to replace the one that converts.
 *
 * The loop runs only while the panel is on screen, and holds a filled snapshot
 * for anyone who asked for reduced motion.
 */

const STAGES = [
    { key: "enquiry", label: "Enquiry" },
    { key: "counselled", label: "Counselled" },
    { key: "enrolled", label: "Enrolled" },
] as const;

/**
 * A face and a source stay with the same person for the whole loop — a lead
 * whose photo changed as it moved between columns would undo the illusion the
 * board is selling.
 */
const PEOPLE = [
    { name: "Aisha Rahman", source: "Website", avatar: 0 },
    { name: "Sanjay Iyer", source: "WhatsApp", avatar: 1 },
    { name: "Maya Okafor", source: "Referral", avatar: 2 },
    { name: "Liam Chen", source: "Ads", avatar: 3 },
    { name: "Priya Nair", source: "Website", avatar: 4 },
    { name: "Daniel Silva", source: "Walk-in", avatar: 5 },
    { name: "Ravi Kaur", source: "Referral", avatar: 6 },
] as const;

const SOURCE_TONE: Record<string, string> = {
    Website: "#0E9A8D",
    WhatsApp: "#10B981",
    Referral: "#6366F1",
    Ads: "#F59E0B",
    "Walk-in": "#EC4899",
};

const MAX_PER_STAGE = 3;
const TICK_MS = 2400;

interface Lead {
    id: number;
    person: (typeof PEOPLE)[number];
    stage: number;
}

const INITIAL_LEADS: Lead[] = [
    { id: 1, person: PEOPLE[2], stage: 0 },
    { id: 2, person: PEOPLE[0], stage: 0 },
    { id: 3, person: PEOPLE[1], stage: 0 },
    { id: 4, person: PEOPLE[3], stage: 1 },
    { id: 5, person: PEOPLE[4], stage: 1 },
    { id: 6, person: PEOPLE[5], stage: 2 },
];

const INITIAL_COUNTS = [128, 74, 41];

export default function PipelineFlow() {
    const frameRef = useRef<HTMLDivElement>(null);
    const inView = useInView(frameRef, { margin: "0px 0px -80px 0px" });
    const reduced = useReducedMotion();

    const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
    const [counts, setCounts] = useState(INITIAL_COUNTS);
    const nextId = useRef(INITIAL_LEADS.length + 1);

    useEffect(() => {
        if (!inView || reduced) return;

        const timer = setInterval(() => {
            setLeads((current) => {
                // Advance the longest-waiting card in each stage, back to front, so a
                // single tick never moves the same card twice.
                const oldestIn = (stage: number) => current.find((lead) => lead.stage === stage);

                const converted = oldestIn(2);
                const toEnrol = oldestIn(1);
                const toCounsel = oldestIn(0);

                const advanced = current
                    .filter((lead) => lead.id !== converted?.id)
                    .map((lead) => {
                        if (lead.id === toEnrol?.id) return { ...lead, stage: 2 };
                        if (lead.id === toCounsel?.id) return { ...lead, stage: 1 };
                        return lead;
                    });

                if (advanced.filter((lead) => lead.stage === 0).length < MAX_PER_STAGE) {
                    advanced.push({
                        id: nextId.current,
                        person: PEOPLE[nextId.current % PEOPLE.length],
                        stage: 0,
                    });
                    nextId.current += 1;
                }

                return advanced;
            });

            setCounts(([enquiry, counselled, enrolled]) => [enquiry + 1, counselled + 1, enrolled + 1]);
        }, TICK_MS);

        return () => clearInterval(timer);
    }, [inView, reduced]);

    return (
        <div
            ref={frameRef}
            className="rounded-2xl overflow-hidden border border-[var(--sd-line)] bg-white shadow-sm"
        >
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--sd-line)] bg-[var(--sd-surface)]">
                <span className="flex gap-1.5" aria-hidden="true">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F87171]/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#34D399]/70" />
                </span>
                <span className="ml-2 text-[11px] font-semibold text-[var(--sd-muted)]">admissions pipeline</span>

                {!reduced && (
                    <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--sd-primary)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--sd-primary)] animate-pulse" aria-hidden="true" />
                        Live
                    </span>
                )}
            </div>

            {/* The board is a visualisation, not content to read row by row. */}
            <div className="p-2.5 grid grid-cols-3 gap-2" aria-hidden="true">
                {STAGES.map((stage, stageIndex) => {
                    const isFinal = stageIndex === STAGES.length - 1;
                    return (
                        <div
                            key={stage.key}
                            className={`relative rounded-xl border p-2 min-h-[12.5rem] ${isFinal
                                ? "border-[var(--sd-primary)]/25 bg-[var(--sd-primary)]/[0.05]"
                                : "border-[var(--sd-line)] bg-[var(--sd-surface)]/50"
                                }`}
                        >
                            <div className="flex items-center justify-between gap-1">
                                <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--sd-muted)] truncate">
                                    {stage.label}
                                </p>
                                {isFinal && (
                                    <TrendingUp className="w-3 h-3 text-[var(--sd-primary)] shrink-0" />
                                )}
                            </div>

                            <p className="mt-0.5 text-base font-black text-[var(--sd-text)] leading-none tabular-nums">
                                {counts[stageIndex]}
                            </p>

                            <div className="mt-2 space-y-1.5">
                                <AnimatePresence mode="popLayout" initial={false}>
                                    {leads
                                        .filter((lead) => lead.stage === stageIndex)
                                        .map((lead) => {
                                            const tone = SOURCE_TONE[lead.person.source] ?? "#0E9A8D";
                                            return (
                                                <motion.div
                                                    key={lead.id}
                                                    layoutId={`lead-${lead.id}`}
                                                    layout
                                                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                                    transition={{ type: "spring", stiffness: 320, damping: 30 }}
                                                    className="rounded-lg border border-[var(--sd-line)] bg-white p-1.5 shadow-sm"
                                                >
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 ring-1 ring-white">
                                                            <Image
                                                                src={demoImages.avatars[lead.person.avatar].src}
                                                                alt=""
                                                                fill
                                                                sizes="20px"
                                                                className="object-cover"
                                                            />
                                                        </span>
                                                        <span className="text-[9px] font-bold text-[var(--sd-text)] truncate">
                                                            {lead.person.name}
                                                        </span>
                                                    </div>

                                                    <span className="mt-1 flex items-center gap-1">
                                                        <span
                                                            className="w-1 h-1 rounded-full shrink-0"
                                                            style={{ backgroundColor: tone }}
                                                        />
                                                        <span
                                                            className="text-[8px] font-bold truncate"
                                                            style={{ color: tone }}
                                                        >
                                                            {lead.person.source}
                                                        </span>
                                                        {stageIndex < STAGES.length - 1 && (
                                                            <ArrowRight className="ml-auto w-2.5 h-2.5 text-slate-300 shrink-0" />
                                                        )}
                                                    </span>
                                                </motion.div>
                                            );
                                        })}
                                </AnimatePresence>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
