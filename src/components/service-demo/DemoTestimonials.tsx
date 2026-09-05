import React from "react";
import Image from "next/image";
import { Quote } from "lucide-react";
import { DemoSectionHeading } from "./primitives";
import { demoImages } from "./images";
import { Reveal } from "./motion";
import { demoAccentAt, sectionPad, shell } from "./theme";

/**
 * Placeholder testimonials.
 *
 * Attributed to a role and a shape of business, never to one of the real partner
 * marks in the trust band — the words are written copy, and pinning them to a
 * named company would be putting a claim in someone's mouth. Swap for approved
 * quotes before this ships.
 */
const TESTIMONIALS = [
    {
        quote:
            "Four systems became one. The Friday reconciliation meeting used to eat an afternoon; it is ten minutes now and nobody opens a spreadsheet.",
        name: "Operations Director",
        org: "Coaching institute · 6 branches",
        avatar: 0,
        metric: "12 hrs",
        metricLabel: "saved per week",
    },
    {
        quote:
            "We could finally see which channel actually produced paid seats, not just enquiries. We cut two ad campaigns in the first month.",
        name: "Head of Admissions",
        org: "Skills academy · 2,400 learners",
        avatar: 5,
        metric: "31%",
        metricLabel: "lower cost per enrolment",
    },
    {
        quote:
            "Migration was the part I dreaded. They moved eight years of batches and fee records, and we ran the next cohort on schedule.",
        name: "Founder",
        org: "Independent educator",
        avatar: 6,
        metric: "9 days",
        metricLabel: "to go live",
    },
];

/**
 * Social proof — three voices between the audience tabs and the technology
 * chapter, so the page earns the AI claims that follow with human evidence
 * first. The first card is featured, so the row is not three identical blocks.
 */
export default function DemoTestimonials() {
    return (
        <section className={`bg-white ${sectionPad}`}>
            <div className={shell}>
                <Reveal>
                    <DemoSectionHeading
                        eyebrow="In their words"
                        title="Teams stopped running the tools and went back to teaching"
                        description="What changes in the first quarter, according to the people who run the operation."
                        align="center"
                    />
                </Reveal>

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
                    {TESTIMONIALS.map((testimonial, i) => {
                        const featured = i === 0;
                        const accent = demoAccentAt(i);

                        return (
                            <Reveal key={testimonial.name + testimonial.org} delay={i * 0.08} className="flex">
                                <figure
                                    // `overflow-hidden` is load-bearing: the featured card's
                                    // top rule is a square bar, and without clipping it paints
                                    // past the rounded corners.
                                    className={`group relative w-full flex flex-col overflow-hidden rounded-2xl border p-6 md:p-7 transition-all duration-300 hover:-translate-y-1 ${featured
                                        ? "border-transparent text-white shadow-xl shadow-slate-300/50"
                                        : "border-[var(--sd-line)] bg-white hover:shadow-lg hover:shadow-slate-200/70 hover:border-[var(--sd-primary)]/30"
                                        }`}
                                    style={featured ? { background: "var(--sd-gradient-deep)" } : undefined}
                                >
                                    {featured && (
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-x-0 top-0 h-1"
                                            style={{ background: "var(--sd-gradient)" }}
                                        />
                                    )}

                                    <Quote
                                        className={`w-7 h-7 shrink-0 ${featured ? "text-white/25" : "text-[var(--sd-primary)]/25"}`}
                                        aria-hidden="true"
                                    />

                                    <blockquote
                                        className={`mt-4 text-sm md:text-base leading-relaxed ${featured ? "text-white/85" : "text-[var(--sd-text)]"
                                            }`}
                                    >
                                        {testimonial.quote}
                                    </blockquote>

                                    {/* The number the quote is really about */}
                                    <div
                                        className={`mt-6 pt-5 border-t ${featured ? "border-white/15" : "border-[var(--sd-line)]"}`}
                                    >
                                        <p
                                            className={`text-2xl font-black leading-none tracking-tight ${featured ? "text-white" : ""}`}
                                            style={featured ? undefined : { color: accent.hex }}
                                        >
                                            {testimonial.metric}
                                        </p>
                                        <p
                                            className={`mt-1 text-[11px] font-semibold ${featured ? "text-white/50" : "text-[var(--sd-muted)]"
                                                }`}
                                        >
                                            {testimonial.metricLabel}
                                        </p>
                                    </div>

                                    <figcaption className="mt-5 flex items-center gap-3">
                                        <span
                                            className={`relative w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ${featured ? "ring-white/20" : "ring-white"
                                                } shadow-sm`}
                                        >
                                            <Image
                                                src={demoImages.avatars[testimonial.avatar].src}
                                                alt=""
                                                fill
                                                sizes="40px"
                                                className="object-cover"
                                            />
                                        </span>
                                        <span className="min-w-0">
                                            <span
                                                className={`block text-sm font-bold truncate ${featured ? "text-white" : "text-[var(--sd-text)]"
                                                    }`}
                                            >
                                                {testimonial.name}
                                            </span>
                                            <span
                                                className={`block text-xs truncate ${featured ? "text-white/50" : "text-[var(--sd-muted)]"
                                                    }`}
                                            >
                                                {testimonial.org}
                                            </span>
                                        </span>
                                    </figcaption>
                                </figure>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
