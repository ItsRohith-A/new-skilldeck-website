"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ArrowRight, ChevronDown, Layers, Menu, X } from "lucide-react";
import { useLeadModal } from "@/components/Forms/LeadModalContext";
import DynamicServiceIcon from "@/components/shared/DynamicServiceIcon";
import { DemoButton } from "./primitives";

/** Shape of the service list the page hands down from the CMS. */
export interface NavService {
    slug: string;
    name: string;
    icon?: string;
    thumbnail?: string;
}

/** Anchors match the `id` on each section of the page. */
const LINKS = [
    { id: "platform", label: "Platform" },
    { id: "how-it-works", label: "How it works" },
    { id: "solutions", label: "Solutions" },
    { id: "intelligence", label: "Intelligence" },
    { id: "security", label: "Security" },
    { id: "faq", label: "FAQ" },
];

/**
 * Page-scoped navigation for the concept.
 *
 * A floating glass pill rather than a full-width bar: it keeps the aurora ground
 * visible behind it, which is what ties the header to the rest of the page. Three
 * behaviours carry the polish — it contracts once you leave the hero, a shared
 * element slides under whichever section you are reading, and the mobile sheet
 * animates from the same pill instead of replacing the screen.
 *
 * Section tracking uses one IntersectionObserver over the anchors, not a scroll
 * handler, so it costs nothing while idle.
 */
export default function DemoNav({ services = [] }: { services?: NavService[] }) {
    const { scrollY } = useScroll();
    const reduced = useReducedMotion();
    const { openModal } = useLeadModal();

    const [condensed, setCondensed] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => setCondensed(latest > 24));

    useEffect(() => {
        const sections = LINKS.map((link) => document.getElementById(link.id)).filter(
            (element): element is HTMLElement => Boolean(element)
        );
        if (sections.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (visible) setActiveId(visible.target.id);
            },
            // Band across the upper-middle of the viewport: whatever sits there is
            // what the reader is actually looking at.
            { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5, 1] }
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    // A route change is impossible here, but an anchor jump should still close the sheet.
    useEffect(() => {
        if (!menuOpen) return;
        const close = () => setMenuOpen(false);
        window.addEventListener("hashchange", close);
        return () => window.removeEventListener("hashchange", close);
    }, [menuOpen]);

    const bookDemo = () => {
        setMenuOpen(false);
        setServicesOpen(false);
        openModal({
            source: "service-demo-nav",
            formTitle: "Book a SkillDeck walkthrough",
            defaultValues: { subject: "Demo request — training platform" },
        });
    };

    return (
        <header className="fixed inset-x-0 top-0 z-50 pointer-events-none">
            <motion.div
                className="container mx-auto px-4 sm:px-6 lg:px-0"
                animate={{ paddingTop: condensed ? 10 : 20 }}
                transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
                <motion.nav
                    // Clipping is needed below `lg` so the mobile sheet follows the
                    // animated corner radius, but it also cropped the desktop services
                    // panel, which hangs outside the bar. The sheet is `lg:hidden`, so
                    // the two needs never overlap.
                    className="pointer-events-auto overflow-hidden lg:overflow-visible border backdrop-blur-xl"
                    animate={{
                        // A full pill radius crops an expanded sheet, so the bar squares
                        // off while the menu is open.
                        borderRadius: menuOpen ? 24 : 999,
                        backgroundColor: menuOpen
                            ? "rgba(255,255,255,0.98)"
                            : condensed
                                ? "rgba(255,255,255,0.92)"
                                : "rgba(255,255,255,0.75)",
                        borderColor: condensed || menuOpen ? "rgba(220,233,231,1)" : "rgba(255,255,255,0.6)",
                        boxShadow:
                            condensed || menuOpen
                                ? "0 12px 32px -12px rgba(6,33,49,0.22)"
                                : "0 6px 20px -12px rgba(6,33,49,0.12)",
                    }}
                    transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="flex items-center gap-4 px-4 sm:px-5 py-2.5">
                        <Link href="/service-demo" className="shrink-0" aria-label="SkillDeck">
                            <Image
                                src="/logos/mainlogo.svg"
                                alt="SkillDeck"
                                width={191}
                                height={43}
                                className="w-[6.5rem] sm:w-[7.25rem] h-auto"
                                priority
                            />
                        </Link>

                        {/* Desktop links */}
                        <div className="hidden lg:flex items-center gap-1 mx-auto">
                            {/* Services live off-page, so they get a panel rather than an
                                anchor — hover opens it, and it closes on leave or on pick. */}
                            {services.length > 0 && (
                                <div
                                    className="relative"
                                    onMouseEnter={() => setServicesOpen(true)}
                                    onMouseLeave={() => setServicesOpen(false)}
                                >
                                    <button
                                        type="button"
                                        aria-expanded={servicesOpen}
                                        aria-haspopup="true"
                                        onClick={() => setServicesOpen((open) => !open)}
                                        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors duration-200 ${servicesOpen
                                            ? "text-[var(--sd-text)]"
                                            : "text-[var(--sd-muted)] hover:text-[var(--sd-text)]"
                                            }`}
                                    >
                                        Services
                                        <ChevronDown
                                            className={`w-3.5 h-3.5 transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`}
                                            aria-hidden="true"
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {servicesOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                                                transition={{ duration: reduced ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
                                                className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[34rem]"
                                            >
                                                <div className="rounded-2xl border border-[var(--sd-line)] bg-white shadow-2xl shadow-slate-300/40 overflow-hidden">
                                                    <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[var(--sd-line)] bg-[var(--sd-surface)]">
                                                        <span
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                                            style={{ background: "var(--sd-gradient)" }}
                                                        >
                                                            <Layers className="w-4 h-4 text-white" aria-hidden="true" />
                                                        </span>
                                                        <span>
                                                            <span className="block text-sm font-extrabold text-[var(--sd-text)] leading-tight">
                                                                All services
                                                            </span>
                                                            <span className="block text-[11px] text-[var(--sd-muted)]">
                                                                Everything we run for training businesses
                                                            </span>
                                                        </span>
                                                    </div>

                                                    <div className="p-2 max-h-[22rem] overflow-y-auto custom-scrollbar grid grid-cols-2 gap-1">
                                                        {services.map((service) => (
                                                            <Link
                                                                key={service.slug}
                                                                href={`/services/${service.slug}`}
                                                                onClick={() => setServicesOpen(false)}
                                                                className="group flex items-center gap-2.5 rounded-xl p-2 hover:bg-[var(--sd-surface)] transition-colors"
                                                            >
                                                                <DynamicServiceIcon
                                                                    icon={service.icon}
                                                                    thumbnail={service.thumbnail}
                                                                    alt={service.name}
                                                                    className="!w-8 !h-8 !rounded-lg"
                                                                />
                                                                <span className="text-[12px] font-bold text-[var(--sd-text)] group-hover:text-[var(--sd-primary)] transition-colors line-clamp-2 leading-snug">
                                                                    {service.name}
                                                                </span>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {LINKS.map((link) => {
                                const isActive = activeId === link.id;
                                return (
                                    <a
                                        key={link.id}
                                        href={`#${link.id}`}
                                        aria-current={isActive ? "true" : undefined}
                                        className={`relative rounded-full px-3.5 py-2 text-sm font-semibold transition-colors duration-200 ${isActive
                                            ? "text-[var(--sd-text)]"
                                            : "text-[var(--sd-muted)] hover:text-[var(--sd-text)]"
                                            }`}
                                    >
                                        {isActive && (
                                            <motion.span
                                                layoutId="demo-nav-active"
                                                aria-hidden="true"
                                                className="absolute inset-0 rounded-full bg-[var(--sd-primary)]/10"
                                                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                                            />
                                        )}
                                        <span className="relative">{link.label}</span>
                                    </a>
                                );
                            })}
                        </div>

                        <div className="ml-auto lg:ml-0 flex items-center gap-2 shrink-0">
                            <a
                                href="tel:+918296494941"
                                className="hidden sm:inline-flex text-sm font-bold text-[var(--sd-text)] hover:text-[var(--sd-primary)] px-3 py-2 transition-colors"
                            >
                                Talk to sales
                            </a>

                            <DemoButton
                                onClick={bookDemo}
                                className="h-10 px-3.5 sm:px-4 rounded-full text-[12px] sm:text-[13px] whitespace-nowrap"
                            >
                                Book a demo
                                <ArrowRight className="w-3.5 h-3.5 hidden sm:block" aria-hidden="true" />
                            </DemoButton>

                            <button
                                type="button"
                                onClick={() => setMenuOpen((open) => !open)}
                                aria-expanded={menuOpen}
                                aria-controls="demo-nav-sheet"
                                aria-label={menuOpen ? "Close menu" : "Open menu"}
                                className="lg:hidden w-10 h-10 rounded-full border border-[var(--sd-line)] bg-white flex items-center justify-center text-[var(--sd-text)]"
                            >
                                {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile sheet, expanding from the pill itself */}
                    <AnimatePresence initial={false}>
                        {menuOpen && (
                            <motion.div
                                id="demo-nav-sheet"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: reduced ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                                className="lg:hidden overflow-hidden"
                            >
                                <div className="px-3 pb-3 pt-1 mt-1 border-t border-[var(--sd-line)]">
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-3">
                                        {LINKS.map((link) => (
                                            <li key={link.id}>
                                                <a
                                                    href={`#${link.id}`}
                                                    onClick={() => setMenuOpen(false)}
                                                    className={`block rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${activeId === link.id
                                                        ? "bg-[var(--sd-primary)]/10 text-[var(--sd-primary)]"
                                                        : "text-[var(--sd-muted)] hover:bg-[var(--sd-surface)] hover:text-[var(--sd-text)]"
                                                        }`}
                                                >
                                                    {link.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>

                                    {services.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-[var(--sd-line)]">
                                            <p className="px-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--sd-muted)]">
                                                Services
                                            </p>
                                            <ul className="mt-2 max-h-56 overflow-y-auto custom-scrollbar space-y-0.5">
                                                {services.map((service) => (
                                                    <li key={service.slug}>
                                                        <Link
                                                            href={`/services/${service.slug}`}
                                                            onClick={() => setMenuOpen(false)}
                                                            className="flex items-center gap-2.5 rounded-xl px-2 py-2 hover:bg-[var(--sd-surface)] transition-colors"
                                                        >
                                                            <DynamicServiceIcon
                                                                icon={service.icon}
                                                                thumbnail={service.thumbnail}
                                                                alt={service.name}
                                                                className="!w-7 !h-7 !rounded-lg"
                                                            />
                                                            <span className="text-[12px] font-bold text-[var(--sd-text)] line-clamp-1">
                                                                {service.name}
                                                            </span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <a
                                        href="tel:+918296494941"
                                        onClick={() => setMenuOpen(false)}
                                        className="mt-3 flex items-center justify-between rounded-xl bg-[var(--sd-surface)] px-3 py-2.5 text-sm font-bold text-[var(--sd-text)]"
                                    >
                                        Talk to sales
                                        <span className="text-xs font-semibold text-[var(--sd-muted)]">+91 82964 94941</span>
                                    </a>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.nav>
            </motion.div>
        </header>
    );
}
