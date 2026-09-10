"use client";

import CompanyContactButton from "@/components/companies/CompanyContactButton";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ComparisonProof from "@/components/shared/ComparisonProof";
import { Button } from "@/components/ui/Button";
import { useSchedules } from "@/context/SchedulesContext";
import type { CourseHeroData } from "@/types/hero";
import { ArrowRight, Calendar, Clock, Flame, GraduationCap, Sparkles, Tv, BadgeCheck } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import CourseHeroCard, { CourseHeroCardSkeleton } from "./CourseHeroCard";
import {
    AttrPill,
    StatBox,
    buildCourseBreadcrumb,
    computeAvgRating,
    parseKeypoints,
    pickFeaturedSchedule,
} from "./CourseHeroParts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CourseHeroProps {
    course: CourseHeroData;
    courseSlug: string;
    locationSlug?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CourseHero({ course, courseSlug, locationSlug }: CourseHeroProps) {
    const { courseCard, banner_content } = course;
    const [isExpanded, setIsExpanded] = useState(false);

    // ── Data ──
    const { schedules, tenants, loading: schedulesLoading } = useSchedules(courseSlug);

    const topPick = useMemo(
        () => (schedulesLoading || !schedules ? null : pickFeaturedSchedule(schedules, tenants ?? [])),
        [schedules, tenants, schedulesLoading]
    );

    const breadcrumbItems = buildCourseBreadcrumb(course, courseSlug, locationSlug);
    const keypoints = parseKeypoints(banner_content?.keypoints);

    const avgRating = useMemo(
        () => computeAvgRating(course.trainers, course.aggregateRating),
        [course.trainers, course.aggregateRating]
    );

    const reviewCount =
        course.aggregateRating?.reviewCount ||
        Number(courseCard?.totalEnrolled) ||
        1284;

    // ── Checklist split into two columns ──
    const visiblePoints = isExpanded ? keypoints : keypoints.slice(0, 4);
    const colBreak = Math.ceil(visiblePoints.length / 2);
    const col1 = visiblePoints.slice(0, colBreak);
    const col2 = visiblePoints.slice(colBreak);
    const hiddenCount = keypoints.length - 4;

    return (
        <section className="relative bg-white pt-20 md:pt-20 pb-10 lg:pt-28 lg:pb-6 overflow-hidden">
            {/* Subtle right-side background tint */}
            <div
                aria-hidden="true"
                className="absolute top-0 right-0 w-1/2 h-full bg-[#F9FAFB] -skew-x-6 translate-x-1/4 -z-10"
            />

            <div className="container mx-auto px-4 lg:px-0 lg:space-y-14">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

                    {/* ───────────── LEFT COLUMN ───────────── */}
                    <div className="lg:col-span-8 space-y-4">

                        {/* Breadcrumb */}
                        <Breadcrumb items={breadcrumbItems} />

                        {/* Trending / Editors' pick badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 text-[10px] 2xl:text-xs font-semibold text-[#A81E4D] bg-[#A81E4D]/10 px-3 py-1 rounded-full">
                                <Flame className="w-3.5 h-3.5" aria-hidden="true" />
                                Trending course
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-[10px] 2xl:text-xs font-semibold text-[#A85F06] bg-[#A85F06]/10 px-3 py-1 rounded-full">
                                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                                Editors&apos; pick
                            </span>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <h1 className="text-2xl md:text-3xl font-extrabold text-[#101A3D] leading-[1.15] tracking-tight">
                                {course.course_title}
                            </h1>

                            {/* Tagline / description */}
                            {(course.tagline || banner_content?.description) && (
                                <div
                                    className="body-small text-gray-600 max-w-2xl leading-relaxed text-justify"
                                    dangerouslySetInnerHTML={{
                                        __html: course.tagline || banner_content?.description || "",
                                    }}
                                />
                            )}
                        </div>

                        {/* Attribute pills */}
                        <div className="flex flex-wrap gap-2 md:gap-5">
                            <AttrPill
                                icon={<Clock className="w-4 h-4" aria-hidden="true" />}
                                label={courseCard?.courseDuration || "Duration"}
                                sublabel="Duration"
                                iconClassName="bg-pink-100 text-pink-500"
                            />
                            <AttrPill
                                icon={<GraduationCap className="w-4 h-4" aria-hidden="true" />}
                                label={courseCard?.courseType || "Job Oriented"}
                                sublabel="Training"
                                iconClassName="bg-blue-100 text-blue-600"
                            />
                            <AttrPill
                                icon={<Tv className="w-4 h-4" aria-hidden="true" />}
                                label={courseCard?.courseMode || "Online / Blended"}
                                sublabel="Learning mode"
                                iconClassName="bg-purple-100 text-purple-500"
                            />
                        </div>

                        {/* Keypoints — 2-column bordered checklist */}
                        {keypoints.length > 0 && (
                            <div className="border w-full md:w-fit border-gray-200 rounded-xl p-3 bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-2">
                                    {col1.map((point, i) => (
                                        <CheckItem key={`c1-${i}`} text={point} />
                                    ))}
                                    {col2.map((point, i) => (
                                        <CheckItem key={`c2-${i}`} text={point} />
                                    ))}
                                </div>

                                {!isExpanded && hiddenCount > 0 && (
                                    <button
                                        onClick={() => setIsExpanded(true)}
                                        className="mt-2 text-[#5544CC] text-[11px] 2xl:text-xs font-semibold flex items-center gap-1 hover:underline"
                                        aria-expanded={false}
                                    >
                                        + {hiddenCount} more points
                                        <ArrowRight className="w-3 h-3" aria-hidden="true" />
                                    </button>
                                )}
                                {isExpanded && (
                                    <button
                                        onClick={() => setIsExpanded(false)}
                                        className="text-[#5544CC] text-[11px] 2xl:text-xs font-semibold flex items-center gap-1 hover:underline"
                                        aria-expanded={true}
                                    >
                                        Show less
                                        <ArrowRight className="w-3 h-3 -rotate-90" aria-hidden="true" />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* CTA buttons */}
                        <div className="flex flex-row justify-around md:justify-start items-center gap-3 pt-1">
                            <Button
                                as="a"
                                href="#course-overview"
                                variant="primary"
                                size="lg"
                                className="h-12 px-4 md:px-8 rounded-xl shadow-lg shadow-purple-600/10 text-sm font-bold"
                            >
                                Start learning now
                            </Button>
                            <Button
                                as="a"
                                href={`/compare?type=companies&course=${encodeURIComponent(courseSlug)}`}
                                variant="outline"
                                size="lg"
                                className="h-12 px-3 md:px-6 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:border-gray-500 hover:bg-gray-50 transition-all hover:text-gray-900 gap-2"
                            >
                                Compare institutes
                                <ArrowRight className="w-4 h-4" aria-hidden="true" />
                            </Button>
                        </div>

                        {/* Comparison outcomes — the reason to compare before enrolling. */}
                        <ComparisonProof className="mt-5" />
                    </div>

                    {/* ───────────── RIGHT COLUMN ───────────── */}
                    <div className="lg:col-span-4 mt-6 lg:mt-0">
                        <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/60 border border-gray-200 overflow-hidden">

                            {/* Loading skeleton */}
                            {schedulesLoading && <CourseHeroCardSkeleton />}

                            {/* Featured schedule card */}
                            {!schedulesLoading && topPick && (
                                <CompanyContactButton
                                    tenantId={topPick.tenantId}
                                    companyName={topPick.tenant?.name}
                                    courseId={courseSlug}
                                    courseTitle={course.course_title}
                                    renderButton={(onClick) => (
                                        <CourseHeroCard
                                            schedule={topPick}
                                            courseThumbnail={courseCard?.courseThumbnail}
                                            avgRating={avgRating}
                                            reviewCount={reviewCount}
                                            onCallbackClick={onClick}
                                        />
                                    )}
                                />
                            )}

                            {/* No featured pick — blurred placeholder + list CTA */}
                            {!schedulesLoading && !topPick && (
                                <NoPickFallback />
                            )}
                        </div>
                    </div>

                </div>

                {/* Full-width dark blue stats strip at the bottom of the hero */}
                {(banner_content?.stats?.length ?? 0) > 0 && (
                    <div className=" mt-10 lg:mt-0 bg-[linear-gradient(135deg,rgba(36,23,100,1)_0%,rgba(1,11,48,1)_100%)] rounded-2xl p-4 md:p-8 flex flex-wrap items-center justify-around gap-2 shadow-xl">
                        {banner_content!.stats!.map((stat, i) => (
                            <div key={i} className="flex-1 md:min-w-[150px] flex justify-center">
                                <div className="w-full md:max-w-[200px]">
                                    <StatBox value={stat.value} label={stat.title} icon={stat.icon} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

// Dummy marker to allow replacement target matching

// ─── Small sub-components ────────────────────────────────────────────────────

function CheckItem({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-2 text-[13px] text-gray-700">
            <div
                aria-hidden="true"
                className="mt-0.5 w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"
            >
                <svg viewBox="0 0 12 12" className="w-3.5 h-3.5 p-0.5 border border-brand-primary rounded-full text-brand-primary" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <polyline points="2,6 5,9 10,3" />
                </svg>
            </div>
            {text}
        </div>
    );
}

function NoPickFallback() {
    return (
        <div className="relative w-full overflow-hidden rounded-2xl">
            {/* ── Real card design with dummy data (blurred) ── */}
            <div className="bg-white rounded-2xl p-4 space-y-3 pointer-events-none select-none">
                {/* Badges */}
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
                        <Flame className="w-3 h-3" />
                        Fast filling
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                        <Sparkles className="w-3 h-3" />
                        Recommended
                    </span>
                </div>

                {/* Provider */}
                <div className="flex items-center gap-3">
                    <div className="min-w-0">
                        <div className="text-sm font-semibold text-[#111827] flex items-center gap-1.5 truncate">
                            Top Training Institute
                            <BadgeCheck className="w-4.5 h-4.5 text-[#3b82f6] flex-shrink-0" />
                        </div>
                        <div className="text-[11px] text-gray-400">Reserve your seat for the upcoming batch</div>
                    </div>
                </div>

                {/* Banner image — schedule_loading.png */}
                <div className="overflow-hidden ">
                    <Image
                        src="/heroSection/schedule_loading.jpeg"
                        alt="Upcoming batch schedule"
                        width={352}
                        height={188}
                        className="w-full h-auto object-cover max-h-[188px] rounded-lg"
                        loading="eager"
                    />
                </div>

                {/* Start date + Programme fee */}
                <div className="flex justify-center items-center gap-6 ">
                    <div className="flex items-start gap-3 w-fit">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Calendar className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-400 font-medium">Start date</div>
                            <div className="text-xs font-bold text-[#0F172A]">15 Sep 2025</div>
                        </div>
                    </div>
                    <div className="w-0.5 h-8 bg-slate-200" />
                    <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[10px] text-gray-400 font-medium">Programme fee</span>
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full">Save 20%</span>
                        </div>
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="text-sm font-bold text-[#0F172A]">$1,999</span>
                            <span className="text-xs text-gray-400 line-through">$2,499</span>
                        </div>
                    </div>
                </div>

                {/* Mode / Sessions / Days */}
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { label: "Mode", value: "Online" },
                        { label: "Sessions", value: "48" },
                        { label: "Days", value: "Weekdays" },
                    ].map(({ label, value }) => (
                        <div key={label} className="flex flex-col items-center justify-center bg-gray-50 rounded-xl py-2 px-1 border border-gray-100 text-center">
                            <div className="text-[9px] uppercase tracking-wide font-semibold text-gray-400 mb-0.5">{label}</div>
                            <span className="text-xs capitalize font-bold text-[#111827]">{value}</span>
                        </div>
                    ))}
                </div>

                {/* Ratings */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                        <Image src="/companyLogos/google.png" alt="Google" width={20} height={20} className="w-5 h-5 flex-shrink-0 object-contain" />
                        <div>
                            <div className="flex items-center gap-1">
                                <svg className="w-3 h-3 text-yellow-400 fill-yellow-400" viewBox="0 0 12 12"><path d="M6 1l1.5 3h3l-2.5 1.8 1 3L6 7.2 3 8.8l1-3L1.5 4h3z" /></svg>
                                <span className="text-xs font-bold text-[#111827]">4.8/5</span>
                            </div>
                            <div className="text-[10px] text-gray-400">1,284+ reviewed</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-emerald-500 rounded flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-white fill-white" viewBox="0 0 12 12"><path d="M6 1l1.5 3h3l-2.5 1.8 1 3L6 7.2 3 8.8l1-3L1.5 4h3z" /></svg>
                        </div>
                        <div>
                            <div className="flex items-center gap-1">
                                <svg className="w-3 h-3 text-yellow-400 fill-yellow-400" viewBox="0 0 12 12"><path d="M6 1l1.5 3h3l-2.5 1.8 1 3L6 7.2 3 8.8l1-3L1.5 4h3z" /></svg>
                                <span className="text-xs font-bold text-[#111827]">4.8/5</span>
                            </div>
                            <div className="text-[10px] text-gray-400">1,284+ reviewed</div>
                        </div>
                    </div>
                </div>

                {/* CTA button (dummy) */}
                <Button
                    variant="primary"
                    className="w-full h-11 text-sm font-semibold"
                >
                    Get a call back
                </Button>
            </div>

            {/* ── Glassy blur overlay with CTA ── */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1.1px] flex flex-col items-center justify-center gap-4 p-6 text-center rounded-2xl">
                <div className="bg-white/70 backdrop-blur-xl border border-white/60 ring-1 ring-purple-100/60 rounded-2xl px-6 py-5 shadow-2xl shadow-purple-200/30 flex flex-col items-center gap-3 max-w-[240px]">
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                        Currently no schedules are listed. Be the first provider!
                    </p>
                    <Button
                        as="a"
                        href="/register"
                        variant="primary"
                        size="sm"
                        className="inline-flex items-center gap-2 py-2.5 px-5 text-white font-bold text-xs shadow-lg transition-all"
                    >
                        List your Institute now!
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Button>
                </div>
            </div>

        </div>
    );
}
