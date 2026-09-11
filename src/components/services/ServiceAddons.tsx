"use client";

import { ArrowUpRight } from "lucide-react";
import { ServiceAddonsData } from "./types";
import ServiceItemIcon from "./ServiceItemIcon";
import ServiceSectionIntro from "./ServiceSectionIntro";
import { accentAt, DARK_ACCENTS } from "./accents";
import ServiceCtaBanner from "./ServiceCtaBanner";
import { useServiceIdentity } from "./ServiceIdentityContext";
import { Button } from "@/components/ui/Button";
import { useLeadModal } from "@/components/Forms/LeadModalContext";

interface ServiceAddonsProps {
    addons?: ServiceAddonsData;
}

/** Premium dark upsell showcase — visually set apart from the rest of the page for contrast. */
export default function ServiceAddons({ addons = {} }: ServiceAddonsProps) {
    const { openModal } = useLeadModal();
    const service = useServiceIdentity();

    const cards = (addons.cards || []).filter((c) => c?.title);
    const contentPoints = (addons.content?.points || []).filter((p) => p?.point);
    const highlight = addons.highlight || {};
    const highlightPoints = (highlight.points || []).filter((p) => p?.value);

    if (cards.length === 0 && contentPoints.length === 0 && highlightPoints.length === 0) return null;

    return (
        <section id="addons" className="scroll-mt-24 section-y bg-brand-dark">
            <div className="container mx-auto px-4 lg:px-0 space-y-12">
                {/* Section CTA rides the header instead of closing the section, so it is
                    seen before the reader scrolls the card grid. */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
                    <div className="lg:col-span-7">
                        <ServiceSectionIntro
                            numeral="07"
                            kicker={addons.tagline || "Add-On Advantages"}
                            title={addons.title || "Premium Capabilities & Integrations"}
                            description={addons.description}
                            dark
                        />
                    </div>

                    {addons.cta?.title && (
                        <div className="lg:col-span-5">
                            <ServiceCtaBanner
                                title={addons.cta.title}
                                description={addons.cta.descp}
                                buttonLabel="Download Now"
                                source="service-addons"
                                dark
                            />
                        </div>
                    )}
                </div>

                {cards.length > 0 && (
                    <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto sm:overflow-visible pb-3 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {cards.map((card, i) => {
                            const accent = accentAt(DARK_ACCENTS, i);
                            return (
                                <div
                                    key={i}
                                    className="group rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3 hover:bg-white/10 hover:border-white/25 hover:-translate-y-0.5 transition-all duration-300 shrink-0 w-[78vw] max-w-[280px] sm:w-auto sm:shrink snap-start"
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent.chip} group-hover:scale-105 transition-transform duration-300`}>
                                        <ServiceItemIcon iconString={card.icon} className="w-5 h-5" defaultIcon="Plus" />
                                    </div>
                                    <h4 className="text-sm font-bold text-white leading-snug">{card.title}</h4>
                                    {card.description && <p className="text-xs text-white/50 leading-relaxed">{card.description}</p>}
                                </div>
                            );
                        })}
                    </div>
                )}

                {contentPoints.length > 0 && (
                    <div className="space-y-4">
                        {(addons.content?.tagline || addons.content?.title || addons.content?.description) && (
                            <div className="space-y-2 max-w-2xl">
                                {addons.content?.tagline && (
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-brand-secondary">
                                        {addons.content.tagline}
                                    </span>
                                )}
                                {addons.content?.title && (
                                    <h3 className="text-lg font-bold text-white">{addons.content.title}</h3>
                                )}
                                {addons.content?.description && (
                                    <p className="text-xs text-white/50 leading-relaxed">{addons.content.description}</p>
                                )}
                            </div>
                        )}
                        <div className="flex flex-wrap gap-2.5">
                            {contentPoints.map((point, i) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3.5 py-2 text-xs font-semibold text-white/80"
                                >
                                    <ServiceItemIcon iconString={point.icon} className="w-3.5 h-3.5 text-brand-secondary" defaultIcon="Check" />
                                    {point.point}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {highlightPoints.length > 0 && (
                    <div className="rounded-3xl bg-white/5 border border-white/10 p-6 md:p-8 space-y-6">
                        {(highlight.tagline || highlight.title || highlight.cta) && (
                            /* CTA rides the header row so it reads as the panel's action
                               rather than trailing the point list. */
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div className="space-y-2 max-w-xl">
                                    {highlight.tagline && (
                                        <span className="text-[11px] font-bold uppercase tracking-widest text-brand-secondary">
                                            {highlight.tagline}
                                        </span>
                                    )}
                                    {highlight.title && (
                                        <h3 className="text-lg md:text-xl font-bold text-white">{highlight.title}</h3>
                                    )}
                                    {highlight.description && (
                                        <p className="text-xs text-white/50 leading-relaxed">{highlight.description}</p>
                                    )}
                                </div>

                                {highlight.cta && (
                                    <Button
                                        onClick={() => openModal({
                                            source: "service-addons-highlight",
                                            formTitle: highlight.cta,
                                            serviceSlug: service?.slug,
                                            defaultValues: service ? { selectedService: service.name } : undefined,
                                        })}
                                        variant="primary"
                                        className="shrink-0 rounded-full font-bold cursor-pointer"
                                    >
                                        {highlight.cta}
                                        <ArrowUpRight className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            {highlightPoints.map((point, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <ServiceItemIcon
                                            iconString={point.icon}
                                            className={`w-4 h-4 ${accentAt(DARK_ACCENTS, i).text}`}
                                            defaultIcon="Layers"
                                        />
                                        <h5 className="text-sm font-bold text-white">{point.value}</h5>
                                    </div>
                                    {point.descp && <p className="text-xs text-white/50 leading-relaxed pl-6">{point.descp}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
