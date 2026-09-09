import React from "react";
import Image from "next/image";
import { Gauge } from "lucide-react";
import { ServiceApproachData, ServiceMedia, ServiceStrategy } from "./types";
import ServiceIconWrapper from "./ServiceIconWrapper";
import ServiceItemIcon from "./ServiceItemIcon";
import ServiceSectionIntro from "./ServiceSectionIntro";
import ServiceCtaBanner from "./ServiceCtaBanner";
import ServiceMediaFrame from "./ServiceMediaFrame";
import { isImageSrc, isVideoUrl, resolveMediaUrl } from "./richText";
import { accentAt, TILE_ACCENTS } from "./accents";

interface ServiceApproachProps {
    approach?: ServiceApproachData;
    /** Strategy data (including video/media) mapped from ServiceStrategy */
    strategy?: ServiceStrategy;
    /** Optional clip shown beside the section body — sourced from `strategy.video` or `strategy.media`. */
    media?: string | ServiceMedia;
}

/** Shown when the CMS ships no video, so the column plays the default video. */
const FALLBACK_MEDIA =
    "https://skilldeck-s3-storage.s3.ap-south-1.amazonaws.com/fcaaf582-3eb8-4415-a31d-0e951575a9bd/public/skilldeck/skilldeck-logo-intro-64146571-3229-4975-be66-d83457d45a8b.mp4";

/** Vertical connected-step timeline + inline KPI chips + a clean tools row. */
export default function ServiceApproach({ approach = {}, strategy, media }: ServiceApproachProps) {
    const steps = (approach.steps || []).filter((s) => s?.title);
    const kpiCategories = (approach.kpis?.kpiCategory || []).filter((c) => (c.content || []).length > 0);
    const tools = (approach.tools?.content || []).filter((t) => t?.value || t?.tagline || t?.icon);

    // Prefer explicit video in strategy, or media if it's a video file;
    // otherwise fall back to the default platform video (FALLBACK_MEDIA).
    const explicitVideo = strategy?.video;
    const explicitVideoUrl = resolveMediaUrl(explicitVideo);
    const candidateMedia = strategy?.media || media;
    const candidateUrl = resolveMediaUrl(candidateMedia);

    let mediaSource: string | ServiceMedia = FALLBACK_MEDIA;
    if (explicitVideoUrl) {
        mediaSource = explicitVideo!;
    } else if (candidateUrl && isVideoUrl(candidateUrl)) {
        mediaSource = candidateMedia!;
    } else {
        mediaSource = FALLBACK_MEDIA;
    }

    if (steps.length === 0 && kpiCategories.length === 0 && tools.length === 0) return null;

    return (
        <section id="approach" className="scroll-mt-24 section-y">
            <div className="container mx-auto px-2 lg:px-0">
                {/* The intro lives inside the body column so the media frame starts
                    level with the heading rather than with the timeline. */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                    <div className={`space-y-14 ${mediaSource ? "lg:col-span-7" : "lg:col-span-12"}`}>
                        <ServiceSectionIntro
                            numeral="03"
                            kicker={approach.tagline || "How We Work"}
                            title={approach.title || "How We Work & Optimize Outcomes"}
                            description={approach.description}
                        />

                        {steps.length > 0 && (
                            <div className="relative">
                                <div className="absolute left-6 top-4 bottom-4 w-px bg-gradient-to-b from-brand-primary/40 via-brand-primary/20 to-transparent" />
                                <div className="space-y-10">
                                    {steps.map((step, i) => (
                                        <div key={i} className="relative flex items-start gap-6">
                                            <div className="relative z-10 w-12 h-12 rounded-full bg-white border-2 border-brand-primary/30 flex items-center justify-center shrink-0 font-black text-brand-primary">
                                                {String(i + 1).padStart(2, "0")}
                                            </div>
                                            <div className="pt-2 space-y-1.5">
                                                <div className="flex items-center gap-2">
                                                    <ServiceItemIcon iconString={step.icon} className="w-4 h-4 text-brand-secondary" defaultIcon="Compass" />
                                                    <h3 className="text-base font-bold text-brand-dark">{step.title}</h3>
                                                </div>
                                                {step.description && <p className="body-small max-w-lg">{step.description}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {kpiCategories.length > 0 && (
                            /* Bare chips on the page background read as filler, so the KPIs
                               sit in their own panel with a brand edge. */
                            <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-slate-50 p-5 md:p-6 shadow-sm">
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-y-0 left-0 w-1"
                                    style={{ background: "var(--gradient-brand)" }}
                                />

                                <div className="pl-2 space-y-5">
                                    <div className="flex items-center gap-2">
                                        <Gauge className="w-4 h-4 text-brand-primary" aria-hidden="true" />
                                        <h3 className="text-sm md:text-base font-extrabold text-brand-dark">
                                            {approach.kpis?.badge || "Key Performance Indicators"}
                                        </h3>
                                    </div>

                                    {/* One category with three chips left a 3-column grid two
                                        thirds empty, so each category is a full-width row:
                                        label parked on the left, chips flowing across. */}
                                    <div className="divide-y divide-slate-200/70">
                                        {kpiCategories.map((category, i) => (
                                            <div
                                                key={i}
                                                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 py-4 first:pt-0 last:pb-0"
                                            >
                                                <p className="sm:w-44 shrink-0 text-[11px] font-bold uppercase tracking-widest text-brand-secondary leading-snug">
                                                    {category.kpiCategory || category.name}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {(category.content || []).map((kpi, j) => {
                                                        const accent = accentAt(TILE_ACCENTS, j);
                                                        return (
                                                            <span
                                                                key={j}
                                                                className="inline-flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3.5 py-2 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                                                            >
                                                                <ServiceItemIcon
                                                                    iconString={kpi.icon}
                                                                    className={`w-4 h-4 shrink-0 ${accent.text}`}
                                                                    defaultIcon="BadgeCheck"
                                                                />
                                                                <span className="leading-tight">
                                                                    <span className="block text-sm font-bold text-brand-dark">{kpi.value}</span>
                                                                    {kpi.description && (
                                                                        <span className="block text-[11px] font-semibold text-slate-500">{kpi.description}</span>
                                                                    )}
                                                                </span>
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {tools.length > 0 && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    {approach.tools?.badge && (
                                        <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-brand-secondary">
                                            <span aria-hidden="true" className="w-6 h-px bg-brand-secondary/50" />
                                            {approach.tools.badge}
                                        </span>
                                    )}
                                    {approach.tools?.description && (
                                        <p className="text-base md:text-lg font-bold text-brand-dark max-w-2xl leading-snug">
                                            {approach.tools.description}
                                        </p>
                                    )}
                                </div>

                                {/* Equal-width cards instead of ragged pills — the names and
                                    descriptions left holes in a wrapping flex row. */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {tools.map((tool, i) => {
                                        const accent = accentAt(TILE_ACCENTS, i);
                                        return (
                                            <div
                                                key={i}
                                                className="group relative overflow-hidden flex items-start gap-3 bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className="absolute inset-y-0 left-0 w-1 scale-y-0 origin-top group-hover:scale-y-100 transition-transform duration-500"
                                                    style={{ backgroundColor: accent.hex }}
                                                />
                                                {isImageSrc(tool.icon) ? (
                                                    <div className="relative w-9 h-9 shrink-0 rounded-lg border border-slate-100 bg-white">
                                                        <Image
                                                            src={tool.icon as string}
                                                            alt={tool.value || tool.tagline || "Tool"}
                                                            fill
                                                            sizes="36px"
                                                            className="object-contain p-1.5"
                                                        />
                                                    </div>
                                                ) : (
                                                    <ServiceIconWrapper
                                                        iconString={tool.icon}
                                                        className="w-9 h-9 shrink-0 rounded-lg group-hover:scale-105 transition-transform duration-300"
                                                        iconClassName="w-4.5 h-4.5"
                                                        fallbackBgClass={accent.chip}
                                                    />
                                                )}
                                                <span className="min-w-0 leading-snug">
                                                    <span className="block text-sm font-bold text-brand-dark">{tool.value || tool.tagline}</span>
                                                    {tool.description && (
                                                        <span className="block mt-0.5 text-xs text-slate-500">{tool.description}</span>
                                                    )}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {approach.tools?.cta?.title && (
                                    <ServiceCtaBanner
                                        title={approach.tools.cta.title}
                                        description={approach.tools.cta.descp}
                                        buttonLabel="Talk To Our Team"
                                        source="service-approach-tools"
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {mediaSource && (
                        <div className="order-first lg:order-none lg:col-span-5 lg:sticky lg:top-28">
                            <ServiceMediaFrame media={mediaSource} fallbackLabel={approach.title || "Our Approach"} />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
