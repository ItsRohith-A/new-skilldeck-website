"use client";

import Image from "next/image";
import { ArrowRight, Download, PlayCircle, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ServiceItemIcon from "./ServiceItemIcon";
import { useLeadModal } from "@/components/Forms/LeadModalContext";
import { normalizeRichText } from "./richText";
import { accentAt, DARK_ACCENTS } from "./accents";
import { renderHeading, ServiceHeroProps, useHeroContent, useMediaAspect } from "./heroShared";

/**
 * Variant C — dark immersive.
 *
 * Inverts the page: a dark stage where the product shot is the light source, so
 * a screenshot-heavy service reads as a platform rather than a page. Proof lives
 * in a glass strip along the bottom instead of a separate white band.
 *
 * Renders an `<h2>`: the split hero at the top of the page owns the `<h1>`.
 */
export default function ServiceHeroDark({
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
            source: "service-hero-dark",
            formTitle: `Get a Quote for ${props.serviceName}`,
            defaultValues: { subject: `Quote request for ${props.serviceName}` },
        });
    };

    return (
        <section
            id="overview-dark"
            className="relative bg-brand-dark pt-16 md:pt-20 pb-12 md:pb-16 overflow-hidden scroll-mt-20"
        >
            {/* Mesh: two brand lights behind the media, one cool light behind the copy */}
            <div
                aria-hidden="true"
                className="absolute -top-32 right-[-10%] w-[42rem] h-[42rem] rounded-full blur-3xl opacity-25 pointer-events-none"
                style={{ background: "var(--gradient-brand)" }}
            />
            <div
                aria-hidden="true"
                className="absolute bottom-[-20%] left-[-10%] w-[34rem] h-[34rem] rounded-full bg-[#5C3FFA]/25 blur-3xl pointer-events-none"
            />
            <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.15] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                    backgroundSize: "64px 64px",
                    maskImage: "radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)",
                    WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)",
                }}
            />

            <div className="container mx-auto px-2 lg:px-0 relative">
                <div className="[&_*]:!text-white/45 [&_a:hover]:!text-white">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                    {/* ───────────── COPY ───────────── */}
                    <div className="lg:col-span-6 space-y-5">
                        <div className="flex items-center gap-2 flex-wrap">
                            {tagline && (
                                <span className="inline-flex items-center gap-1.5 text-[11px] 2xl:text-xs font-semibold text-white bg-white/10 border border-white/15 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
                                    <Sparkles className="w-3.5 h-3.5 text-brand-secondary" aria-hidden="true" />
                                    {tagline}
                                </span>
                            )}
                            {rating && (
                                <span className="inline-flex items-center gap-1.5 text-[11px] 2xl:text-xs font-semibold text-amber-300 bg-amber-400/10 border border-amber-300/20 px-3.5 py-1.5 rounded-full">
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                                    {rating} Rated{clients ? ` · ${clients} Clients` : ""}
                                </span>
                            )}
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] xl:text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
                            {renderHeading(heading)}
                        </h2>

                        {body && (
                            <div
                                className="max-w-xl text-sm md:text-base text-white/60 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: normalizeRichText(body) }}
                            />
                        )}

                        {/* Feature chips — glass, so they sit on the stage without boxing it in */}
                        {features.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                                {features.map((feature, i) => {
                                    const accent = accentAt(DARK_ACCENTS, i);
                                    return (
                                        <div
                                            key={i}
                                            className="group flex items-start gap-3 rounded-xl bg-white/[0.04] border border-white/10 p-3 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
                                        >
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${accent.chip}`}>
                                                <ServiceItemIcon
                                                    iconString={feature.icon}
                                                    className="w-4 h-4"
                                                    defaultIcon="Sparkles"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[13px] font-bold text-white leading-snug">{feature.title}</p>
                                                {feature.description && (
                                                    <p className="text-[11px] text-white/45 leading-snug line-clamp-2 mt-0.5">
                                                        {feature.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                            <Button
                                onClick={handleGetQuote}
                                variant="primary"
                                size="lg"
                                className="h-12 px-5 md:px-7 rounded-xl text-sm font-bold gap-2"
                            >
                                {primaryCtaText}
                                <ArrowRight className="w-4 h-4" aria-hidden="true" />
                            </Button>
                            <Button
                                as="a"
                                href={secondaryCtaHref}
                                variant="outline"
                                size="lg"
                                className="h-12 px-4 md:px-6 rounded-xl border border-white/20 bg-white/5 text-white font-semibold text-sm hover:bg-white/10 hover:border-white/40 hover:text-white transition-all gap-2 backdrop-blur-sm"
                            >
                                <PlayCircle className="w-5 h-5 text-brand-secondary" aria-hidden="true" />
                                {secondaryCtaText}
                            </Button>
                            {brochureUrl && (
                                <a
                                    href={brochureUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white"
                                >
                                    <Download className="w-4 h-4" aria-hidden="true" />
                                    Brochure
                                </a>
                            )}
                        </div>
                    </div>

                    {/* ───────────── MEDIA ───────────── */}
                    <div className="lg:col-span-6">
                        <div className="relative">
                            {/* Glow pad, so the frame reads as lit rather than pasted on */}
                            <div
                                aria-hidden="true"
                                className="absolute -inset-6 rounded-[2rem] blur-2xl opacity-25 pointer-events-none"
                                style={{ background: "var(--gradient-brand)" }}
                            />

                            <div className="relative rounded-2xl bg-white/[0.06] border border-white/10 p-2 backdrop-blur-sm shadow-2xl shadow-black/40">
                                <div className="rounded-xl overflow-hidden bg-slate-950">
                                    {media && mediaIsVideo ? (
                                        <div className="relative w-full" style={{ aspectRatio }}>
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
                                        <div className="relative w-full" style={{ aspectRatio }}>
                                            <Image
                                                src={media}
                                                alt={mediaAlt}
                                                fill
                                                sizes="(max-width: 1024px) 100vw, 50vw"
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
                    </div>
                </div>

                {/* ───────────── GLASS PROOF STRIP ───────────── */}
                {stats.length > 0 && (
                    <div className="mt-14 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm overflow-hidden">
                        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/10">
                            {stats.map((stat, i) => (
                                <div key={i} className="flex items-center gap-3 px-5 py-6">
                                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accentAt(DARK_ACCENTS, i).chip}`}>
                                        <ServiceItemIcon
                                            iconString={stat.icon}
                                            className="w-5 h-5"
                                            defaultIcon="Sparkles"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-2xl lg:text-3xl font-black text-white leading-none tracking-tight">
                                            {stat.value}
                                        </p>
                                        <p className="text-xs font-semibold text-white/60 mt-1.5 leading-snug">
                                            {stat.description}
                                        </p>
                                        {stat.tagline && (
                                            <p className="text-[11px] text-white/35 leading-snug mt-0.5">{stat.tagline}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
