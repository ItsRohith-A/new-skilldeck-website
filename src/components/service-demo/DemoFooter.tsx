"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Phone, Sparkles } from "lucide-react";
import { useLeadModal } from "@/components/Forms/LeadModalContext";
import { DemoButton } from "./primitives";
import { demoImages } from "./images";
import { shell } from "./theme";

const ASSURANCES = ["No setup fees", "Free migration", "24/7 support"];

const PHONE = "+91 8296494941";

const COMPANY_LINKS = [
    { label: "About Us", href: "/about-us" },
    { label: "Contact Us", href: "/contact-us" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Html Sitemap", href: "/sitemap-html" },
];

const LEGAL_LINKS = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Cookie Policy", href: "/cookie-policy" },
];

/** Slugs taken from the live category routes, not guessed from the label. */
const CATEGORIES = [
    { label: "Agile Courses", href: "/agile" },
    { label: "Marketing Courses", href: "/marketing" },
    { label: "Healthcare Courses", href: "/healthcare" },
    { label: "Competitive Courses", href: "/competitive" },
    { label: "Bachelor Degree Courses", href: "/bachelor-degree" },
    { label: "Master Degree Courses", href: "/master-degree" },
    { label: "Diploma Courses", href: "/diploma" },
    { label: "VLSI Courses", href: "/vlsi" },
    { label: "Finance/Accounting Courses", href: "/finance" },
    { label: "AI Courses", href: "/ai" },
];

/**
 * Closing CTA + footer for the concept.
 *
 * A flat dark column-stack read as a different site pasted under the page, so
 * this borrows the hero's own language: the same aurora ground, one elevated
 * card doing the asking, and links that behave like controls rather than a
 * sitemap dump. Replaces the shared site footer on this route only.
 */
export default function DemoFooter() {
    const { openModal } = useLeadModal();

    const openForm = (source: string, formTitle: string) =>
        openModal({ source, formTitle, defaultValues: { subject: "SkillDeck — training platform" } });

    return (
        <footer className="relative overflow-hidden bg-white">
            {/* Same aurora as the hero, mirrored, so the page closes where it opened */}
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(0deg, #F2FBFA 0%, #EFF9FF 55%, #FFFFFF 100%)" }}
            />
            <div
                aria-hidden="true"
                className="absolute -bottom-40 left-[-10%] w-[38rem] h-[38rem] rounded-full blur-3xl opacity-40 pointer-events-none"
                style={{ background: "radial-gradient(circle, #A7F3EB 0%, transparent 65%)" }}
            />
            <div
                aria-hidden="true"
                className="absolute top-10 right-[-10%] w-[36rem] h-[36rem] rounded-full blur-3xl opacity-40 pointer-events-none"
                style={{ background: "radial-gradient(circle, #BFE7FF 0%, transparent 65%)" }}
            />

            <div className={`${shell} relative pt-16 md:pt-20 pb-10`}>
                {/* ── Elevated CTA card ── */}
                <div
                    className="relative rounded-[1.75rem] p-[1.5px] shadow-2xl shadow-slate-300/50"
                    style={{ background: "var(--sd-gradient)" }}
                >
                    <div
                        className="relative rounded-[1.65rem] overflow-hidden px-7 py-10 md:px-12 md:py-14"
                        style={{ background: "var(--sd-gradient-deep)" }}
                    >
                        <div
                            aria-hidden="true"
                            className="absolute -top-28 -right-16 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-30 pointer-events-none"
                            style={{ background: "radial-gradient(circle, #22D3EE 0%, transparent 65%)" }}
                        />
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 opacity-[0.13] pointer-events-none"
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                                backgroundSize: "56px 56px",
                                maskImage: "radial-gradient(ellipse at 20% 0%, black 10%, transparent 70%)",
                                WebkitMaskImage: "radial-gradient(ellipse at 20% 0%, black 10%, transparent 70%)",
                            }}
                        />

                        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                            <div className="lg:col-span-7">
                                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-[11px] font-bold text-white/85 backdrop-blur-sm">
                                    <Sparkles className="w-3.5 h-3.5 text-[var(--sd-accent)]" aria-hidden="true" />
                                    Stay ahead. Stay focused.
                                </span>

                                <h2 className="mt-5 text-3xl md:text-[2.6rem] font-extrabold text-white leading-[1.08] tracking-tight text-balance">
                                    Ready to transform{" "}
                                    <span
                                        className="bg-clip-text text-transparent"
                                        style={{ backgroundImage: "var(--sd-gradient)" }}
                                    >
                                        your business?
                                    </span>
                                </h2>

                                <p className="mt-4 text-base text-white/60 leading-relaxed max-w-xl">
                                    Built for trainers and training institutes who want to focus on what truly matters —
                                    delivering great training and growing their business.
                                </p>

                                <div className="mt-7 flex flex-wrap items-center gap-3">
                                    <DemoButton onClick={() => openForm("service-demo-footer-primary", "Get started with SkillDeck")}>
                                        Get started today
                                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                                    </DemoButton>
                                    <DemoButton
                                        variant="ghost-dark"
                                        onClick={() => openForm("service-demo-footer-sales", "Talk to SkillDeck sales")}
                                    >
                                        Talk to sales
                                    </DemoButton>
                                </div>

                                <ul className="mt-7 flex flex-wrap items-center gap-2">
                                    {ASSURANCES.map((item) => (
                                        <li
                                            key={item}
                                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-white/70"
                                        >
                                            <Check className="w-3 h-3 text-[var(--sd-accent)]" aria-hidden="true" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* The three-line beat, set as a card so it lands like a statement */}
                            <div className="lg:col-span-5">
                                <div className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-sm p-6 space-y-4">
                                    <p className="text-lg md:text-xl font-bold leading-relaxed">
                                        <span className="block text-white/45 line-through decoration-white/25">
                                            Stop managing tools.
                                        </span>
                                        <span className="block text-white/45 line-through decoration-white/25">
                                            Stop wasting money.
                                        </span>
                                        <span
                                            className="block mt-2 bg-clip-text text-transparent"
                                            style={{ backgroundImage: "var(--sd-gradient)" }}
                                        >
                                            Start scaling with SkillDeck.
                                        </span>
                                    </p>

                                    <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                                        <div className="flex -space-x-2 shrink-0">
                                            {demoImages.avatars.slice(0, 3).map((avatar, i) => (
                                                <span
                                                    key={i}
                                                    className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-[#0A2E42]"
                                                >
                                                    <Image src={avatar.src} alt="" fill sizes="28px" className="object-cover" />
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-[11px] text-white/50 leading-snug">
                                            Joined by <span className="font-bold text-white/80">540 academies</span> this year
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Sitemap ── */}
                <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">
                    <div className="lg:col-span-5 space-y-5">
                        <Image
                            src="/logos/mainlogo.svg"
                            alt="SkillDeck"
                            width={191}
                            height={43}
                            className="w-[8.5rem] h-auto"
                        />
                        <p className="text-sm text-[var(--sd-muted)] leading-relaxed max-w-sm">
                            The all-in-one platform for training companies. Website, LMS, CRM and marketing — all in
                            one place.
                        </p>

                        {/* Phone as a card, not a line of text — it is a real action */}
                        <a
                            href={`tel:${PHONE.replace(/[^0-9+]/g, "")}`}
                            className="group inline-flex items-center gap-3 rounded-2xl border border-[var(--sd-line)] bg-white px-4 py-3 hover:border-[var(--sd-primary)]/40 hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            <span className="w-9 h-9 rounded-xl bg-[var(--sd-primary)]/10 flex items-center justify-center shrink-0">
                                <Phone className="w-4 h-4 text-[var(--sd-primary)]" aria-hidden="true" />
                            </span>
                            <span className="leading-tight">
                                <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--sd-muted)]">
                                    Talk to us
                                </span>
                                <span className="block text-sm font-extrabold text-[var(--sd-text)]">{PHONE}</span>
                            </span>
                            <ArrowUpRight
                                className="w-4 h-4 text-slate-300 group-hover:text-[var(--sd-primary)] transition-colors"
                                aria-hidden="true"
                            />
                        </a>
                    </div>

                    <FooterNav label="Company" links={COMPANY_LINKS} className="lg:col-span-3" />
                    <FooterNav label="Legal" links={LEGAL_LINKS} className="lg:col-span-4" />
                </div>

                {/* ── Categories ──
                    Ten labels in a column would run longer than the rest of the footer,
                    so they wrap as chips with an accent dot. */}
                <nav className="mt-12 pt-8 border-t border-[var(--sd-line)]" aria-label="Top categories">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--sd-muted)]">
                        Top categories
                    </h3>
                    <ul className="mt-4 flex flex-wrap gap-2">
                        {CATEGORIES.map((category) => (
                            <li key={category.href}>
                                <Link
                                    href={category.href}
                                    className="group inline-flex items-center gap-2 rounded-full border border-[var(--sd-line)] bg-white px-3.5 py-1.5 text-xs font-semibold text-[var(--sd-muted)] hover:text-[var(--sd-text)] hover:border-[var(--sd-primary)]/40 hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="w-1.5 h-1.5 rounded-full bg-[var(--sd-primary)]/40 group-hover:bg-[var(--sd-primary)] transition-colors"
                                    />
                                    {category.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="mt-10 pt-6 border-t border-[var(--sd-line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-xs text-[var(--sd-muted)]">
                        © {new Date().getFullYear()} Skilldeck. All rights reserved.
                    </p>
                    <p className="text-xs text-[var(--sd-muted)]/70">Design concept · not a live offer</p>
                </div>
            </div>
        </footer>
    );
}

/** Link column with a hover slide, so the list reads as controls. */
function FooterNav({
    label,
    links,
    className = "",
}: {
    label: string;
    links: { label: string; href: string }[];
    className?: string;
}) {
    return (
        <nav className={className} aria-label={label}>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--sd-muted)]">{label}</h3>
            <ul className="mt-4 space-y-1">
                {links.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className="group inline-flex items-center gap-2 py-1 text-sm text-[var(--sd-muted)] hover:text-[var(--sd-primary)] transition-colors"
                        >
                            <span
                                aria-hidden="true"
                                className="w-0 h-px bg-[var(--sd-primary)] group-hover:w-3 transition-all duration-300"
                            />
                            <span className="group-hover:translate-x-0 transition-transform duration-300">
                                {link.label}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
