import React from "react";
import { ServiceStrategy } from "./types";
import ServiceItemIcon from "./ServiceItemIcon";
import ServiceSectionIntro from "./ServiceSectionIntro";

interface ServiceBusinessProps {
    business?: ServiceStrategy;
}

/** "Where we excel" expertise chapter — the stats band lives in ServiceWhyOpt, so this one is points only. */
export default function ServiceBusiness({ business = {} }: ServiceBusinessProps) {
    const points = (business.points || []).filter((p) => p?.title);
    if (points.length === 0) return null;

    return (
        <section id="expertise" className="scroll-mt-24 section-y bg-slate-50/70">
            <div className="container mx-auto px-4 lg:px-0 space-y-12">
                <ServiceSectionIntro
                    numeral="06"
                    kicker={business.tagline || "Our Expertise"}
                    title={business.title || "Experienced Professionals & Results"}
                    description={business.description}
                />

                <div className="space-y-5">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-brand-muted">Where We Excel</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        {points.map((point, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <ServiceItemIcon
                                    iconString={point.icon}
                                    className="w-5 h-5 text-brand-secondary mt-0.5 shrink-0"
                                    defaultIcon="Briefcase"
                                />
                                <div>
                                    <p className="text-sm font-bold text-brand-dark">{point.title}</p>
                                    {point.description && (
                                        <p className="text-xs text-brand-muted leading-relaxed mt-0.5">{point.description}</p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
