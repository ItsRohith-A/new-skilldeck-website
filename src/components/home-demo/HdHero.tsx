"use client";

import Link from "next/link";
import { ArrowRight, Building2, Gauge, Users2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import HdGradientText from "./HdGradientText";
import HdToolsConverge from "./HdToolsConverge";

const trustStats = [
    { icon: Users2, value: "500+", label: "Institutes trust us" },
    { icon: Building2, value: "30+", label: "Enterprise clients" },
    { icon: Gauge, value: "90%", label: "Lower operating cost" },
];

export default function HdHero() {
    return (
        <section className="relative overflow-hidden bg-white pt-20 lg:pt-24 pb-12 md:pb-16 2xl:pb-20">
            {/* Soft brand wash — light, not a dark slab */}
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -left-32 w-[30rem] h-[30rem] rounded-full bg-brand-primary/[0.07] blur-[110px]" />
                <div className="absolute top-10 -right-32 w-[26rem] h-[26rem] rounded-full bg-brand-secondary/[0.07] blur-[110px]" />
            </div>

            <div className="container mx-auto px-4 lg:px-0 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-6 lg:gap-10 items-center">
                    {/* Left — narrative */}
                    <div className="md:col-span-6 lg:col-span-6 flex flex-col items-center lg:items-start">
                        <span className="badge-brand mb-4">The Operating System for Training Institutes</span>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-extrabold tracking-tight leading-[1.08] text-brand-dark mb-3">
                            <span>One Platform.</span>
                            <HdGradientText>Zero Chaos.</HdGradientText>
                        </h1>

                        <p className="text-base 2xl:text-lg text-center md:text-start text-brand-muted max-w-xl leading-relaxed mb-4">
                            90% of training institutes overspend on the wrong technology, bloated marketing teams,
                            and fragmented tools.
                        </p>

                        <p className="text-base 2xl:text-lg text-center md:text-start text-brand-muted max-w-xl leading-relaxed mb-4 lg:mb-8">
                            <span className="text-brand-dark font-semibold">Skilldeck replaces 10+ tools</span> with
                            one powerful platform — and runs your business at up to{" "}
                            <span className="text-brand-dark font-semibold">90% lower cost</span>.
                        </p>

                        {/* Side by side row across all screens */}
                        <div className="flex flex-row flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 mb-5">
                            <Button
                                as={Link}
                                href="/register"
                                variant="primary"
                                size="md"
                                className="rounded-xl font-bold text-xs sm:text-sm px-3.5 sm:px-5 h-11 flex items-center justify-center"
                            >
                                Experience the Platform Free
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                            <Button
                                as="a"
                                href="#features"
                                variant="outline-primary"
                                size="md"
                                className="rounded-xl text-xs sm:text-sm px-3.5 sm:px-5 h-11 flex items-center justify-center"
                            >
                                Explore Features
                            </Button>
                        </div>

                        {/* Trust stats */}
                        <div className="w-full grid grid-cols-3 gap-2 sm:gap-3 xl:flex xl:flex-wrap xl:items-center xl:gap-x-10 xl:gap-y-4 pt-5 lg:pt-7 border-t border-slate-200">
                            {trustStats.map((stat) => (
                                <div key={stat.label} className="flex flex-col items-center text-center gap-1 sm:flex-row sm:items-center sm:text-left sm:gap-2.5">
                                    <stat.icon className="w-4 h-4 text-brand-primary shrink-0" aria-hidden="true" />
                                    <div className="leading-tight">
                                        <div className="text-base font-extrabold text-brand-dark">{stat.value}</div>
                                        <div className="text-[11px] text-brand-muted font-medium">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — animated "10+ tools become one" visual, cycling through the
                        full platform feature set rather than a fixed handful. */}
                    <div className="md:col-span-6 lg:col-span-6">
                        <div className="relative mx-auto max-w-lg">
                            <HdToolsConverge />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
