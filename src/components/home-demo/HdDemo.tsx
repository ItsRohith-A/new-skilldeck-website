"use client";

import { ArrowRight, BarChart3, Check, LayoutDashboard, Play, Server, Sparkles, Workflow } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import HdGradientText from "./HdGradientText";

const features = [
    {
        icon: LayoutDashboard,
        title: "Unified Dashboard",
        description: "Manage your entire training business from a single, intuitive interface.",
        accent: "from-violet-500 to-purple-600",
    },
    {
        icon: BarChart3,
        title: "Real-Time Analytics",
        description: "Track student progress, course engagement, and revenue with live dashboards.",
        accent: "from-rose-500 to-pink-600",
    },
    {
        icon: Workflow,
        title: "Automated Workflows",
        description: "From lead capture to certification, automate every step of the learner journey.",
        accent: "from-orange-500 to-amber-500",
    },
];

const VIDEO_ID = "A-y-PXFigPI";

export default function HdDemo() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <section id="demo" className="relative overflow-hidden scroll-mt-24 section-y bg-gradient-to-b from-white via-violet-50/40 to-white">
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-brand-primary/[0.06] blur-[110px]" />
                <div className="absolute bottom-0 -right-32 w-96 h-96 rounded-full bg-brand-secondary/[0.06] blur-[110px]" />
            </div>

            <div className="container mx-auto px-4 lg:px-0 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <span className="inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-white px-4 py-1.5 text-xs md:text-sm font-semibold text-brand-primary shadow-sm mb-5">
                        <Sparkles className="w-4 h-4" aria-hidden="true" />
                        See It In Action
                    </span>
                    <h2 className="heading-section mb-3">
                        Experience the <HdGradientText>Power of Skilldeck</HdGradientText>
                    </h2>
                    <p className="body-medium">
                        Watch our platform in action and explore how it transforms training businesses worldwide.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                    {/* Left — the real product walkthrough, framed in browser chrome */}
                    <div className="lg:col-span-7">
                        <div className="relative">
                            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.10)]">
                                {/* Window chrome */}
                                <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-50 border-b border-slate-200">
                                    <span className="w-3 h-3 rounded-full bg-red-400" />
                                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                                </div>

                                <div className="relative aspect-video bg-slate-900">
                                    {!isPlaying ? (
                                        <button
                                            type="button"
                                            onClick={() => setIsPlaying(true)}
                                            aria-label="Play the Skilldeck platform demo"
                                            className="absolute inset-0 w-full h-full group cursor-pointer"
                                        >
                                            <Image
                                                src={`https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
                                                alt="Skilldeck platform demo"
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                sizes="(max-width: 1024px) 100vw, 60vw"
                                                loading="lazy"
                                            />
                                            <span className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/15 transition-colors flex items-center justify-center">
                                                <span className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-2xl shadow-brand-primary/40 transition-transform duration-300 group-hover:scale-110 bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)]">
                                                    <Play className="w-7 h-7 md:w-9 md:h-9 text-white fill-current ml-1" aria-hidden="true" />
                                                </span>
                                            </span>
                                        </button>
                                    ) : (
                                        <iframe
                                            className="w-full h-full"
                                            src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
                                            title="Skilldeck Platform Demo"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Live Demo pill */}
                            <div className="hidden md:flex absolute -bottom-4 right-6 items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-lg">
                                <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" aria-hidden="true" />
                                <span className="text-sm font-semibold text-brand-dark">Live Demo</span>
                            </div>
                        </div>
                    </div>

                    {/* Right — what you're looking at */}
                    <div className="lg:col-span-5">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                                <Server className="w-6 h-6 text-brand-primary" aria-hidden="true" />
                            </span>
                            <h3 className="text-xl md:text-2xl font-extrabold text-brand-dark leading-tight">
                                Smart Infrastructure
                                <br />
                                for <HdGradientText>Modern Trainers</HdGradientText>
                            </h3>
                        </div>

                        <div className="space-y-4 mb-6">
                            {features.map((feature) => (
                                <div
                                    key={feature.title}
                                    className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)] hover:border-slate-300 transition-all duration-300"
                                >
                                    <span
                                        className={`w-11 h-11 md:w-12 md:h-12 rounded-full shrink-0 flex items-center justify-center bg-gradient-to-br ${feature.accent} shadow-md`}
                                    >
                                        <feature.icon className="w-5 h-5 text-white" aria-hidden="true" />
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm md:text-base font-bold text-brand-dark mb-1">
                                            {feature.title}
                                        </h4>
                                        <p className="text-xs md:text-sm text-brand-muted leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                    {/* Decorative tick — dropped on the narrowest screens so the
                                        description keeps its width instead of wrapping to shreds. */}
                                    <span
                                        className="hidden sm:flex w-7 h-7 rounded-lg bg-brand-primary/10 items-center justify-center shrink-0"
                                        aria-hidden="true"
                                    >
                                        <Check className="w-4 h-4 text-brand-primary" strokeWidth={3} />
                                    </span>
                                </div>
                            ))}
                        </div>

                        <Link
                            href="#pricing"
                            className="w-full rounded-xl px-6 py-4 font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/35 hover:-translate-y-0.5 transition-all duration-300 group bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)]"
                        >
                            Explore Plans
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
