"use client";

import { ArrowRight, Sparkles, Star } from "lucide-react";
import { useLeadModal } from "@/components/Forms/LeadModalContext";
import { DemoButton } from "./primitives";
import { AutomationCard, CourseCard, EngagementCard, LiveSessionCard, MentorCard } from "./collage";
import { shell } from "./theme";
import { ParallaxLayer } from "./motion";

/**
 * Hero — centred message over a floating card collage.
 *
 * The headline carries the fold on its own, and the product is shown as moments
 * (a course, a live class, an engagement readout, an automation firing) rather
 * than one dashboard screenshot: it says what the platform *does* without asking
 * the reader to decode a UI at 40% scale.
 *
 * Desktop lays the cards out as a staggered four-track grid under the copy;
 * below `lg` each track would be a sliver, so the collage becomes a swipeable
 * rail of the three cards that survive at small sizes.
 */
export default function DemoHero() {
    const { openModal } = useLeadModal();

    const bookDemo = () =>
        openModal({
            source: "service-demo-hero",
            formTitle: "Book a SkillDeck walkthrough",
            defaultValues: { subject: "Demo request — training platform" },
        });

    return (
        <section className="relative overflow-hidden bg-white pt-28 md:pt-32 pb-16 md:pb-20">
            {/* Aurora ground — light, so the collage reads as floating over it */}
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(180deg, #F2FBFA 0%, #EFF9FF 45%, #FFFFFF 100%)",
                }}
            />
            <div
                aria-hidden="true"
                className="absolute -top-32 left-[-10%] w-[38rem] h-[38rem] rounded-full blur-3xl opacity-40 pointer-events-none"
                style={{ background: "radial-gradient(circle, #A7F3EB 0%, transparent 65%)" }}
            />
            <div
                aria-hidden="true"
                className="absolute -top-24 right-[-10%] w-[40rem] h-[40rem] rounded-full blur-3xl opacity-40 pointer-events-none"
                style={{ background: "radial-gradient(circle, #BFE7FF 0%, transparent 65%)" }}
            />

            <div className={`${shell} relative`}>
                {/* ── Message ── */}
                <div className="max-w-4xl mx-auto text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--sd-primary)]/25 bg-white/80 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-[var(--sd-primary)] shadow-sm">
                        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                        Intelligent platform for training businesses
                    </span>

                    <h1 className="mt-6 text-[2rem] sm:text-4xl md:text-5xl xl:text-[3.5rem] font-extrabold text-[var(--sd-text)] leading-[1.12] tracking-tight text-balance">
                        Turn training operations into{" "}
                        <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--sd-gradient)" }}>
                            growth.
                        </span>
                        <br className="hidden sm:block" /> Engage learners. Prove outcomes.
                    </h1>

                    <p className="mt-5 mx-auto max-w-xl text-base md:text-lg text-[var(--sd-muted)] leading-relaxed">
                        Deliver programmes, track every learner and run the revenue side of your academy — all
                        from one connected workspace.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <DemoButton onClick={bookDemo}>
                            Book a demo
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </DemoButton>
                        <DemoButton href="#platform" variant="ghost">
                            Explore the platform
                        </DemoButton>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-2.5">
                        <span className="flex" aria-hidden="true">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400 -ml-0.5 first:ml-0" />
                            ))}
                        </span>
                        <p className="text-xs text-[var(--sd-muted)]">
                            <span className="font-bold text-[var(--sd-text)]">4.8/5</span> from 500+ training teams
                        </p>
                    </div>
                </div>

                {/* ── Collage ──
                    Absolute placement left a hole in the middle and let the automation
                    card sit on top of the mentor tile. A staggered four-track grid keeps
                    the row full and makes overlap impossible at any width.

                    Motion is split across two elements on purpose: the outer wrapper
                    owns the drift animation, the inner one owns the resting tilt and the
                    hover straighten. One element cannot hold both, since they would be
                    competing writes to the same `transform`. Negative delays start each
                    card mid-cycle so the group never pulses in unison, and the whole
                    thing stops for `prefers-reduced-motion`. */}
                <ParallaxLayer className="hidden lg:grid grid-cols-4 gap-5 items-start mt-14 max-w-5xl mx-auto">
                    <div className="animate-[float-gentle_7s_ease-in-out_-0.5s_infinite] motion-reduce:animate-none">
                        <div className="rotate-[-2deg] hover:rotate-0 hover:-translate-y-1 transition-transform duration-500">
                            <CourseCard />
                        </div>
                    </div>

                    <div className="space-y-4 translate-y-10">
                        <div className="animate-[float-gentle_8.5s_ease-in-out_-2s_infinite] motion-reduce:animate-none">
                            <div className="rotate-[1.5deg] hover:rotate-0 hover:-translate-y-1 transition-transform duration-500">
                                <LiveSessionCard />
                            </div>
                        </div>
                        <div className="animate-[float-gentle_7.5s_ease-in-out_-3.5s_infinite] motion-reduce:animate-none">
                            <div className="rotate-[-1deg] hover:rotate-0 hover:-translate-y-1 transition-transform duration-500">
                                <AutomationCard />
                            </div>
                        </div>
                    </div>

                    <div className="translate-y-4">
                        <div className="animate-[float-gentle_9s_ease-in-out_-1.2s_infinite] motion-reduce:animate-none">
                            <div className="hover:-translate-y-1 transition-transform duration-500">
                                <EngagementCard />
                            </div>
                        </div>
                    </div>

                    <div className="animate-[float-gentle_8s_ease-in-out_-2.8s_infinite] motion-reduce:animate-none">
                        <div className="rotate-[2deg] hover:rotate-0 hover:-translate-y-1 transition-transform duration-500">
                            <MentorCard />
                        </div>
                    </div>
                </ParallaxLayer>

                {/* Below lg the four tracks would each be a sliver, so the collage
                    becomes a swipeable rail of the cards that survive at small width. */}
                <div className="lg:hidden mt-12 -mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto custom-scrollbar">
                    <div className="flex gap-4 w-max pb-2">
                        <div className="w-[15rem] shrink-0">
                            <CourseCard />
                        </div>
                        <div className="w-[16rem] shrink-0">
                            <EngagementCard />
                        </div>
                        <div className="w-[15rem] shrink-0">
                            <AutomationCard />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
