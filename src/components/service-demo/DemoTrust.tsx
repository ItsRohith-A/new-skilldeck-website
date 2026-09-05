import React from "react";
import Image from "next/image";
import { BadgeCheck, Quote } from "lucide-react";
import { demoImages } from "./images";
import { CountUp, Reveal } from "./motion";
import { shell } from "./theme";

const STATS = [
    { value: "12M+", label: "Learning hours delivered", note: "across live and self-paced cohorts" },
    { value: "540", label: "Academies running daily", note: "in 19 countries" },
    { value: "99.95%", label: "Rolling 12-month uptime", note: "measured at the edge" },
    { value: "31%", label: "Average lift in renewals", note: "first two quarters after launch" },
];

/** The quote's claim, in numbers. */
const QUOTE_OUTCOMES = [
    { value: "6 → 1", label: "systems the team logs into" },
    { value: "4 hrs", label: "saved per administrator, weekly" },
];

/**
 * Real partner marks from the shared logo sprite (`app/sprites.css`).
 *
 * Sprite tiles carry their own intrinsic size (132x36 through 192x50), so a row
 * of them at native size reads as logos of random importance. Each entry keeps
 * its source dimensions and is scaled to one common cap height below, which is
 * how a logo wall is normally set.
 */
const PARTNERS = [
    { spriteClass: "bg-kh", name: "KnowledgeHut", w: 138, h: 48 },
    { spriteClass: "bg-il", name: "Invensis Learning", w: 138, h: 48 },
    { spriteClass: "bg-sta", name: "StarAgile", w: 138, h: 48 },
    { spriteClass: "bg-sax", name: "Simpliaxis", w: 132, h: 36 },
    { spriteClass: "bg-pal", name: "PremierAgile", w: 138, h: 48 },
    { spriteClass: "bg-lnt", name: "LearnNthrive", w: 138, h: 48 },
    { spriteClass: "bg-agilespark", name: "AgileSpark", w: 170, h: 50 },
    { spriteClass: "bg-vlsiguru", name: "VLSI Guru", w: 192, h: 50 },
];

/** Cap height every mark is normalised to. */
const LOGO_HEIGHT = 34;

/**
 * Trust band — numbers, an illustrative quote, then the partner marks.
 * Typographic on purpose: it sits directly under the hero collage, so anything
 * card-shaped here would compete with the imagery above it.
 */
export default function DemoTrust() {
    return (
        <section className="bg-white border-b border-[var(--sd-line)]">
            <div className={`${shell} py-14 md:py-16`}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                    {STATS.map((stat, i) => (
                        <Reveal key={stat.label} delay={i * 0.08} className="space-y-2">
                            <span
                                aria-hidden="true"
                                className="block w-8 h-[3px] rounded-full"
                                style={{ background: "var(--sd-gradient)" }}
                            />
                            <CountUp
                                value={stat.value}
                                className="block text-3xl lg:text-4xl font-black text-[var(--sd-text)] leading-none tracking-tight"
                            />
                            <div className="space-y-0.5">
                                <p className="text-sm font-bold text-[var(--sd-text)] leading-snug">{stat.label}</p>
                                <p className="text-xs text-[var(--sd-muted)] leading-snug">{stat.note}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>

                {/* Illustrative quote, deliberately attributed to a role rather than to
                    one of the named partners below, since the words are placeholder copy.
                    The wording here is kept distinct from the testimonials section further
                    down the page — the two were previously telling the same story about
                    the same Friday meeting. */}
                <figure className="mt-12 rounded-2xl border border-[var(--sd-line)] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
                    <div className="lg:col-span-7 bg-[var(--sd-surface)]/60 p-6 md:p-8">
                        <Quote className="w-7 h-7 text-[var(--sd-primary)]/25" aria-hidden="true" />

                        <blockquote className="mt-4">
                            <p className="text-base md:text-lg text-[var(--sd-text)] font-medium leading-relaxed text-balance">
                                &ldquo;The founders only ever wanted one number: how many seats did we actually sell
                                this month. It used to live in four people&rsquo;s heads. Now it is on a screen before
                                the meeting starts.&rdquo;
                            </p>

                            <figcaption className="mt-5 flex items-center gap-3">
                                <span className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white shadow-sm">
                                    <Image
                                        src={demoImages.avatars[3].src}
                                        alt=""
                                        fill
                                        sizes="40px"
                                        className="object-cover"
                                    />
                                </span>
                                <span className="text-sm">
                                    <span className="block font-bold text-[var(--sd-text)]">Head of Operations</span>
                                    <span className="block text-xs text-[var(--sd-muted)]">
                                        Multi-branch training institute
                                    </span>
                                </span>
                            </figcaption>
                        </blockquote>
                    </div>

                    {/* What the quote is worth in numbers, so the panel is evidence rather
                        than a wide band of empty card. */}
                    <div className="lg:col-span-5 bg-white p-6 md:p-8 border-t lg:border-t-0 lg:border-l border-[var(--sd-line)] flex flex-col justify-center gap-5">
                        <span className="inline-flex self-start items-center gap-1.5 rounded-full bg-[var(--sd-primary)]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--sd-primary)]">
                            <BadgeCheck className="w-3 h-3" aria-hidden="true" />
                            After two quarters
                        </span>

                        {QUOTE_OUTCOMES.map((outcome, i) => (
                            <div
                                key={outcome.label}
                                className={i > 0 ? "pt-5 border-t border-[var(--sd-line)]" : ""}
                            >
                                <p className="text-2xl lg:text-3xl font-black text-[var(--sd-text)] leading-none tracking-tight">
                                    {outcome.value}
                                </p>
                                <p className="mt-1.5 text-xs font-semibold text-[var(--sd-muted)] leading-snug">
                                    {outcome.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </figure>

                <div className="mt-12 pt-10 border-t border-[var(--sd-line)]">
                    <p className="text-center text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--sd-muted)]">
                        Top training providers on SkillDeck
                    </p>

                    <div className="relative mt-8 overflow-hidden">
                        {/* Edge fades, so marks enter and leave rather than getting clipped */}
                        <div
                            aria-hidden="true"
                            className="absolute inset-y-0 left-0 w-16 md:w-28 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent"
                        />
                        <div
                            aria-hidden="true"
                            className="absolute inset-y-0 right-0 w-16 md:w-28 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent"
                        />

                        <div className="animate-scroll gap-10 lg:gap-14 motion-reduce:animate-none">
                            {[0, 1].map((copy) => (
                                <ul
                                    key={copy}
                                    className="flex items-center gap-10 lg:gap-14 shrink-0"
                                    aria-hidden={copy === 1 ? true : undefined}
                                >
                                    {PARTNERS.map((partner) => {
                                        const scale = LOGO_HEIGHT / partner.h;
                                        return (
                                            <li
                                                key={`${copy}-${partner.spriteClass}`}
                                                className="relative overflow-hidden shrink-0 opacity-90 hover:opacity-100 transition-opacity duration-300"
                                                style={{ width: partner.w * scale, height: LOGO_HEIGHT }}
                                                title={partner.name}
                                            >
                                                {/* The mark is a background image, so the name carries
                                                    the accessible text and the sprite stays decorative. */}
                                                <span className="sr-only">{partner.name}</span>
                                                {/* `block` is load-bearing: the sprite classes set width
                                                    and height, which an inline element ignores — the tile
                                                    then collapses to nothing. */}
                                                <span
                                                    aria-hidden="true"
                                                    className={`block ${partner.spriteClass}`}
                                                    style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
                                                />
                                            </li>
                                        );
                                    })}
                                </ul>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
