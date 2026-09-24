"use client";

import Breadcrumb from "@/components/ui/Breadcrumb";
import ComparisonProof from "@/components/shared/ComparisonProof";
import { Button } from "@/components/ui/Button";
import { useSchedules } from "@/context/SchedulesContext";
import type { CourseHeroData } from "@/types/hero";
import { ArrowRight, Clock, Flame, GraduationCap, Sparkles, Tv } from "lucide-react";
import { useState } from "react";
import CourseHeroSeal from "./CourseHeroSeal";
import HeroLeadForm from "./HeroLeadForm";
import {
    AttrPill,
    StatBox,
    buildCourseBreadcrumb,
    parseKeypoints,
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

    const breadcrumbItems = buildCourseBreadcrumb(course, courseSlug, locationSlug);
    const keypoints = parseKeypoints(banner_content?.keypoints);

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
                                href={`/compare?type=companies&course=${encodeURIComponent(courseSlug)}${locationSlug ? `&city=${encodeURIComponent(locationSlug)}` : ""}`}
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
                    <div className="lg:col-span-4 mt-6 lg:mt-0 relative">
                        {/* Trust seal, picked per course, overlapping the card corner */}
                        <CourseHeroSeal
                            seed={courseSlug}
                            className="absolute -top-7 -right-3 md:-top-10 md:-right-6 z-20 animate-seal-bob"
                        />

                        {/* Lead form: the enquiry is routed to the institute the
                            visitor picks, or to the platform when nobody has
                            listed a batch for this course. */}
                        <HeroLeadForm
                            courseSlug={courseSlug}
                            courseTitle={course.course_title}
                            schedules={schedules ?? []}
                            tenants={tenants ?? []}
                            loading={schedulesLoading}
                        />
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

