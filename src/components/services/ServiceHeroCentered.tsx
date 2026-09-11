"use client";

import Image from "next/image";
import { ArrowRight, Download, PlayCircle, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ServiceItemIcon from "./ServiceItemIcon";
import ServiceIconWrapper from "./ServiceIconWrapper";
import { useLeadModal } from "@/components/Forms/LeadModalContext";
import { normalizeRichText } from "./richText";
import { accentAt, STAT_ACCENTS, TILE_ACCENTS } from "./accents";
import { renderHeading, ServiceHeroProps, useHeroContent, useMediaAspect } from "./heroShared";

/**
 * Variant B — centered spotlight.
 *
 * The message is stacked and centred so the headline carries the fold on its
 * own, then the product shot sits below as a wide "stage" with the proof points
 * reading across it. Reads as a launch page rather than a two-column brochure,
 * and it survives a long headline better than the split layout.
 *
 * Renders an `<h2>`: the split hero above it owns the page's `<h1>`.
 */
export default function ServiceHeroCentered({
    primaryCtaText = "Get Free Consultation",
    secondaryCtaText = "See how it works",
    secondaryCtaHref = "#approach",
    brochureUrl,
    ...props
}: ServiceHeroProps) {
    const { openModal } = useLeadModal();
    const { aspectRatio, onImageLoad, onVideoLoad } = useMediaAspect();
    const {
        heading,
        body,
        tagline,
        rating,
        clients,
        review,
        media,
        mediaAlt,
        mediaIsVideo,
        features,
        floatingStat,
        stats,
        breadcrumbItems,
    } = useHeroContent(props);

    const handleGetQuote = () => {
        openModal({
            source: "service-hero-centered",
            formTitle: `Get a Quote for ${props.serviceName}`,
            defaultValues: { subject: `Quote request for ${props.serviceName}`, selectedService: props.serviceName },
        });
    };

    return (
        <section
            id="overview-centered"
            className="relative bg-white pt-16 md:pt-20 pb-12 md:pb-16 overflow-hidden scroll-mt-20"
        >
            {/* Single wash behind the headline, so the centred column has a stage */}
            <div
                aria-hidden="true"
                className="absolute -top-40 left-1/2 -translate-x-1/2 w-[64rem] h-[42rem] rounded-full blur-3xl opacity-[0.09] pointer-events-none"
                style={{ background: "var(--gradient-brand)" }}
            />
            <div
                aria-hidden="true"
                className="hidden lg:block absolute top-40 left-8 w-32 h-32 opacity-30 pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(#5C3FFA 1px, transparent 1px)",
                    backgroundSize: "14px 14px",
                }}
            />
            <div
                aria-hidden="true"
                className="hidden lg:block absolute top-40 right-8 w-32 h-32 opacity-30 pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(#FE6A1B 1px, transparent 1px)",
                    backgroundSize: "14px 14px",
                }}
            />

            <div className="container mx-auto px-4 lg:px-0 relative">
                <div className="flex justify-center">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                {/* ── Message column ── */}
                <div className="mt-6 flex flex-col items-center text-center">
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                        {tagline && (
                            <span
                                className="inline-flex items-center gap-1.5 text-[11px] 2xl:text-xs font-semibold text-white px-3.5 py-1.5 rounded-full shadow-sm"
                                style={{ background: "var(--gradient-brand)" }}
                            >
                                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                                {tagline}
                            </span>
                        )}
                        {rating && (
                            <span className="inline-flex items-center gap-1.5 text-[11px] 2xl:text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-3.5 py-1.5 rounded-full">
                                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" aria-hidden="true" />
                                {rating} Rated{clients ? ` · ${clients} Clients` : ""}
                            </span>
                        )}
                    </div>

                    <h2 className="mt-5 max-w-4xl text-3xl md:text-5xl xl:text-6xl font-extrabold text-brand-dark leading-[1.08] tracking-tight text-balance">
                        {renderHeading(heading)}
                    </h2>

                    {body && (
                        <div
                            className="mt-4 max-w-2xl body-medium [&_p]:text-center"
                            dangerouslySetInnerHTML={{ __html: normalizeRichText(body) }}
                        />
                    )}

                    <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                        <Button
                            onClick={handleGetQuote}
                            variant="primary"
                            size="lg"
                            className="h-12 px-6 md:px-8 rounded-xl text-sm font-bold gap-2 cursor-pointer"
                        >
                            {primaryCtaText}
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </Button>
                        <Button
                            as="a"
                            href={secondaryCtaHref}
                            variant="outline"
                            size="lg"
                            className="h-12 px-5 md:px-6 rounded-xl border border-gray-300 bg-white text-gray-800 font-semibold text-sm hover:border-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all gap-2 cursor-pointer"
                        >
                            <PlayCircle className="w-5 h-5 text-brand-primary" aria-hidden="true" />
                            {secondaryCtaText}
                        </Button>
                        {brochureUrl && (
                            <a
                                href={brochureUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:underline cursor-pointer"
                            >
                                <Download className="w-4 h-4" aria-hidden="true" />
                                Brochure
                            </a>
                        )}
                    </div>
                </div>

                {/* ── Product stage ── */}
                <div className="relative mt-12 max-w-5xl mx-auto">
                    {/* Gradient ring: 1.5px of brand around the frame, no heavy border */}
                    <div className="rounded-3xl p-[1.5px] shadow-2xl shadow-slate-300/60" style={{ background: "var(--gradient-brand)" }}>
                        <div className="rounded-[calc(1.5rem-1px)] overflow-hidden bg-white">
                            {media && mediaIsVideo ? (
                                <div className="relative w-full bg-slate-900" style={{ aspectRatio }}>
                                    <video
                                        src={media}
                                        aria-label={mediaAlt}
                                        className="w-full h-full object-contain"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        preload="metadata"
                                        onLoadedMetadata={onVideoLoad}
                                    />
                                </div>
                            ) : media ? (
                                <div className="relative w-full bg-slate-50" style={{ aspectRatio }}>
                                    <Image
                                        src={media}
                                        alt={mediaAlt}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 62vw"
                                        className="object-contain"
                                        onLoad={onImageLoad}
                                    />
                                </div>
                            ) : (
                                <div
                                    className="relative w-full flex items-center justify-center"
                                    style={{ background: "var(--gradient-brand)", aspectRatio }}
                                >
                                    <ServiceItemIcon
                                        iconString={props.servicecard?.icon}
                                        className="w-16 h-16 text-white/90"
                                        defaultIcon="Sparkles"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Capability strip ── */}
                {features.length > 0 && (
                    <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-y-8 lg:divide-x divide-slate-200">
                        {features.map((feature, i) => (
                            <div key={i} className="px-0 lg:px-6 first:lg:pl-0 last:lg:pr-0 flex items-start gap-3">
                                <ServiceIconWrapper
                                    iconString={feature.icon}
                                    className="w-10 h-10 rounded-xl shrink-0"
                                    iconClassName="w-5 h-5"
                                    defaultIcon="Sparkles"
                                    fallbackBgClass={accentAt(TILE_ACCENTS, i).chip}
                                />
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-brand-dark leading-snug">{feature.title}</p>
                                    {feature.description && (
                                        <p className="mt-1 text-xs text-brand-muted leading-snug line-clamp-2">
                                            {feature.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Numbers, as a quiet closing rule ──
                    Value and label sat side by side on a shared baseline, which read as
                    ragged; stacking them puts every number on one line and lets the
                    accent live in a rule instead of coloured label text. */}
                {stats.length > 0 && (
                    <div className="mt-12 pt-10 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <div key={i} className="space-y-2">
                                <span
                                    aria-hidden="true"
                                    className="block w-8 h-[3px] rounded-full"
                                    style={{ backgroundColor: accentAt(STAT_ACCENTS, i).hex }}
                                />
                                <p className="text-3xl lg:text-4xl font-black text-brand-dark leading-none tracking-tight">
                                    {stat.value}
                                </p>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-bold text-brand-dark leading-snug">{stat.description}</p>
                                    {stat.tagline && (
                                        <p className="text-xs text-brand-muted leading-snug">{stat.tagline}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
