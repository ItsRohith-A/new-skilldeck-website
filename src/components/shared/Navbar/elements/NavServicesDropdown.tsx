"use client";

import { MenuItem } from "@/components/ui/navbar-menu";
import { ArrowRight, Layers, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import DynamicServiceIcon from "@/components/shared/DynamicServiceIcon";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface ServiceItem {
    slug: string;
    service_name: string;
    name?: string;
    order?: number;
    category_slug: string;
    servicecard?: {
        icon?: string;
        thumbnail?: string;
    };
}

interface CategoryWithServices {
    _id: string;
    name: string;
    slug: string;
    services: ServiceItem[];
    order?: number;
}

/** Categories are still the API's shape; the menu shows one flat service list. */
function flattenServices(categories: CategoryWithServices[]): ServiceItem[] {
    const bySlug = new Map<string, ServiceItem>();

    [...categories]
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .forEach((category) => {
            (category.services || []).forEach((service) => {
                // A service listed under two domains should still appear once.
                if (service?.slug && !bySlug.has(service.slug)) bySlug.set(service.slug, service);
            });
        });

    return [...bySlug.values()].sort((a, b) => (a.order || 0) - (b.order || 0));
}

export default function NavServicesDropdown({
    initialCategories = [],
    active,
    setActive
}: {
    initialCategories?: CategoryWithServices[],
    active: string | null,
    setActive: (item: string | null) => void
}) {
    const [loadingTarget, setLoadingTarget] = useState<string | null>(null);
    const pathname = usePathname();

    const services = flattenServices(initialCategories);

    useEffect(() => {
        setLoadingTarget(null);
        setActive(null);
    }, [pathname, setActive]);

    return (
        <MenuItem setActive={setActive} active={active} item="Services" centered>
            <div className="w-[85vw] max-w-3xl bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xl shadow-slate-300/40 flex flex-col">
                {/* Header — gradient edge ties the menu to the brand ramp */}
                <div className="relative bg-slate-50/70 border-b border-slate-100 px-5 py-4 flex items-center justify-between gap-4">
                    <span
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-0.5"
                        style={{ background: "var(--gradient-brand)" }}
                    />
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                            style={{ background: "var(--gradient-brand)" }}
                        >
                            <Layers className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h4 className="font-extrabold text-base text-slate-900 leading-tight">Services</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                                Explore our custom integrations and setups
                            </p>
                        </div>
                    </div>

                    {services.length > 0 && (
                        <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full shrink-0">
                            <Sparkles className="w-3 h-3" aria-hidden="true" />
                            {services.length} available
                        </span>
                    )}
                </div>

                <div className="px-4 py-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {services.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            {services.map((service, idx) => {
                                const isLoading = loadingTarget === service.slug;
                                return (
                                    <Link
                                        key={service.slug || idx}
                                        href={`/services/${service.slug}`}
                                        onClick={() => {
                                            const targetPath = `/services/${service.slug}`;
                                            if (typeof window !== 'undefined' && window.location.pathname !== targetPath) {
                                                setLoadingTarget(service.slug);
                                            }
                                        }}
                                        className="group relative overflow-hidden flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                                    >
                                        {/* Accent rail slides in on hover */}
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-y-0 left-0 w-0.5 scale-y-0 origin-top group-hover:scale-y-100 transition-transform duration-300"
                                            style={{ background: "var(--gradient-brand)" }}
                                        />

                                        <DynamicServiceIcon
                                            icon={service.servicecard?.icon}
                                            thumbnail={service.servicecard?.thumbnail}
                                            alt={service.name || service.service_name}
                                            className="!w-9 !h-9 !rounded-lg"
                                        />
                                        <span className="text-[13px] text-slate-700 font-bold group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug flex-1">
                                            {service.name || service.service_name}
                                        </span>
                                        <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-slate-50 group-hover:bg-indigo-100 transition-colors">
                                            {isLoading ? (
                                                <Loader2 className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                                            ) : (
                                                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-all group-hover:translate-x-0.5" />
                                            )}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-300">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <Layers className="w-8 h-8 opacity-20" />
                            </div>
                            <p className="text-sm font-medium">Coming Soon</p>
                            <p className="text-xs mt-1">We&apos;re currently curating new services.</p>
                        </div>
                    )}
                </div>

                {/* Footer — the menu should always offer a next step */}
                {services.length > 0 && (
                    <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 flex items-center justify-between gap-3">
                        <p className="text-[11px] text-slate-500">Not sure which one fits? We&apos;ll help you scope it.</p>
                        <Link
                            href="/contact-us"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 shrink-0 group"
                        >
                            Talk to our team
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    </div>
                )}
            </div>
        </MenuItem>
    );
}
