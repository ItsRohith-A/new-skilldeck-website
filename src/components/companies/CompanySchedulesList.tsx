"use client";

import { useIpLocation } from "@/hooks/useIpLocation";
import { mapToSchedule } from "@/lib/scheduleMapper";
import { Schedule } from "@/types/schedules";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ScheduleCard from "./ScheduleCard";

interface Props {
    companyId: string;
    /**
     * courseSlug -> card thumbnail. Schedules carry no artwork of their own, so
     * without this every card here fell back to the "No Preview" tile while the
     * same cards on /companies/schedules showed pictures.
     */
    courseImages?: Record<string, string>;
}

interface CourseScheduleGroup {
    primarySchedule: Schedule;
    allBatches: Schedule[];
}

export default function CompanySchedulesList({ companyId, courseImages = {} }: Props) {
    const { data: location, loading: locationLoading } = useIpLocation();
    const [groupedCourses, setGroupedCourses] = useState<CourseScheduleGroup[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [mobileIndex, setMobileIndex] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (locationLoading) return;

        const ctrl = new AbortController();
        (async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams({ tenantId: companyId, limit: "50" });
                if (location?.timezone) params.append("timezone", location.timezone);
                if (location?.currency) params.append("currency", location.currency);

                const res = await fetch(`/api/schedules?${params}`, { signal: ctrl.signal });
                if (!res.ok) throw new Error("fetch failed");
                const data = await res.json();

                const tenantMap = new Map((data.tenants || []).map((t: any) => [t.id, t]));
                // Tenants are only hydrated for tenants holding a plan, while the
                // listing returns every published schedule. One whose tenant is
                // missing renders as "Unknown" with no price, so it is dropped.
                const mapped = (data.data || [])
                    .filter((s: any) => tenantMap.size === 0 || tenantMap.has(s.tenantId))
                    .map((s: any) => {
                    const t: any = tenantMap.get(s.tenantId) || {};
                    const mapped = mapToSchedule(s, { id: t.id || s.tenantId, name: t.name || t.legalName || "Unknown", logo: t.logo, isVerified: t.isVerified, slug: t.slug }, location);
                    if (!mapped.image && mapped.course?.slug) {
                        mapped.image = courseImages[mapped.course.slug];
                    }
                    return mapped;
                });

                // Group batches by unique course
                const now = Date.now();
                const courseGroupsMap = new Map<string, Schedule[]>();

                for (const s of mapped) {
                    const courseKey = s.course?.slug || s.course?.title || s.id;
                    if (!courseGroupsMap.has(courseKey)) {
                        courseGroupsMap.set(courseKey, []);
                    }
                    courseGroupsMap.get(courseKey)!.push(s);
                }

                // For each course, sort its batches by earliest upcoming date
                const groups: CourseScheduleGroup[] = [];

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

                    groups.push({
                        primarySchedule: batches[0],
                        allBatches: batches,
                    });
                }

                // Sort courses by price ascending
                groups.sort((a, b) => {
                    const pA = a.primarySchedule.pricing?.[0];
                    const priceA = pA?.comparedPrice ?? pA?.price ?? Number.MAX_SAFE_INTEGER;
                    const pB = b.primarySchedule.pricing?.[0];
                    const priceB = pB?.comparedPrice ?? pB?.price ?? Number.MAX_SAFE_INTEGER;
                    return priceA - priceB;
                });

                setGroupedCourses(groups);
                setTotalCount(groups.length);
            } catch (e: any) {
                if (e.name !== "AbortError") console.error("CompanySchedulesList:", e);
            } finally {
                setLoading(false);
            }
        })();
        return () => ctrl.abort();
    }, [companyId, location, locationLoading, courseImages]);

    return (
        <div id="schedules" className="space-y-6">
            <div className="flex flex-col gap-1">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">PROGRAMMES</p>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                    Courses offered here
                </h2>
                {!loading && (
                    <p className="text-sm text-slate-500 font-medium">
                        {groupedCourses.length} {groupedCourses.length === 1 ? "course" : "courses"} listed on SkillDeck.
                    </p>
                )}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[0, 1].map(i => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-95">
                            <div className="w-full h-44 bg-slate-100 animate-pulse shrink-0" />
                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div className="space-y-3">
                                    <div className="h-5 w-3/4 bg-slate-100 animate-pulse rounded" />
                                    <div className="h-4 w-1/2 bg-slate-100 animate-pulse rounded" />
                                </div>
                                <div className="space-y-3">
                                    <div className="h-8 w-1/3 bg-slate-100 animate-pulse rounded" />
                                    <div className="h-9 w-full bg-slate-100 animate-pulse rounded-lg" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : groupedCourses.length > 0 ? (
                <>
                    {/* Mobile Slider View */}
                    <div className="block md:hidden space-y-4">
                        {groupedCourses[mobileIndex] && (
                            <ScheduleCard
                                schedule={groupedCourses[mobileIndex].primarySchedule}
                                allBatches={groupedCourses[mobileIndex].allBatches}
                                showCompany={false}
                            />
                        )}

                        {groupedCourses.length > 1 && (
                            <div className="flex items-center justify-between bg-slate-50 border border-slate-200/60 rounded-xl p-2.5">
                                <button
                                    onClick={() => setMobileIndex(prev => (prev - 1 + groupedCourses.length) % groupedCourses.length)}
                                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-800 transition active:scale-95 cursor-pointer"
                                    aria-label="Previous course"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="text-xs font-bold text-slate-500">
                                    {mobileIndex + 1} of {groupedCourses.length} courses
                                </span>
                                <button
                                    onClick={() => setMobileIndex(prev => (prev + 1) % groupedCourses.length)}
                                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-800 transition active:scale-95 cursor-pointer"
                                    aria-label="Next course"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Desktop/Tablet Grid View */}
                    <div className="hidden md:grid md:grid-cols-2 gap-4">
                        {groupedCourses.map((group) => (
                            <ScheduleCard
                                key={group.primarySchedule.id}
                                schedule={group.primarySchedule}
                                allBatches={group.allBatches}
                                showCompany={false}
                            />
                        ))}
                    </div>

                    <Link
                        href={`/companies/schedules?tenantId=${companyId}`}
                        className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors text-sm mt-4"
                    >
                        View All Schedules <ArrowRight className="w-4 h-4" />
                    </Link>
                </>
            ) : (
                <div className="py-12 flex flex-col items-center text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <Calendar className="w-10 h-10 text-slate-300 mb-3" />
                    <h3 className="font-bold text-slate-800 mb-1">No Upcoming Schedules</h3>
                    <p className="text-slate-500 text-sm max-w-xs">Check back later or explore other providers.</p>
                    <Link href="/companies" className="mt-4 text-indigo-600 text-sm font-semibold hover:underline">
                        Browse other companies →
                    </Link>
                </div>
            )}
        </div>
    );
}
