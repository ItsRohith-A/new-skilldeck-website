"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowDown, Bot, Gauge, Sparkles, TriangleAlert, Wand2 } from "lucide-react";

/**
 * Live intelligence stream.
 *
 * The concentric-ring diagram it replaces was a static picture of an idea: four
 * labels parked around a robot icon, saying only "AI happens here". This shows
 * the actual loop — raw signals arrive, the engine consumes them, and a specific
 * insight drops out with the reasoning attached.
 *
 * Runs only while on screen, and holds one filled frame under reduced motion.
 */

const SIGNALS = [
    "Attendance logged",
    "Assignment submitted",
    "Payment received",
    "Session joined",
    "Quiz scored 82%",
    "Support thread opened",
    "Recording watched",
];

const INSIGHTS = [
    {
        icon: TriangleAlert,
        tag: "Risk detected",
        accent: "#FBBF24",
        title: "3 learners at risk in Cohort 12",
        detail: "Attendance down 40% across two weeks, no submissions since the 4th.",
        action: "Mentor nudged",
        meter: 72,
    },
    {
        icon: Gauge,
        tag: "Forecast updated",
        accent: "#2DD4BF",
        title: "Quarter lands at $412K",
        detail: "Pipeline stage, historical conversion and seasonality — ±4% variance.",
        action: "Board view refreshed",
        meter: 88,
    },
    {
        icon: Wand2,
        tag: "Draft ready",
        accent: "#22D3EE",
        title: "Advanced Analytics · 6 modules",
        detail: "Outline expanded into sessions, assessments and a certificate track.",
        action: "Sent to faculty",
        meter: 64,
    },
];

const SIGNAL_MS = 1600;
const INSIGHT_MS = 4200;
const VISIBLE_SIGNALS = 3;

export default function IntelligenceStream() {
    const frameRef = useRef<HTMLDivElement>(null);
    const inView = useInView(frameRef, { margin: "0px 0px -80px 0px" });
    const reduced = useReducedMotion();

    const [signalCursor, setSignalCursor] = useState(0);
    const [insightIndex, setInsightIndex] = useState(0);

    useEffect(() => {
        if (!inView || reduced) return;
        const timer = setInterval(() => setSignalCursor((c) => c + 1), SIGNAL_MS);
        return () => clearInterval(timer);
    }, [inView, reduced]);

    useEffect(() => {
        if (!inView || reduced) return;
        const timer = setInterval(() => setInsightIndex((i) => (i + 1) % INSIGHTS.length), INSIGHT_MS);
        return () => clearInterval(timer);
    }, [inView, reduced]);

    // A rolling window over the signal list, newest first.
    const visibleSignals = Array.from({ length: VISIBLE_SIGNALS }, (_, offset) => {
        const index = (signalCursor + VISIBLE_SIGNALS - offset) % SIGNALS.length;
        return { key: signalCursor - offset, label: SIGNALS[index] };
    });

    const insight = INSIGHTS[insightIndex];

    return (
        <div
            ref={frameRef}
            className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5 md:p-6 overflow-hidden"
        >
            <div
                aria-hidden="true"
                className="absolute -top-24 -right-16 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ background: "radial-gradient(circle, #0E9A8D 0%, transparent 65%)" }}
            />

            <div className="relative flex items-center justify-between gap-3">
                <p className="text-xs font-extrabold text-white">Intelligence engine</p>
                {!reduced && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--sd-accent)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--sd-accent)] animate-pulse" aria-hidden="true" />
                        Processing
                    </span>
                )}
            </div>

            {/* The loop is a visualisation; the section copy carries the meaning. */}
            <div className="relative mt-5 space-y-3" aria-hidden="true">
                {/* Signals in */}
                <div className="space-y-1.5 min-h-[5.25rem]">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {visibleSignals.map((signal, depth) => (
                            <motion.div
                                key={signal.key}
                                layout
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1 - depth * 0.28, y: 0 }}
                                exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5"
                            >
                                <Sparkles className="w-3 h-3 text-[var(--sd-accent)] shrink-0" />
                                <span className="text-[11px] font-semibold text-white/70 truncate">{signal.label}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Engine */}
                <div className="relative flex items-center justify-center py-1">
                    <span className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                    <div className="relative">
                        {!reduced &&
                            [0, 1].map((ring) => (
                                <motion.span
                                    key={ring}
                                    className="absolute inset-0 rounded-2xl border border-[var(--sd-accent)]/40"
                                    initial={{ opacity: 0.5, scale: 1 }}
                                    animate={{ opacity: 0, scale: 1.9 }}
                                    transition={{
                                        duration: 2.4,
                                        repeat: Infinity,
                                        delay: ring * 1.2,
                                        ease: "easeOut",
                                    }}
                                />
                            ))}
                        <span
                            className="relative flex w-12 h-12 rounded-2xl items-center justify-center shadow-lg shadow-black/40"
                            style={{ background: "var(--sd-gradient)" }}
                        >
                            <Bot className="w-6 h-6 text-white" />
                        </span>
                    </div>
                </div>

                <div className="flex justify-center">
                    <motion.span
                        animate={reduced ? undefined : { y: [0, 4, 0] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <ArrowDown className="w-4 h-4 text-white/25" />
                    </motion.span>
                </div>

                {/* Insight out */}
                <div className="relative min-h-[9.5rem]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={insight.title}
                            initial={{ opacity: 0, y: 14, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.98 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="rounded-2xl border border-white/10 bg-[#0A2E42]/80 p-4"
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${insight.accent}26` }}
                                >
                                    <insight.icon className="w-3.5 h-3.5" style={{ color: insight.accent }} />
                                </span>
                                <span
                                    className="text-[10px] font-bold uppercase tracking-[0.14em]"
                                    style={{ color: insight.accent }}
                                >
                                    {insight.tag}
                                </span>
                            </div>

                            <p className="mt-2.5 text-sm font-extrabold text-white leading-snug">{insight.title}</p>
                            <p className="mt-1 text-[11px] text-white/50 leading-relaxed">{insight.detail}</p>

                            <div className="mt-3 h-1 rounded-full bg-white/10 overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: insight.accent }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${insight.meter}%` }}
                                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                                />
                            </div>

                            <p className="mt-2.5 text-[10px] font-bold text-white/45">{insight.action}</p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
