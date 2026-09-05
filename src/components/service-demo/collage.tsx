import React from "react";
import Image from "next/image";
import { Bell, CheckCheck, Mail, Play, Star, TrendingUp, Users } from "lucide-react";
import { demoImages } from "./images";

/**
 * Hero collage pieces.
 *
 * Each card is a self-contained "product moment" — a course tile, a live
 * session, an engagement readout, a session-recovery automation. They are
 * composed absolutely on desktop and stacked on mobile by the hero, so every
 * card here sizes to its container rather than setting its own position.
 */

const CARD = "rounded-2xl border border-white/70 bg-white shadow-xl shadow-slate-300/40 overflow-hidden";

/** Course tile with cover photo, progress and cohort meta. */
export function CourseCard() {
    return (
        <div className={CARD}>
            <div className="relative aspect-[16/10]">
                <Image
                    src={demoImages.heroCourse.src}
                    alt={demoImages.heroCourse.alt}
                    fill
                    sizes="(max-width: 1024px) 60vw, 260px"
                    className="object-cover"
                    priority
                />
                <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-lg bg-white/95 backdrop-blur-sm px-2 py-1 text-[11px] font-black text-[var(--sd-text)] shadow-sm">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                    4.8
                </span>
            </div>
            <div className="p-3.5 space-y-2.5">
                <p className="text-[13px] font-extrabold text-[var(--sd-text)] leading-snug">
                    Product Design Foundations
                </p>
                <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden" aria-hidden="true">
                    <div className="h-full w-[68%] rounded-full" style={{ background: "var(--sd-gradient)" }} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[var(--sd-muted)] font-semibold">
                    <span>14 cohorts</span>
                    <span>320 learners</span>
                </div>
            </div>
        </div>
    );
}

/** Live-session strip with a join affordance. */
export function LiveSessionCard() {
    return (
        <div className={`${CARD} p-3.5`}>
            <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--sd-muted)]">
                <span>6:00 — 7:00pm</span>
                <span className="inline-flex items-center gap-1 text-rose-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" aria-hidden="true" />
                    LIVE
                </span>
            </div>
            <p className="mt-1.5 text-[13px] font-extrabold text-[var(--sd-text)] leading-snug">
                Research to wireframe, end to end
            </p>
            <p className="text-[11px] text-[var(--sd-muted)]">Priya Nair · Cohort 12</p>
            <button
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-black text-[var(--sd-primary)]"
            >
                <Play className="w-3 h-3 fill-current" />
                JOIN NOW
            </button>
        </div>
    );
}

const SPARK = "M0,42 C18,40 26,26 42,25 C58,24 66,34 82,30 C98,26 106,12 124,8 C138,5 148,4 160,3";

/** Engagement readout with an SVG trend line. */
export function EngagementCard() {
    return (
        <div className={`${CARD} p-4`}>
            <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[var(--sd-text)]">Engagement</span>
                <span className="text-[10px] text-[var(--sd-muted)]">Last 30 days</span>
            </div>
            <p className="mt-1 text-2xl font-black text-[var(--sd-text)] leading-none tracking-tight">3,480</p>
            <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <TrendingUp className="w-3 h-3" aria-hidden="true" />
                +18% vs last month
            </p>

            <svg viewBox="0 0 160 48" className="mt-2 w-full h-12" fill="none" aria-hidden="true">
                <defs>
                    <linearGradient id="sd-spark" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#0E9A8D" />
                        <stop offset="100%" stopColor="#22D3EE" />
                    </linearGradient>
                    <linearGradient id="sd-spark-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0E9A8D" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#0E9A8D" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={`${SPARK} L160,48 L0,48 Z`} fill="url(#sd-spark-fill)" />
                <path d={SPARK} stroke="url(#sd-spark)" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="160" cy="3" r="3.5" fill="#0E9A8D" />
            </svg>
        </div>
    );
}

/**
 * Portrait tile standing in for a live classroom feed.
 *
 * Two layers on purpose: the card clips its own photo and caption to the corner
 * radius, while the badge hangs off the corner from an unclipped wrapper. Put
 * the badge inside the clipped card and it gets sliced in half.
 */
export function MentorCard() {
    return (
        <div className="relative">
            <div className={CARD}>
                <div className="relative aspect-[4/5]">
                    <Image
                        src={demoImages.heroMentor.src}
                        alt={demoImages.heroMentor.alt}
                        fill
                        sizes="(max-width: 1024px) 55vw, 220px"
                        className="object-cover"
                        priority
                    />

                    <span className="absolute bottom-2.5 left-2.5 right-2.5 rounded-lg bg-black/55 backdrop-blur-sm px-2.5 py-1.5">
                        <span className="block text-[11px] font-bold text-white leading-tight">Cohort 12 · live now</span>
                        <span className="block text-[10px] text-white/70">42 learners attending</span>
                    </span>
                </div>
            </div>

            <span className="absolute -top-3 -left-3 w-10 h-10 rounded-xl bg-white shadow-lg flex items-center justify-center">
                <Users className="w-4.5 h-4.5 text-[var(--sd-primary)]" aria-hidden="true" />
            </span>
        </div>
    );
}

/** Automation trace: a missed session triggering a recording email. */
export function AutomationCard() {
    return (
        <div className={`${CARD} p-3.5 space-y-2`}>
            <div className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-100 px-2.5 py-1.5">
                <Bell className="w-3.5 h-3.5 text-rose-500 shrink-0" aria-hidden="true" />
                <span className="text-[11px] font-bold text-rose-600">Session missed</span>
            </div>

            <div className="pl-4 border-l border-dashed border-slate-300 ml-2 pt-1 pb-0.5">
                <div className="flex items-center gap-2 rounded-lg bg-[var(--sd-surface)] border border-[var(--sd-line)] px-2.5 py-1.5">
                    <Mail className="w-3.5 h-3.5 text-[var(--sd-primary)] shrink-0" aria-hidden="true" />
                    <span className="text-[11px] font-bold text-[var(--sd-text)]">Recording sent</span>
                </div>
            </div>

            <p className="flex items-center gap-1.5 text-[10px] text-[var(--sd-muted)] font-semibold">
                <CheckCheck className="w-3 h-3 text-[var(--sd-primary)]" aria-hidden="true" />
                Automated · no one chased it
            </p>
        </div>
    );
}
