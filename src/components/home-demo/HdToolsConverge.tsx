"use client";

import {
    BarChart3,
    Bot,
    Briefcase,
    CalendarClock,
    CreditCard,
    Globe,
    GraduationCap,
    Megaphone,
    MessageSquare,
    Search,
    Share2,
    ShoppingCart,
    Upload,
    Users,
    Video,
    type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, startTransition } from "react";
import skilldeckLogo from "../../../public/logos/mainlogo.svg";

/**
 * The full platform surface — mirrors the feature set in AllFeaturesMarquee.
 *
 * Each tool carries its own colour on purpose: these represent the scattered
 * third-party vendors an institute juggles today, so the clash of brand colours
 * *is* the point. It resolves into the single brand-gradient card below.
 *
 * Class strings are written out in full (never template-built) so Tailwind's
 * scanner can see them.
 */
const FEATURES: { icon: LucideIcon; label: string; tint: string }[] = [
    { icon: Globe, label: "Website & CMS", tint: "bg-blue-50 text-blue-600" },
    { icon: GraduationCap, label: "LMS Engine", tint: "bg-violet-50 text-violet-600" },
    { icon: Users, label: "Integrated CRM", tint: "bg-indigo-50 text-indigo-600" },
    { icon: Bot, label: "AI + Automation", tint: "bg-fuchsia-50 text-fuchsia-600" },
    { icon: MessageSquare, label: "Webchat Widget", tint: "bg-cyan-50 text-cyan-600" },
    { icon: Video, label: "Events & Webinars", tint: "bg-rose-50 text-rose-600" },
    { icon: CalendarClock, label: "Class & Batches", tint: "bg-amber-50 text-amber-600" },
    { icon: Briefcase, label: "Trainer Portal", tint: "bg-teal-50 text-teal-600" },
    { icon: ShoppingCart, label: "E-commerce", tint: "bg-emerald-50 text-emerald-600" },
    { icon: Megaphone, label: "Marketing", tint: "bg-orange-50 text-orange-600" },
    { icon: Share2, label: "Social Publisher", tint: "bg-pink-50 text-pink-600" },
    { icon: Briefcase, label: "Placement Portal", tint: "bg-sky-50 text-sky-600" },
    { icon: Search, label: "SEO Automation", tint: "bg-purple-50 text-purple-600" },
    { icon: Upload, label: "Bulk Import", tint: "bg-lime-50 text-lime-700" },
    { icon: BarChart3, label: "Unified Analytics", tint: "bg-red-50 text-red-600" },
];

const SLOTS = 8;
const SWAP_MS = 2200;

export default function HdToolsConverge() {
    // Which feature each slot currently shows. Starts as the first 8, then slots
    // rotate one at a time so every feature gets surfaced without ever showing
    // the same one twice on screen.
    const [slots, setSlots] = useState<number[]>(() => Array.from({ length: SLOTS }, (_, i) => i));
    const containerRef = useRef<HTMLDivElement>(null);
    const tick = useRef(0);
    const cursor = useRef(SLOTS);
    const isVisibleRef = useRef(true);

    useEffect(() => {
        // Respect the OS-level motion preference — no timer at all if reduced.
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (mq.matches) return;

        // Pause animation when element is off-screen to keep the main thread idle (lowers INP)
        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisibleRef.current = entry.isIntersecting;
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        const id = setInterval(() => {
            // Don't execute work if tab is inactive or element is scrolled out of view
            if (document.hidden || !isVisibleRef.current) return;

            // Use startTransition so this non-critical cosmetic update never blocks user interactions
            startTransition(() => {
                setSlots((prev) => {
                    const next = [...prev];
                    const slot = tick.current % SLOTS;

                    let candidate = cursor.current % FEATURES.length;
                    let guard = 0;
                    while (next.includes(candidate) && guard < FEATURES.length) {
                        candidate = (candidate + 1) % FEATURES.length;
                        guard += 1;
                    }

                    next[slot] = candidate;
                    cursor.current = candidate + 1;
                    tick.current += 1;
                    return next;
                });
            });
        }, SWAP_MS);

        return () => {
            clearInterval(id);
            observer.disconnect();
        };
    }, []);

    return (
        <div ref={containerRef} className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-violet-50/70 via-white to-orange-50/60 p-4 lg:p-8">
            {/* Colour bleed behind the scattered tools */}
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
                <span className="absolute -top-16 -left-12 w-56 h-56 rounded-full bg-brand-primary/10 blur-[70px]" />
                <span className="absolute top-1/3 -right-16 w-52 h-52 rounded-full bg-fuchsia-400/10 blur-[70px]" />
            </div>

            <p className="relative text-[11px] font-bold uppercase tracking-[0.18em] text-brand-muted mb-5 text-center">
                The <span className="text-brand-primary">10+ tools</span> you juggle today
            </p>

            {/* Rotating tool tiles */}
            <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-2.5 lg:mb-7">
                {slots.map((featureIndex, slot) => {
                    const feature = FEATURES[featureIndex];
                    const Icon = feature.icon;
                    return (
                        <div
                            key={slot}
                            // Fixed height: labels vary from "LMS Engine" to "Social
                            // Publisher", and without it every swap would reflow the grid.
                            className="relative rounded-xl bg-white border border-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.04)] px-2 py-2.5 h-[82px] flex items-center justify-center overflow-hidden"
                        >
                            {/* keyed on the feature so React remounts and replays the fade */}
                            <div
                                key={featureIndex}
                                className="hd-swap-in flex flex-col items-center gap-1.5 text-center w-full"
                            >
                                <span
                                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${feature.tint}`}
                                >
                                    <Icon className="w-4 h-4" aria-hidden="true" />
                                </span>
                                <span className="text-[10px] font-semibold text-slate-600 leading-tight line-clamp-2 px-0.5">
                                    {feature.label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Convergence beam */}
            <div className="relative flex flex-col items-center gap-1 mb-2 lg:mb-6">
                <span className="relative h-7 w-px bg-slate-200 overflow-hidden" aria-hidden="true">
                    <span className="hd-beam absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary to-transparent" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">
                    become one
                </span>
                <span className="relative h-7 w-px bg-slate-200 overflow-hidden" aria-hidden="true">
                    <span
                        className="hd-beam absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary to-transparent"
                        style={{ animationDelay: "0.3s" }}
                    />
                </span>
            </div>

            {/* The one platform */}
            <div className="relative">
                <span
                    aria-hidden="true"
                    className="hd-halo absolute -inset-2 rounded-3xl bg-brand-primary/20 blur-xl"
                />
                <div className="relative rounded-2xl bg-white border-2 border-brand-primary/20 shadow-lg shadow-brand-primary/10 p-3 lg:p-5 flex items-center gap-4">
                    <Image
                        src={skilldeckLogo}
                        alt="Skilldeck"
                        width={120}
                        height={28}
                        priority
                        className="h-7 w-auto shrink-0"
                        style={{ width: "auto", height: "1.75rem" }}
                    />
                    <div className="border-l border-slate-200 pl-4">
                        <div className="text-sm font-extrabold text-brand-dark leading-tight">
                            One dashboard. One cost.
                        </div>
                        <div className="text-xs text-brand-muted">Everything above, unified.</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
