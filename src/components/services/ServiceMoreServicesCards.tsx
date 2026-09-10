"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Sparkles, Star, CheckCircle } from "lucide-react";
import { ServiceItem } from "@/lib/services";
import ServiceIconWrapper from "./ServiceIconWrapper";
import ServiceSectionIntro from "./ServiceSectionIntro";
import { accentAt, TILE_ACCENTS } from "./accents";
import { resolveMediaUrl } from "./richText";

interface ServiceMoreServicesCardsProps {
    services: ServiceItem[];
    /** The service currently being viewed, so it is omitted from the list. */
    currentSlug: string;
    currentName: string;
    title?: string;
    kicker?: string;
    description?: string;
}

/** Individual Service Card with Banner Preview and Rich Details */
function ServiceBannerCard({
    service,
    index,
}: {
    service: ServiceItem;
    index: number;
}) {
    const accent = accentAt(TILE_ACCENTS, index);
    const name = service.name || service.service_name;
    const blurb =
        service.servicecard?.tagline ||
        service.banner?.description ||
        service.servicecard?.content ||
        service.servicecard?.title;

    // Image resolution: banner media url -> thumbnail
    const bannerUrl = resolveMediaUrl(service.banner?.media) || service.servicecard?.thumbnail?.trim();
    const [imgFailed, setImgFailed] = useState(false);

    // Primary stat or review if available
    const primaryStat = service.banner?.stats?.find((s) => s?.value);
    const review = service.banner?.reviews?.[0];
    const points = (service.servicecard?.points || []).filter(Boolean).slice(0, 2);

    return (
        <Link
            href={`/services/${service.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm hover:shadow-xl hover:border-brand-primary/40 hover:-translate-y-1.5 transition-all duration-300"
        >
            {/* Top Color Accent Line */}
            <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 z-20 transition-all duration-300 group-hover:h-1.5"
                style={{ backgroundColor: accent.hex }}
            />

            {/* Media / Banner Container */}
            <div className="relative aspect-[16/10] w-full bg-slate-100">
                {/* Inner Image Frame with overflow-hidden for the hover zoom effect */}
                <div className="relative w-full h-full overflow-hidden">
                    {bannerUrl && !imgFailed ? (
                        <Image
                            src={bannerUrl}
                            alt={`${name} preview`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                            onError={() => setImgFailed(true)}
                        />
                    ) : (
                        /* Elegant Branded Fallback Pattern */
                        <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-6 overflow-hidden">
                            <div
                                aria-hidden="true"
                                className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-2xl opacity-20"
                                style={{ backgroundColor: accent.hex }}
                            />
                            <ServiceIconWrapper
                                iconString={service.servicecard?.icon}
                                className="w-14 h-14 rounded-2xl shadow-md group-hover:scale-110 transition-transform duration-300"
                                iconClassName="w-7 h-7"
                                defaultIcon="Layers"
                                fallbackBgClass={accent.chip}
                            />
                            <span className="mt-3 text-xs font-bold text-slate-500 tracking-wide uppercase">
                                {name}
                            </span>
                        </div>
                    )}

                    {/* Subtle Image Gradient Vignette for text legibility */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-70 group-hover:opacity-60 transition-opacity pointer-events-none"
                    />

                    {/* Floating Category/Integration Tag */}
                    <div className="absolute top-3 left-3 z-10">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md bg-white/90 text-slate-800 shadow-sm border border-white/50">
                            <span
                                className="w-1.5 h-1.5 rounded-full animate-pulse"
                                style={{ backgroundColor: accent.hex }}
                            />
                            Module
                        </span>
                    </div>

                    {/* Floating Metric Pill if exists */}
                    {primaryStat?.value && (
                        <div className="absolute top-3 right-3 z-10">
                            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold backdrop-blur-md bg-slate-900/85 text-white shadow-sm border border-white/15">
                                <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                                {primaryStat.value}
                            </span>
                        </div>
                    )}
                </div>

                {/* Floating Icon overlapping image border — placed outside overflow-hidden */}
                <div className="absolute -bottom-5 left-5 z-20">
                    <ServiceIconWrapper
                        iconString={service.servicecard?.icon}
                        className="w-12 h-12 rounded-xl shadow-lg border-2 border-white bg-white group-hover:scale-110 transition-transform duration-300"
                        iconClassName="w-6 h-6"
                        defaultIcon="Layers"
                        fallbackBgClass={accent.chip}
                    />
                </div>
            </div>

            {/* Card Body */}
            <div className="flex flex-1 flex-col p-5 pt-8">
                {/* Title and Top Indicator */}
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-brand-primary transition-colors leading-snug line-clamp-1">
                        {name}
                    </h3>
                    <ArrowUpRight
                        className="w-4 h-4 text-slate-400 group-hover:text-brand-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1"
                        aria-hidden="true"
                    />
                </div>

                {/* Tagline / Description */}
                {blurb && (
                    <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {blurb}
                    </p>
                )}

                {/* Optional Feature Highlights */}
                {points.length > 0 && (
                    <div className="mt-3.5 space-y-1.5">
                        {points.map((pt, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span className="truncate">{pt}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer Meta & Action */}
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    {/* Rating / Review / Tag */}
                    {review?.ratings ? (
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            {review.ratings}
                            {review.count && (
                                <span className="text-slate-400 font-normal">({review.count})</span>
                            )}
                        </span>
                    ) : (
                        <span className="text-slate-400 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active Module
                        </span>
                    )}

                    {/* Explore CTA */}
                    <span className="inline-flex items-center gap-1 font-bold text-brand-primary group-hover:translate-x-0.5 transition-transform">
                        Explore Service
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                </div>
            </div>
        </Link>
    );
}

/**
 * ServiceMoreServicesCards:
 * Cloned and upgraded version of ServiceMoreServices featuring:
 * - High-definition service banner images in each card with graceful fallback
 * - Badges for modules and key platform statistics
 * - Elevated SaaS aesthetic with micro-interactions and smooth hover states
 * - Fully responsive multi-column grid
 */
export default function ServiceMoreServicesCards({
    services,
    currentSlug,
    currentName,
    title,
    kicker = "Unified Stack",
    description,
}: ServiceMoreServicesCardsProps) {
    const others = services.filter((service) => service.slug && service.slug !== currentSlug);
    if (others.length === 0) return null;

    const sectionTitle = title || `${currentName} is one part of SkillDeck`;
    const sectionDescription =
        description ||
        "Every service below runs on the same data, logins, and billing engine. Adding any module is an instant switch with zero data migration.";

    return (
        <section id="other-services" className="scroll-mt-24 section-y bg-slate-50/70 border-t border-slate-200/60">
            <div className="container mx-auto px-2 lg:px-0 space-y-10">
                {/* Section Header */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                    <ServiceSectionIntro
                        numeral="09"
                        kicker={kicker}
                        title={sectionTitle}
                        description={sectionDescription}
                    />

                    <div className="flex items-center gap-3">
                        <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200/80 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-sm">
                            <span
                                aria-hidden="true"
                                className="w-2 h-2 rounded-full animate-pulse"
                                style={{ background: "var(--gradient-brand)" }}
                            />
                            {others.length + 1} Services, One Connected Core
                        </span>
                    </div>
                </div>

                {/* Cards Grid with Banner Previews */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {others.map((service, i) => (
                        <ServiceBannerCard
                            key={service.slug}
                            service={service}
                            index={i}
                        />
                    ))}
                </div>

                {/* Bottom Cross-Sell Callout */}
                <div className="rounded-2xl border border-brand-primary/15 bg-gradient-to-r from-brand-primary/5 via-white to-brand-secondary/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                        <ArrowRight className="w-4 h-4 text-brand-primary shrink-0" aria-hidden="true" />
                        <span>
                            Combining two or more services? They share your users, catalogue, and payments out of the box.
                        </span>
                    </p>
                    <Link
                        href="/contact-us"
                        className="inline-flex items-center justify-center shrink-0 rounded-xl bg-brand-dark px-4 py-2 text-xs font-bold text-white hover:bg-brand-primary transition-colors shadow-sm"
                    >
                        Talk to Platform Architect
                    </Link>
                </div>
            </div>
        </section>
    );
}
