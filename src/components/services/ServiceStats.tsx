import React from "react";
import { ServiceStatItem } from "./types";
import ServiceItemIcon from "./ServiceItemIcon";

interface ServiceStatsProps {
    stats?: ServiceStatItem[];
}

/** "At a glance" number band — sits between the hero and the first narrative chapter. */
export default function ServiceStats({ stats = [] }: ServiceStatsProps) {
    const items = stats.filter((s) => s?.value);
    if (items.length === 0) return null;

    return (
        <section className="section-y border-b border-slate-100">
            <div className="container mx-auto px-4 lg:px-0">
                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100">
                    {items.map((stat, i) => (
                        <div key={i} className="flex flex-col items-center text-center gap-2 px-4 py-6">
                            <ServiceItemIcon iconString={stat.icon} className="w-5 h-5 text-brand-secondary" defaultIcon="Sparkles" />
                            <p className="text-2xl lg:text-3xl font-black text-brand-dark leading-none">{stat.value}</p>
                            <p className="text-xs font-bold text-brand-muted">{stat.description}</p>
                            {stat.tagline && (
                                <p className="text-[11px] text-brand-muted/70 leading-snug max-w-[160px]">{stat.tagline}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
