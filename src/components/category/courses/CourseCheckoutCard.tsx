"use client";

import CompanyContactButton from "@/components/companies/CompanyContactButton";
import { Button } from "@/components/ui/Button";
import { mapToInstitute } from "@/lib/scheduleMapper";
import { Schedule } from "@/types/schedules";
import { Calendar, Phone, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import FeaturedProvidersList from "./FeaturedProvidersList";
import NoScheduleEnquiry from "./NoScheduleEnquiry";
import PartnerAdvertiseWidget from "./PartnerAdvertiseWidget";
import { usePathname } from "next/navigation";

import { useIpLocation } from "@/hooks/useIpLocation";
import { formatNumber, getCurrencySymbol } from "@/lib/courseCardHelpers";

interface CourseCheckoutCardProps {
    schedules: Schedule[];
    tenants: any[];
    courseSlug: string;
    selectedCompanyId: string | null;
    onCompanySelect: (id: string) => void;
    loading?: boolean;
}

export default function CourseCheckoutCard({
    schedules,
    tenants,
    courseSlug,
    selectedCompanyId,
    onCompanySelect,
    loading = false
}: CourseCheckoutCardProps) {
    const { data: locationData } = useIpLocation();
    const [isMounted, setIsMounted] = useState(false);
    const [showAd, setShowAd] = useState(false);
    const pathname = usePathname();
    const isPatternPage = pathname?.startsWith("/info/");

    useEffect(() => {
        setIsMounted(true);
        if (typeof window !== "undefined") {
            const isHidden = localStorage.getItem("hide-partner-ad");
            if (isHidden === "true" || isPatternPage) return;

            // Show widget after 30 seconds
            const timer = setTimeout(() => {
                setShowAd(true);
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [isPatternPage]);

    const handleCloseAd = () => {
        setShowAd(false);
        if (typeof window !== "undefined") {
            localStorage.setItem("hide-partner-ad", "true");
        }
    };


    // Map tenants/institutes using mapToInstitute mapper
    const institutesList = useMemo(() => {
        if (!tenants || tenants.length === 0) return [];
        return tenants.map((t: any, index: number) => mapToInstitute(t, index));
    }, [tenants]);

    const verifiedCount = useMemo(() => {
        return institutesList.filter(inst => inst.isVerified).length;
    }, [institutesList]);

    // Map schedules to include resolved company details from tenants list
    const mappedSchedules = useMemo(() => {
        if (!schedules) return [];

        // The schedules endpoint can return a batch whose tenant is not in this
        // page's tenants list (another marketplace tenant, an unpublished one).
        // Those surfaced as a nameless "$0" card, so they are dropped. The set is
        // empty while tenants load, and nothing is filtered in that window.
        const knownTenantIds = new Set(
            (tenants ?? [])
                .map((t: any) => t?.id || t?._id)
                .filter(Boolean)
        );

        return schedules
            .filter((sch) => {
                if (!sch.tenantId) return Boolean(sch.company?.name);
                if (knownTenantIds.size === 0) return true;
                return knownTenantIds.has(sch.tenantId);
            })
            .map((sch) => {
                if (sch.company && sch.company.name && sch.company.logo) return sch;
                const tenant = tenants?.find((t) => (t.id === sch.tenantId || t._id === sch.tenantId));
                return {
                    ...sch,
                    company: {
                        id: tenant?.id || tenant?._id || sch.tenantId || "",
                        name: tenant?.legalName || tenant?.name || tenant?.companyName || sch.company?.name || "",
                        logo: tenant?.logo || sch.company?.logo || "",
                        isVerified: tenant?.isVerified || sch.company?.isVerified || false,
                        rating: tenant?.rating || sch.company?.rating || 0,
                        slug: tenant?.slug || sch.company?.slug || ""
                    }
                };
            })
            // A row with no company name cannot be presented or attributed.
            .filter((sch) => Boolean(sch.company?.name));
    }, [schedules, tenants]);

    // One entry per provider that actually has a batch on this course, so the
    // selector can name them instead of only offering price sorts.
    const providerOptions = useMemo(() => {
        const seen = new Map<string, string>();
        for (const sch of mappedSchedules) {
            const id = sch.company?.id;
            if (!id || seen.has(id)) continue;
            seen.set(id, sch.company?.name || "Training provider");
        }
        return Array.from(seen, ([id, name]) => ({ id, name }));
    }, [mappedSchedules]);

    // Active schedule calculations based on selected training provider
    const activeScheduleInfo = useMemo(() => {

        // Derive initial defaults dynamically from the first available schedule
        const currencyFromLocation = locationData?.currency;
        const defaultCurrency = currencyFromLocation || "USD";
        const sessionCurrency = (isMounted && typeof window !== "undefined" ? sessionStorage.getItem("currency") : null) || defaultCurrency;
        const firstSchedule = mappedSchedules[0];

        // Find pricing matching sessionCurrency, or USD pricing, or first pricing
        const firstPricing = firstSchedule?.pricing?.find(
            (p: any) => p.currency?.code?.toUpperCase() === sessionCurrency.toUpperCase()
        ) || firstSchedule?.pricing?.find(
            (p: any) => p.currency?.code?.toUpperCase() === "USD"
        ) || firstSchedule?.pricing?.[0];

        let sellingPrice = firstPricing?.comparedPrice || firstSchedule?.price || 0;
        let marketPrice = firstPricing?.actualPrice || sellingPrice;
        let currencySymbol = firstPricing?.currency?.symbol || getCurrencySymbol((firstSchedule as any)?.currency || sessionCurrency);
        let hasDiscount = marketPrice > sellingPrice;
        let discountPercent = hasDiscount ? Math.round(((marketPrice - sellingPrice) / marketPrice) * 100) : 0;

        let startText = "";
        let seatsText = "";
        let progressPercent = 0;

        if (firstSchedule) {
            if ((firstSchedule as any).isFlexibleSchedule) {
                if ((firstSchedule as any).commencementDate) {
                    const earliest = new Date((firstSchedule as any).commencementDate);
                    startText = "Starts " + earliest.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                } else {
                    startText = "Flexible Dates / Students Choice";
                }
            } else if (firstSchedule.startsAt) {
                const earliest = new Date(firstSchedule.startsAt);
                startText = "Starts " + earliest.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
            }

            if (firstSchedule.seatsAvailable !== undefined && firstSchedule.totalSeats !== undefined) {
                seatsText = `${firstSchedule.seatsAvailable} of ${firstSchedule.totalSeats} seats left`;
                progressPercent = Math.round(((firstSchedule.totalSeats - firstSchedule.seatsAvailable) / firstSchedule.totalSeats) * 100);
            }
        }

        let matchedPricing: any = null;
        let matchedSchedule: any = null;

        const activeFilter = selectedCompanyId || "lowest";
        const targetSchedules = activeFilter === "highest" || activeFilter === "lowest"
            ? mappedSchedules
            : mappedSchedules.filter((sch) => sch.company?.id === activeFilter);

        // Price one schedule in the visitor's currency, falling back to whatever
        // currencies it carries, then to the flat `price` field.
        const priceOf = (sch: any): { pricing: any | null; sell: number } => {
            const list: any[] = sch?.pricing || [];
            const byCurrency = list.filter(
                (p: any) => p.currency?.code?.toUpperCase() === sessionCurrency.toUpperCase()
            );
            const pool = byCurrency.length > 0 ? byCurrency : list;
            if (pool.length === 0) return { pricing: null, sell: sch?.price || 0 };

            const sorted = [...pool].sort(
                (a: any, b: any) => (a.comparedPrice || sch.price || 0) - (b.comparedPrice || sch.price || 0)
            );
            const chosen = activeFilter === "highest" ? sorted[sorted.length - 1] : sorted[0];
            return { pricing: chosen, sell: chosen.comparedPrice || sch.price || 0 };
        };

        const priced = targetSchedules
            .map((sch: any) => ({ sch, ...priceOf(sch) }))
            .filter((entry) => entry.sell > 0)
            .sort((a, b) => a.sell - b.sell);

        if (priced.length > 0) {
            const chosen = activeFilter === "highest" ? priced[priced.length - 1] : priced[0];
            matchedSchedule = chosen.sch;
            matchedPricing = chosen.pricing;
        } else {
            // Nothing in this set carries a price. Still select a real schedule,
            // otherwise the card renders "$0" against "this company" with no
            // provider and no start date.
            matchedSchedule = targetSchedules[0] || mappedSchedules[0] || null;
            matchedPricing = matchedSchedule?.pricing?.[0] || null;
        }

        if (matchedPricing) {
            sellingPrice = matchedPricing.comparedPrice || matchedSchedule?.price || 0;
            marketPrice = matchedPricing.actualPrice || sellingPrice;
            currencySymbol = matchedPricing.currency?.symbol || getCurrencySymbol((matchedSchedule as any)?.currency || sessionCurrency);
        } else if (matchedSchedule) {
            sellingPrice = matchedSchedule.price || 0;
            marketPrice = matchedSchedule.price || 0;
            currencySymbol = getCurrencySymbol((matchedSchedule as any).currency || sessionCurrency);
        }

        if (marketPrice > sellingPrice && sellingPrice > 0) {
            hasDiscount = true;
            discountPercent = Math.round(((marketPrice - sellingPrice) / marketPrice) * 100);
        } else {
            hasDiscount = false;
            discountPercent = 0;
        }

        // Dates and seats come from the selected schedule, so the card describes
        // one batch rather than mixing one provider's price with another's date.
        // Both reset first: the defaults above are seeded from mappedSchedules[0],
        // and leaving them in place leaked that provider's seats into another
        // provider's card.
        if (matchedSchedule) {
            const sch: any = matchedSchedule;

            startText = "";
            seatsText = "";
            progressPercent = 0;

            const formatStart = (value?: string) => {
                if (!value) return "";
                const date = new Date(value);
                if (Number.isNaN(date.getTime())) return "";
                return "Starts " + date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
            };

            if (sch.isFlexibleSchedule) {
                startText = formatStart(sch.commencementDate) || "Flexible Dates / Students Choice";
            } else {
                // A fixed batch can carry only `commencementDate`; reading
                // `startsAt` blindly rendered "Starts Invalid Date".
                startText = formatStart(sch.startsAt || sch.commencementDate);
            }

            if (sch.seatsAvailable !== undefined && sch.totalSeats !== undefined && sch.totalSeats > 0) {
                seatsText = `${sch.seatsAvailable} of ${sch.totalSeats} seats left`;
                progressPercent = Math.round(((sch.totalSeats - sch.seatsAvailable) / sch.totalSeats) * 100);
            }
        }

        const formattedPrice = `${currencySymbol}${formatNumber(sellingPrice, currencySymbol)}`;
        const formattedCompared = `${currencySymbol}${formatNumber(marketPrice, currencySymbol)}`;
        const monthlyInstallment = `${currencySymbol}${formatNumber(Math.round(sellingPrice / 12), currencySymbol)}`;

        return {
            formattedPrice,
            formattedCompared,
            monthlyInstallment,
            hasDiscount,
            discountPercent,
            startText,
            seatsText,
            progressPercent,
            matchedSchedule: matchedSchedule || firstSchedule
        };
    }, [mappedSchedules, selectedCompanyId, isMounted, locationData]);

    const activeCompanyName = useMemo(() => {
        const tId = activeScheduleInfo.matchedSchedule?.tenantId || activeScheduleInfo.matchedSchedule?.company?.id;
        if (!tId) return "";
        const matchedTenant = tenants.find((t: any) => (t.id === tId || t._id === tId));
        return matchedTenant?.legalName || matchedTenant?.name || matchedTenant?.companyName || activeScheduleInfo.matchedSchedule?.company?.name || "";
    }, [activeScheduleInfo.matchedSchedule, tenants]);

    if (!isMounted) {
        return <div className="w-full max-w-[380px] bg-slate-50 h-[480px] rounded-2xl animate-pulse" />;
    }

    if (loading) {
        return (
            <>
                <div className="w-full max-w-[380px] bg-slate-50 h-[480px] rounded-2xl animate-pulse" />
                <PartnerAdvertiseWidget showAd={showAd} onClose={handleCloseAd} />
            </>
        );
    }

    if (mappedSchedules.length === 0) {
        return (
            <>
                <div className="w-full max-w-[380px]">
                    <NoScheduleEnquiry courseSlug={courseSlug} />
                </div>
                <PartnerAdvertiseWidget showAd={showAd} onClose={handleCloseAd} />
            </>
        );
    }

    return (
        <div className="w-full max-w-[380px] flex flex-col gap-4">
            {/* Top Selector dropdown */}
            {mappedSchedules.length > 0 && (
                <div className="relative w-full">
                    {/* Filter Icon - left side */}
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 z-10">
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                    </div>
                    <select
                        value={selectedCompanyId || "lowest"}
                        onChange={(e) => onCompanySelect(e.target.value)}
                        aria-label="Select training provider or pricing option"
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-10 py-2 text-xs 2xl:text-sm font-semibold text-slate-700 outline-none shadow-sm appearance-none cursor-pointer"
                    >
                        <option value="lowest">Top lowest price available</option>
                        <option value="highest">Top highest price available</option>
                        {providerOptions.length > 0 && (
                            <optgroup label="Training providers">
                                {providerOptions.map((provider) => (
                                    <option key={provider.id} value={provider.id}>
                                        {provider.name}
                                    </option>
                                ))}
                            </optgroup>
                        )}
                    </select>
                    {/* Chevron - right side */}
                    {/* <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div> */}
                </div>
            )}

            {/* Main checkout card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] p-5 flex flex-col gap-3">
                <div>
                    <span className="text-[11px] 2xl:text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">Programme fee</span>
                    {!isMounted ? (
                        <div className="space-y-2 pt-1">
                            <div className="h-7 w-32 bg-slate-100 rounded animate-pulse" />
                            <div className="h-3 w-48 bg-slate-50 rounded animate-pulse" />
                        </div>
                    ) : (
                        <>
                            <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="text-xl font-semibold text-[#0F172A]" suppressHydrationWarning>
                                    {activeScheduleInfo.formattedPrice}
                                </span>
                                {activeScheduleInfo.hasDiscount && (
                                    <>
                                        <span className="text-sm text-slate-600 line-through font-medium" suppressHydrationWarning>
                                            {activeScheduleInfo.formattedCompared}
                                        </span>
                                        <span className="bg-green-50 text-green-600 text-xs font-bold px-2 py-0.5 rounded-md border border-green-100">
                                            Save {activeScheduleInfo.discountPercent}%
                                        </span>
                                    </>
                                )}
                            </div>
                            <span className="text-[11px] text-slate-500 font-medium block mt-1" suppressHydrationWarning>
                                or {activeScheduleInfo.monthlyInstallment}/month · 12-month no-cost EMI
                            </span>
                        </>
                    )}
                </div>

                {/* Partner Details Block */}
                {activeScheduleInfo.matchedSchedule?.company && (
                    <div className="flex items-center justify-between border border-slate-100 rounded-xl p-2 bg-slate-50/50 min-w-0">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-14 h-10 flex items-center justify-center overflow-hidden shrink-0 relative">
                                {activeScheduleInfo.matchedSchedule.company.logo ? (
                                    <Image
                                        src={activeScheduleInfo.matchedSchedule.company.logo}
                                        alt={activeScheduleInfo.matchedSchedule.company.name}
                                        fill
                                        sizes="60px"
                                        className="object-contain p-1"
                                    />
                                ) : (
                                    <span className="text-sm font-bold text-brand-primary uppercase">
                                        {activeScheduleInfo.matchedSchedule.company.name.charAt(0)}
                                    </span>
                                )}
                            </div>
                            <div className="min-w-0">
                                <h5 className="text-xs font-bold text-slate-800 truncate">{activeScheduleInfo.matchedSchedule.company.name}</h5>
                                <p className="text-[10px] text-slate-500 mt-0.5 capitalize truncate">
                                    {[
                                        activeScheduleInfo.matchedSchedule?.location || "Hybrid",
                                        activeScheduleInfo.matchedSchedule?.deliveryType
                                    ].filter(Boolean).join(" · ")}
                                </p>
                            </div>
                        </div>
                        {activeScheduleInfo.matchedSchedule.company.rating > 0 && (
                            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-md px-1.5 py-0.5 text-[10px] font-bold flex-shrink-0">
                                <span>★</span>
                                <span>{activeScheduleInfo.matchedSchedule.company.rating}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Start Date Block */}
                {activeScheduleInfo.startText && (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Start date</div>
                            <div className="text-sm font-bold text-slate-800">
                                {activeScheduleInfo.startText.replace("Starts ", "")}
                            </div>
                        </div>
                    </div>
                )}

                {/* Primary Action Buttons */}
                <div className="flex flex-col gap-3">
                    <CompanyContactButton
                        tenantId={activeScheduleInfo.matchedSchedule?.tenantId || activeScheduleInfo.matchedSchedule?.company?.id}
                        companyName={activeCompanyName}
                        scheduleId={activeScheduleInfo.matchedSchedule?.id || activeScheduleInfo.matchedSchedule?._id}
                        courseId={courseSlug}
                        courseTitle={activeScheduleInfo.matchedSchedule?.course?.title || "Course"}
                        showPreferredDateTime={true}
                        renderButton={(onClick) => (
                            <Button
                                type="button"
                                onClick={onClick}
                                variant="primary"
                                className="w-full h-10 text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/10 transition-all cursor-pointer"
                            >
                                <span>Request a callback</span>
                                <Phone className="w-4 h-4 fill-white/20" />
                            </Button>
                        )}
                    />

                    {/* <Button
                        type="button"
                        variant="outline"
                        className="w-full h-10 text-brand-primary border-2 border-brand-primary/30 hover:border-none text-sm font-bold gap-2"
                    >
                        <span>Download curriculum</span>
                        <Download className="w-4 h-4" />
                    </Button> */}
                </div>
                {/* Auxiliary Share/Compare buttons */}
                {/* <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        className="border border-slate-200 hover:bg-slate-50 rounded-xl py-2 px-3 flex items-center justify-center gap-2 text-xs font-bold text-slate-600 transition-all"
                    >
                        <GitCompare className="w-4 h-4" />
                        <span>Compare</span>
                    </button>

                    <button
                        type="button"
                        className="border border-slate-200 hover:bg-slate-50 rounded-xl py-2 px-3 flex items-center justify-center gap-2 text-xs font-bold text-slate-600 transition-all"
                    >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                    </button>
                </div> */}

                {/* Featured Training Providers Section */}
                <FeaturedProvidersList
                    institutesList={institutesList}
                    verifiedCount={verifiedCount}
                    selectedCompanyId={selectedCompanyId}
                    onCompanySelect={onCompanySelect}
                />
            </div>

            {/* Partner & Advertise Widget */}
            {!isPatternPage && (
                <PartnerAdvertiseWidget
                    showAd={showAd}
                    onClose={handleCloseAd}
                />
            )}
        </div>
    );
}
