import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ServiceItem } from "@/lib/services";
import ServiceIconWrapper from "./ServiceIconWrapper";
import ServiceSectionIntro from "./ServiceSectionIntro";
import { accentAt, TILE_ACCENTS } from "./accents";

interface ServiceMoreServicesProps {
    services: ServiceItem[];
    /** The service being viewed, so it is not listed against itself. */
    currentSlug: string;
    currentName: string;
}

/**
 * Cross-sell band: everything else the platform runs.
 *
 * A visitor who lands on one service page has no way of knowing the platform
 * covers the rest of their stack — the page never mentions it. This lists every
 * other published service, so the LMS reader learns the CRM, website, events and
 * support tooling come from the same place.
 *
 * Renders nothing when there is only one service, rather than an empty band.
 */
export default function ServiceMoreServices({
    services,
    currentSlug,
    currentName,
}: ServiceMoreServicesProps) {
    const others = services.filter((service) => service.slug && service.slug !== currentSlug);
    if (others.length === 0) return null;

    return (
        <section id="more-services" className="scroll-mt-24 section-y bg-slate-50/70">
            <div className="container mx-auto px-2 lg:px-0 space-y-10">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                    <ServiceSectionIntro
                        numeral="09"
                        kicker="One platform"
                        title={`${currentName} is one part of SkillDeck`}
                        description="Every service below runs on the same data, the same logins and the same billing — so adding one is a switch, not another migration."
                    />

                    <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-brand-dark">
                        <span
                            aria-hidden="true"
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: "var(--gradient-brand)" }}
                        />
                        {others.length + 1} services, one system
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {others.map((service, i) => {
                        const accent = accentAt(TILE_ACCENTS, i);
                        const name = service.name || service.service_name;
                        const blurb = service.servicecard?.tagline || service.servicecard?.title;

                        return (
                            <Link
                                key={service.slug}
                                href={`/services/${service.slug}`}
                                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 flex items-start gap-4 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-brand-primary/30 transition-all duration-300"
                            >
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-y-0 left-0 w-1 scale-y-0 origin-top group-hover:scale-y-100 transition-transform duration-500"
                                    style={{ backgroundColor: accent.hex }}
                                />

                                <ServiceIconWrapper
                                    iconString={service.servicecard?.icon}
                                    className="w-11 h-11 rounded-xl group-hover:scale-105 transition-transform duration-300"
                                    iconClassName="w-5 h-5"
                                    defaultIcon="Layers"
                                    fallbackBgClass={accent.chip}
                                />

                                <span className="min-w-0 flex-1">
                                    <span className="block text-base font-extrabold text-brand-dark leading-snug group-hover:text-brand-primary transition-colors">
                                        {name}
                                    </span>
                                    {blurb && (
                                        <span className="mt-1 block text-sm text-brand-muted leading-relaxed line-clamp-2">
                                            {blurb}
                                        </span>
                                    )}
                                </span>

                                <ArrowUpRight
                                    className="w-4 h-4 text-slate-300 shrink-0 group-hover:text-brand-primary transition-colors"
                                    aria-hidden="true"
                                />
                            </Link>
                        );
                    })}
                </div>

                <p className="flex items-center gap-2 text-sm text-brand-muted">
                    <ArrowRight className="w-4 h-4 text-brand-primary shrink-0" aria-hidden="true" />
                    Running two or more together? Ask us how they share data — it usually removes a tool you are
                    paying for today.
                </p>
            </div>
        </section>
    );
}
