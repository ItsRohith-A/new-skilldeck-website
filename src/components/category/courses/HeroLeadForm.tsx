"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { BadgeCheck, CalendarDays, GitCompare } from "lucide-react";
import CompanyForm from "@/components/Forms/CompanyForm";
import { formatDate } from "@/lib/courseCardHelpers";
import type { PlatformSchedule } from "@/types/hero";
import NoScheduleEnquiry from "./NoScheduleEnquiry";
import ProviderSelect from "./ProviderSelect";

/** The tenant fields this form needs; the context hands over a looser shape. */
interface TenantLike {
    id?: string;
    _id?: string;
    name?: string;
    legalName?: string;
    companyName?: string;
    logo?: string;
}

interface HeroLeadFormProps {
    courseSlug: string;
    courseTitle?: string;
    schedules: PlatformSchedule[];
    tenants: TenantLike[];
    loading?: boolean;
}

interface Provider {
    tenantId: string;
    /** Always resolved: a schedule with no nameable tenant is filtered out. */
    name: string;
    logo?: string;
    /** The schedule the lead is filed against — the one starting soonest. */
    schedule: PlatformSchedule;
}

/** `_id` arrives either as a string or as a Mongo `{ $oid }` wrapper. */
function scheduleIdOf(schedule: PlatformSchedule): string | undefined {
    const raw = schedule._id;
    if (typeof raw === "string") return raw;
    if (raw && typeof raw === "object" && "$oid" in raw) return raw.$oid;
    return schedule.id;
}

function startTime(schedule: PlatformSchedule): number {
    const t = schedule.startsAt ? new Date(schedule.startsAt).getTime() : NaN;
    return Number.isNaN(t) ? Number.MAX_SAFE_INTEGER : t;
}

/**
 * Lead form for the course hero.
 *
 * One provider → it is selected for the visitor. Several → they pick which
 * institute the enquiry goes to, because each lead lands in that tenant's CRM.
 * None → there is no tenant to route to, so the generic enquiry form runs
 * instead.
 */
export default function HeroLeadForm({
    courseSlug,
    courseTitle,
    schedules,
    tenants,
    loading = false,
}: HeroLeadFormProps) {
    const [chosenTenantId, setChosenTenantId] = useState<string | null>(null);

    const providers = useMemo<Provider[]>(() => {
        const byTenant = new Map<string, Provider>();

        // The schedules endpoint can return a batch whose tenant is not in this
        // page's tenants list (another marketplace tenant, an unpublished one).
        // Those rendered as a blank row and would have filed the lead against a
        // company we cannot name, so they are dropped. While tenants are still
        // loading the set is empty and nothing is filtered.
        const knownTenantIds = new Set(
            (tenants ?? [])
                .map((t) => t?.id || t?._id)
                .filter((id): id is string => Boolean(id))
        );

        for (const schedule of schedules ?? []) {
            const tenantId = schedule.tenantId || schedule.tenant?.id;
            if (!tenantId) continue;
            if (knownTenantIds.size > 0 && !knownTenantIds.has(tenantId)) continue;

            const tenant = (tenants ?? []).find(
                (t) => t?.id === tenantId || t?._id === tenantId
            );

            const name =
                tenant?.legalName ||
                tenant?.name ||
                tenant?.companyName ||
                schedule.tenant?.name;

            // No name means no tenant record behind it; showing "undefined" or a
            // generic placeholder in the picker helps nobody.
            if (!name) continue;

            const existing = byTenant.get(tenantId);
            // Keep the batch starting soonest — that is the one a visitor asks about.
            if (!existing || startTime(schedule) < startTime(existing.schedule)) {
                byTenant.set(tenantId, {
                    tenantId,
                    name,
                    logo: tenant?.logo || schedule.tenant?.logo,
                    schedule,
                });
            }
        }

        return Array.from(byTenant.values()).sort(
            (a, b) => startTime(a.schedule) - startTime(b.schedule)
        );
    }, [schedules, tenants]);

    if (loading) {
        return <div className="w-full h-[480px] rounded-2xl bg-slate-50 animate-pulse" />;
    }

    // No tenant to route the lead to — fall back to the platform enquiry form.
    if (providers.length === 0) {
        return (
            <NoScheduleEnquiry courseSlug={courseSlug} courseTitle={courseTitle} />
        );
    }

    const hasChoice = providers.length > 1;

    // Derived rather than stored, so a schedules refresh cannot leave the form
    // pointing at a provider that is no longer listed. With several providers
    // nothing is preselected: the visitor picks who their enquiry goes to
    // rather than having the first one chosen for them.
    const active =
        providers.find((p) => p.tenantId === chosenTenantId) ?? (hasChoice ? null : providers[0]);

    // The fixed navbar overlaps a plain anchor jump, so scroll with an offset.
    const scrollToPartners = () => {
        const element = document.getElementById("training-partners");
        if (!element) return;
        const top = element.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({ top, behavior: "smooth" });
    };

    return (
        <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-2xl shadow-gray-200/60 p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <span className="inline-flex self-start items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
                    Request a callback
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-snug mt-1">
                    Get course details from your preferred<br /> institute
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                    Get detailed information on course curriculum, duration, batch timings, and placement support.
                </p>
            </div>

            {hasChoice ? (
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                        <label
                            htmlFor="hero-provider"
                            className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide"
                        >
                            Training provider
                        </label>
                        <button
                            type="button"
                            onClick={scrollToPartners}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-primary hover:underline cursor-pointer"
                        >
                            <GitCompare className="w-3 h-3" />
                            Compare institutes
                        </button>
                    </div>
                    <ProviderSelect
                        providers={providers}
                        value={active?.tenantId}
                        onChange={setChosenTenantId}
                    />
                </div>
            ) : (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    {active?.logo ? (
                        <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center p-1 shrink-0">
                            <Image
                                src={active.logo}
                                alt={`${active.name} logo`}
                                width={64}
                                height={64}
                                className="w-full h-full object-contain"
                                loading="lazy"
                            />
                        </div>
                    ) : (
                        <span className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
                            <BadgeCheck className="w-5 h-5 text-brand-primary" />
                        </span>
                    )}
                    <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-slate-900 truncate">{active?.name}</div>
                        {active?.schedule.startsAt && (
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                <CalendarDays className="w-3 h-3" />
                                Next batch {formatDate(active.schedule.startsAt)}
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={scrollToPartners}
                        className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-brand-primary hover:underline cursor-pointer"
                    >
                        <GitCompare className="w-3 h-3" />
                        Compare
                    </button>
                </div>
            )}

            {/* The fields stay visible with nothing selected — hiding them behind
                the choice cost a step. `requireTenantId` blocks submission and
                surfaces "select a training provider first" instead. No `key`
                here on purpose: remounting on selection would wipe whatever the
                visitor had already typed. */}
            <CompanyForm
                tenantId={active?.tenantId}
                scheduleId={active ? scheduleIdOf(active.schedule) : undefined}
                courseId={courseSlug}
                courseTitle={courseTitle}
                requireTenantId={hasChoice}
                submitText="Request a callback"
                layout="compact"
            />

        </div>
    );
}
