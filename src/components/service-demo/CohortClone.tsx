"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Copy, GraduationCap, Users } from "lucide-react";

/**
 * Programme template cloning into batches.
 *
 * The step claims a new cohort is "a two-minute setup instead of a week of
 * copying schedules" — a static list of modules with progress bars showed none
 * of that. Here the template on the left stamps out batches on the right, each
 * arriving fully formed, with the cohort count following.
 *
 * Runs only while on screen; holds a filled frame under reduced motion.
 */

const TEMPLATE_MODULES = ["Orientation", "Core concepts", "Live workshop", "Assessment"];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

const VISIBLE_BATCHES = 3;
const TICK_MS = 2600;

export default function CohortClone() {
    const frameRef = useRef<HTMLDivElement>(null);
    const inView = useInView(frameRef, { margin: "0px 0px -80px 0px" });
    const reduced = useReducedMotion();

    const [cursor, setCursor] = useState(0);

    useEffect(() => {
        if (!inView || reduced) return;
        const timer = setInterval(() => setCursor((c) => c + 1), TICK_MS);
        return () => clearInterval(timer);
    }, [inView, reduced]);

    // Newest batch first, so a clone always appears at the top of the stack.
    const batches = Array.from({ length: VISIBLE_BATCHES }, (_, offset) => {
        const index = cursor - offset;
        return {
            key: index,
            name: `Batch ${12 + index}`,
            month: MONTHS[(index + MONTHS.length) % MONTHS.length],
            learners: 24 + ((index * 7) % 18),
        };
    });

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
                <span className="ml-2 text-[11px] font-semibold text-[var(--sd-muted)]">programme template</span>
                <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--sd-primary)]">
                    <Copy className="w-3 h-3" aria-hidden="true" />
                    {14 + cursor} cohorts
                </span>
            </div>

            {/* A visualisation; the step copy beside it carries the meaning. */}
            <div className="p-3 grid grid-cols-2 gap-3" aria-hidden="true">
                {/* Template */}
                <div className="rounded-xl border border-[var(--sd-line)] bg-[var(--sd-surface)]/50 p-2.5">
                    <div className="flex items-center gap-1.5">
                        <span
                            className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                            style={{ background: "var(--sd-gradient)" }}
                        >
                            <GraduationCap className="w-3 h-3 text-white" />
                        </span>
                        <span className="text-[10px] font-black text-[var(--sd-text)] truncate">
                            Product Design
                        </span>
                    </div>

                    <div className="mt-2 space-y-1">
                        {TEMPLATE_MODULES.map((module, i) => (
                            <div
                                key={module}
                                className="flex items-center gap-1.5 rounded-md border border-[var(--sd-line)] bg-white px-1.5 py-1"
                            >
                                <span className="text-[8px] font-black text-[var(--sd-primary)]/50 tabular-nums">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <span className="text-[9px] font-semibold text-[var(--sd-text)] truncate">
                                    {module}
                                </span>
                            </div>
                        ))}
                    </div>

                    <p className="mt-2 text-[8px] font-bold uppercase tracking-wider text-[var(--sd-muted)]">
                        Master copy
                    </p>
                </div>

                {/* Clones */}
                <div className="relative rounded-xl border border-[var(--sd-primary)]/25 bg-[var(--sd-primary)]/[0.05] p-2.5">
                    <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--sd-muted)]">
                            Live batches
                        </span>
                        {!reduced && (
                            <span
                                className="w-1.5 h-1.5 rounded-full bg-[var(--sd-primary)] animate-pulse"
                                aria-hidden="true"
                            />
                        )}
                    </div>

                    <div className="mt-2 space-y-1.5">
                        <AnimatePresence mode="popLayout" initial={false}>
                            {batches.map((batch, depth) => (
                                <motion.div
                                    key={batch.key}
                                    layout
                                    initial={{ opacity: 0, x: -18, scale: 0.94 }}
                                    animate={{ opacity: 1 - depth * 0.25, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                                    className="rounded-lg border border-[var(--sd-line)] bg-white px-2 py-1.5 shadow-sm"
                                >
                                    <div className="flex items-center justify-between gap-1">
                                        <span className="text-[9px] font-black text-[var(--sd-text)] truncate">
                                            {batch.name}
                                        </span>
                                        <span className="text-[8px] font-bold text-[var(--sd-primary)] shrink-0">
                                            {batch.month}
                                        </span>
                                    </div>
                                    <span className="mt-0.5 flex items-center gap-1 text-[8px] font-semibold text-[var(--sd-muted)]">
                                        <Users className="w-2 h-2" />
                                        {batch.learners} learners
                                    </span>
                                    <span className="mt-1 block h-0.5 rounded-full" style={{ background: "var(--sd-gradient)" }} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
