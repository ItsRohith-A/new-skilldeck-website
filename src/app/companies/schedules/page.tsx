import { CompareProvider } from "@/components/companies/compare/CompareContext";
import { CompareDrawer } from "@/components/companies/compare/CompareDrawer";
import ScheduleCard from "@/components/companies/ScheduleCard";
import SchedulesFilterBar from "@/components/companies/SchedulesFilterBar";
import Footer from "@/components/shared/Footer";
import MainNav from "@/components/shared/Navbar";
import { env } from "@/lib/env";
import { mapToSchedule } from "@/lib/scheduleMapper";
import type { Schedule } from "@/types/schedules";
import { Calendar } from "lucide-react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

export const dynamic = "force-dynamic"; // URL-driven filters — always fresh SSR

export const metadata: Metadata = {
    title: "Training Schedules | SkillDeck",
    description: "Browse training schedules from top providers. Filter by delivery type, batch, timing and month.",
    robots: { index: true, follow: true },
    alternates: { canonical: "/companies/schedules" },
};

const LIMIT = 12;

interface SearchParams {
    page?: string;
    tenantId?: string;
    deliveryType?: string;
    batchType?: string;
    timings?: string;
    month?: string;
    year?: string;
    [key: string]: string | undefined; // index signature — required for Record<string, string | undefined>
}

interface Props {
    searchParams: Promise<SearchParams>;
}

/** Build a URL for pagination (server-side only — never passed to client). */
function buildPaginationUrl(sp: SearchParams, pageOverride: number): string {
    const out = new URLSearchParams();
    const entries: [keyof SearchParams, string | undefined][] = [
        ["tenantId", sp.tenantId], ["deliveryType", sp.deliveryType],
        ["batchType", sp.batchType], ["timings", sp.timings],
        ["month", sp.month], ["year", sp.year],
    ];
    for (const [k, v] of entries) if (v) out.set(k as string, v);
    out.set("page", String(pageOverride));
    return `/companies/schedules?${out}`;
}

export default async function SchedulesPage({ searchParams }: Props) {
    const sp = await searchParams;
    const page = Math.max(1, Number(sp.page) || 1);

    // Read location preferences from cookies
    const cookieStore = await cookies();
    const geoTimezone = cookieStore.get("geo_timezone")?.value;
    const geoCurrency = cookieStore.get("geo_currency")?.value;

    // Fetch directly from backend — fully SSR, no client round-trip
    let data: any = { data: [], tenants: [], meta: { total: 0 } };
    try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(LIMIT));
        if (sp.tenantId) params.set("tenantId", sp.tenantId);
        if (sp.deliveryType && sp.deliveryType !== "All") params.set("deliveryType", sp.deliveryType);
        if (sp.batchType && sp.batchType !== "All") params.set("batchType", sp.batchType);
        if (sp.timings && sp.timings !== "All") params.set("timings", sp.timings);
        if (sp.month && sp.month !== "All") params.set("month", sp.month);
        if (sp.year && sp.year !== "All") params.set("year", sp.year);

        if (geoTimezone) params.set("timezone", geoTimezone);
        if (geoCurrency) params.set("currency", geoCurrency);

        const res = await fetch(`${env.SERVER_URL}/api/v1/skilldeck/schedules?${params}`, { cache: "no-store" });
        if (res.ok) data = await res.json();
    } catch (e) {
        console.error("[SchedulesPage] fetch error:", e);
    }

    const tenantMap = new Map<string, any>((data.tenants || []).map((t: any) => [t.id, t]));
    const schedules: Schedule[] = (data.data || []).map((s: any) => {
        const t = tenantMap.get(s.tenantId) || {};
        return mapToSchedule(
            s,
            { id: t.id || s.tenantId, name: t.legalName || t.name || "Unknown", logo: t.logo, isVerified: t.isVerified, slug: t.slug },
            geoTimezone ? { timezone: geoTimezone } : null
        );
    });

    // Group schedules by company and course
    const now = Date.now();
    const courseGroupsMap = new Map<string, Schedule[]>();

    for (const s of schedules) {
        const groupKey = `${s.company?.id || s.tenantId || "company"}_${s.course?.slug || s.course?.title || s.id}`;
        if (!courseGroupsMap.has(groupKey)) {
            courseGroupsMap.set(groupKey, []);
        }
        courseGroupsMap.get(groupKey)!.push(s);
    }

    const groupedSchedules: { primarySchedule: Schedule; allBatches: Schedule[] }[] = [];

    for (const [, batches] of courseGroupsMap.entries()) {
        batches.sort((a, b) => {
            const aTime = a.startsAt ? new Date(a.startsAt).getTime() : Infinity;
            const bTime = b.startsAt ? new Date(b.startsAt).getTime() : Infinity;
            const aIsFuture = aTime >= now;
            const bIsFuture = bTime >= now;

            if (aIsFuture && !bIsFuture) return -1;
            if (!aIsFuture && bIsFuture) return 1;
            if (aIsFuture && bIsFuture) return aTime - bTime;
            return bTime - aTime;
        });

        groupedSchedules.push({
            primarySchedule: batches[0],
            allBatches: batches,
        });
    }

    const total: number = data.total ?? data.meta?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / LIMIT));
    const filteredCompanyName = sp.tenantId
        ? (() => {
            const t = (Array.from(tenantMap.values())).find((t: any) => t.id === sp.tenantId);
            return t ? (t.legalName || t.name || null) : null;
        })()
        : null;

    return (
        <CompareProvider>
            <div className="min-h-screen flex flex-col bg-slate-50">
                <MainNav />

                <main className="flex-1">
                    <section className="relative bg-gradient-to-b from-indigo-50/50 via-indigo-50/20 to-white border-b border-slate-200/80 overflow-hidden">
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />
                            <div className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl" />
                        </div>
                        <div className="relative container mx-auto px-4 lg:px-0 pt-20 md:pt-20 lg:pt-28 lg:pb-6 text-center">
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-900 mb-4 leading-tight">
                                Find Your Perfect{" "}
                                <span className="bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] bg-clip-text text-transparent">
                                    Training Schedule{filteredCompanyName ? ` at ${filteredCompanyName}` : ""}
                                </span>
                            </h1>
                            <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto font-medium">
                                Compare programs from top providers, check schedules, and enroll in the best courses.
                            </p>
                        </div>
                    </section>
                    <div className="container mx-auto px-4 lg:px-0 py-5 md:py-10">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Left Sidebar: Filters */}
                            <aside className="w-full lg:w-72 lg:flex-shrink-0">
                                <SchedulesFilterBar searchParams={sp} />
                            </aside>

                            {/* Right Main Side: Results header & Card grid */}
                            <div className="flex-1 min-w-0">
                                {/* Results header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-sm md:text-lg font-bold text-slate-900">
                                            Showing <span className="text-indigo-600">{total}</span> Training Schedules
                                            {filteredCompanyName && ` for ${filteredCompanyName}`}
                                        </h2>
                                        <p className="text-xs md:text-sm text-slate-500 font-medium">Sorted by sponsored and recommended</p>
                                    </div>
                                    {sp.tenantId && (
                                        <Link href="/companies/schedules" className="text-sm text-indigo-600 font-semibold hover:underline">
                                            Clear filter ×
                                        </Link>
                                    )}
                                </div>

                                {/* Schedule cards */}
                                {groupedSchedules.length > 0 ? (
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
                                            {groupedSchedules.map((group, i) => (
                                                <ScheduleCard
                                                    key={group.primarySchedule.id}
                                                    schedule={group.primarySchedule}
                                                    allBatches={group.allBatches}
                                                    index={i}
                                                />
                                            ))}
                                        </div>

                                        {/* Pagination */}
                                        {totalPages > 1 && (
                                            <div className="flex items-center justify-center gap-2 mt-10">
                                                {page > 1 && (
                                                    <Link href={buildPaginationUrl(sp, page - 1)} className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 transition cursor-pointer">
                                                        ← Previous
                                                    </Link>
                                                )}
                                                <span className="text-sm font-semibold text-slate-600 px-3">Page {page} of {totalPages}</span>
                                                {page < totalPages && (
                                                    <Link href={buildPaginationUrl(sp, page + 1)} className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 transition cursor-pointer">
                                                        Next →
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-20 bg-white border border-slate-200/80 rounded-2xl p-6 text-slate-500">
                                        <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                        <p className="text-lg font-semibold">No schedules found matching your criteria.</p>
                                        <Link href="/companies/schedules" className="mt-4 inline-block text-indigo-600 font-semibold hover:underline text-sm">
                                            Clear all filters →
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
                <CompareDrawer />
            </div>
        </CompareProvider>
    );
}
