"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { FooterColumn } from "@/types";

/** Absolute URL to another host. skilldeck.net and its www alias count as ours. */
function isExternalUrl(url: string): boolean {
    if (!/^https?:\/\//i.test(url)) return false;
    try {
        return !/^(www\.)?skilldeck\.net$/i.test(new URL(url).hostname);
    } catch {
        return false;
    }
}

interface FooterLinksProps {
    columns?: FooterColumn[];
}

const FooterLinks = ({ columns = [] }: FooterLinksProps) => {
    const [openSection, setOpenSection] = useState<string>("Company");

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? "" : section);
    };

    // The brand column (order 1 / "about") is rendered on the left by the footer
    // itself, so only the link columns belong here.
    const linkColumns = columns.filter(
        (col) => (col.links && col.links.length > 0) || (col.order && col.order > 1)
    );

    const FooterSection = ({ title, children, className = "" }: { title: string, children: React.ReactNode, className?: string }) => (
        <div className={cn("border-b border-slate-200 md:border-0", className)}>
            <button
                onClick={() => toggleSection(title)}
                aria-label={`Toggle ${title} section`}
                aria-expanded={openSection === title}
                className="w-full flex items-center justify-between md:cursor-default group py-3 md:py-0"
            >
                <h3 className="text-[11px] uppercase tracking-[0.15em] font-bold text-brand-dark mb-0 md:mb-5">{title}</h3>
                <ChevronDown
                    className={cn(
                        "w-4 h-4 text-slate-400 transition-transform duration-300 md:hidden",
                        openSection === title ? "rotate-180" : ""
                    )}
                />
            </button>
            <div className={cn(
                "transition-all duration-300 ease-in-out md:block overflow-hidden",
                openSection === title ? "max-h-96 opacity-100 pb-3 md:pb-0" : "max-h-0 opacity-0 md:max-h-full md:opacity-100"
            )}>
                {children}
            </div>
        </div>
    );

    if (linkColumns.length === 0) {
        return null;
    }

    // Tailwind only ships classes it can see, so the column count is a lookup
    // rather than an interpolated `md:grid-cols-${n}`, which compiled to nothing.
    const columnCountClass =
        linkColumns.length >= 4 ? "md:grid-cols-4"
            : linkColumns.length === 3 ? "md:grid-cols-3"
                : linkColumns.length === 2 ? "md:grid-cols-2"
                    : "md:grid-cols-1";

    return (
        <div className={cn("lg:col-span-8 grid grid-cols-1 gap-0 md:gap-8", columnCountClass)}>
            {linkColumns.map((col, idx) => (
                <FooterSection key={`${col.title}-${idx}`} title={col.title}>
                    {col.links && col.links.length > 0 && (
                        <ul className="space-y-2.5">
                            {col.links.map((link, linkIdx) => (
                                <li key={`${link.label}-${linkIdx}`}>
                                    {/* A CMS row with no URL is not a link — render the label rather
                                        than an anchor to "#" that goes nowhere. */}
                                    {link.url ? (
                                        <Link
                                            href={link.url}
                                            // Internal links stay followed: nofollow on
                                            // every footer link starved the pages they
                                            // point at of sitewide internal links.
                                            rel={isExternalUrl(link.url) ? "nofollow noopener" : undefined}
                                            className="text-sm text-brand-muted hover:text-brand-primary transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <span className="text-sm text-brand-muted">{link.label}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                    {col.content && (
                        <p className="text-sm text-brand-muted leading-relaxed">
                            {col.content}
                        </p>
                    )}
                </FooterSection>
            ))}
        </div>
    );
};

export default FooterLinks;
