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
 * Variant A — split hero (current design).
 *
 * Message left, product shot right, proof band underneath. The prop contract and
 * every CMS fallback live in `heroShared`, shared with the two variants under
 * review.
 */
export default function ServiceHero({
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
            source: "service-hero",
            formTitle: `Get a Quote for ${props.serviceName}`,
            defaultValues: { subject: `Quote request for ${props.serviceName}` },
        });
    };

    return (
        <section
            id="overview"
            className="relative bg-white pt-24 md:pt-28 lg:pt-32 pb-10 md:pb-12 overflow-hidden scroll-mt-20"
        >
            {/* Ambient brand wash behind the media column */}
            <div
                aria-hidden="true"
                className="absolute top-[-10%] right-[-8%] w-[46rem] h-[46rem] rounded-full bg-[#5C3FFA]/[0.07] blur-3xl -z-10"
            />
            <div
                aria-hidden="true"
                className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-[#CB3B95]/[0.06] blur-3xl -z-10"
            />
            <div
                aria-hidden="true"
                className="absolute -top-16 -left-24 w-72 h-72 rounded-full bg-[#5C3FFA]/5 blur-3xl -z-10"
            />
            {/* Dot lattice, mirroring the reference layout */}
            <div
                aria-hidden="true"
                className="hidden lg:block absolute top-32 right-6 w-40 h-40 -z-10 opacity-[0.35]"
                style={{
                    backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
                    backgroundSize: "14px 14px",
                    color: "#5C3FFA",
                }}
            />

            <div className="container mx-auto px-4 lg:px-0">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                    {/* ───────────── LEFT COLUMN ───────────── */}
                    <div className="lg:col-span-6 space-y-5">
                        <Breadcrumb items={breadcrumbItems} />

                        {/* Category / rating badges */}
                        <div className="flex items-center gap-2 flex-wrap">
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

                        {/* Headline + description */}
                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] xl:text-5xl font-extrabold text-brand-dark leading-[1.1] tracking-tight">
                                {renderHeading(heading)}
                            </h1>
                            {body && (
                                <div
                                    className="body-medium max-w-xl"
                                    dangerouslySetInnerHTML={{ __html: normalizeRichText(body) }}
                                />
                            )}
                        </div>

                        {/* Feature tiles */}
                        {features.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                                {features.map((feature, i) => (
                                    <div key={i} className="group space-y-2">
                                        <ServiceIconWrapper
                                            iconString={feature.icon}
                                            className="w-11 h-11 rounded-xl border border-slate-200/80 shadow-sm group-hover:-translate-y-0.5 group-hover:border-brand-primary/30 transition-all duration-300"
                                            iconClassName="w-5 h-5"
                                            defaultIcon="Sparkles"
                                            fallbackBgClass={accentAt(TILE_ACCENTS, i).chip}
                                        />
                                        <p className="text-[13px] font-bold text-brand-dark leading-snug">{feature.title}</p>
                                        {feature.description && (
                                            <p className="text-[11px] text-brand-muted leading-snug line-clamp-2">
                                                {feature.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* CTAs */}
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                            <Button
                                onClick={handleGetQuote}
                                variant="primary"
                                size="lg"
                                className="h-12 px-5 md:px-7 rounded-xl text-sm font-bold gap-2 cursor-pointer"
                            >
                                {primaryCtaText}
                                <ArrowRight className="w-4 h-4" aria-hidden="true" />
                            </Button>
                            <Button
                                as="a"
                                href={secondaryCtaHref}
                                variant="outline"
                                size="lg"
                                className="h-12 px-4 md:px-6 rounded-xl border border-gray-300 bg-white text-gray-800 font-semibold text-sm hover:border-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all gap-2 cursor-pointer"
                            >
                                <PlayCircle className="w-5 h-5 text-brand-primary" aria-hidden="true" />
                                {secondaryCtaText}
                            </Button>
                            {brochureUrl && (
                                <a
                                    href={brochureUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:underline"
                                >
                                    <Download className="w-4 h-4" aria-hidden="true" />
                                    Brochure
                                </a>
                            )}
                        </div>
                    </div>

                    {/* ───────────── RIGHT COLUMN — media panel ───────────── */}
                    <div className="lg:col-span-6 mt-2 lg:mt-0">
                        <div className="relative">
                            <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xl shadow-slate-300/50 bg-white">
                                {media && mediaIsVideo ? (
                                    <div
                                        className="relative w-full bg-slate-900"
                                        style={{ aspectRatio }}
                                    >
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
                                    <div
                                        className="relative w-full bg-slate-50"
                                        style={{ aspectRatio }}
                                    >
                                        <Image
                                            src={media}
                                            alt={mediaAlt}
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                            className="object-contain"
                                            priority
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
                </div>

                {/* ───────────── STATS BAND ───────────── */}
                {stats.length > 0 && (
                    <div className="mt-10 lg:mt-12 rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/60 overflow-hidden">
                        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-slate-100">
                            {stats.map((stat, i) => (
                                <div key={i} className="flex flex-col items-center text-center gap-2 px-4 py-6">
                                    <ServiceItemIcon
                                        iconString={stat.icon}
                                        className={`w-5 h-5 ${accentAt(STAT_ACCENTS, i).text}`}
                                        defaultIcon="Sparkles"
                                    />
                                    <p className="text-2xl lg:text-3xl font-black text-brand-dark leading-none">{stat.value}</p>
                                    <p className="text-xs font-bold text-brand-dark">{stat.description}</p>
                                    {/* {stat.tagline && (
                                        <p className="text-[11px] text-brand-muted/80 leading-snug max-w-[180px]">{stat.tagline}</p>
                                    )} */}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
