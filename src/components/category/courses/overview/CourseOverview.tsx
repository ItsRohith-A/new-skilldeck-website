"use client";

import { useSchedules } from "@/context/SchedulesContext";
import { OverviewProps } from "@/types";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import CourseCheckoutCard from "../CourseCheckoutCard";
import { OverviewHeader } from "./OverviewHeader";
import CourseSectionsNav, { SectionLink } from "./CourseSectionsNav";

// Eagerly loaded (above-fold / critical path)
import CourseSyllabus from "../CourseSyllabus";
import KeyFeatures from "./KeyFeatures";
import { SkillsFocused } from "./SkillsFocused";
import { TargetAudience } from "./TargetAudience";

// Lazy-loaded (below-fold) — split into separate chunks to reduce initial JS bundle
const ToolsAndSkills = dynamic(() => import("./ToolsAndSkills"));
const CourseTrainers = dynamic(() => import("./CourseTrainers"));
const CourseCareer = dynamic(() => import("./CourseCareer"));
const CoursePlacements = dynamic(() => import("./CoursePlacements"));
const CourseSalaries = dynamic(() => import("./CourseSalaries"));
const CourseBenefits = dynamic(() => import("./CourseBenefits"));
const CourseTestimonials = dynamic(() => import("./CourseTestimonials"));
const CourseFAQ = dynamic(() => import("./CourseFAQ"));

export default function CourseOverview({ data, courseSlug, courseName }: OverviewProps) {
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

    const { schedules, tenants, loading } = useSchedules(courseSlug);

    const handleCompanySelect = useCallback((id: string) => {
        setSelectedCompanyId(id);
    }, []);

    const overview = data?.overview_content || data;

    // Dynamically assemble available sections
    const navSections = useMemo<SectionLink[]>(() => {
        if (!data) return [];
        const items: SectionLink[] = [
            { id: "overview", label: "Overview" },
        ];

        if (data.syllabus_content) {
            items.push({ id: "syllabus", label: "Syllabus" });
        }
        if (data.tools || data.skills) {
            items.push({ id: "tools-skills", label: "Tools & Skills" });
        }
        if (data.trainers && data.trainers.length > 0) {
            items.push({ id: "trainers", label: "Trainers" });
        }
        if (data.career) {
            items.push({ id: "career", label: "Career Path" });
        }
        if (data.placements) {
            items.push({ id: "placements", label: "Placements" });
        }
        if (data.salaries && data.salaries.length > 0) {
            items.push({ id: "salaries", label: "Salaries" });
        }
        if (overview?.benefits || data.benefits) {
            items.push({ id: "benefits", label: "Benefits" });
        }
        items.push({ id: "reviews", label: "Reviews" });
        if (data.faqs && data.faqs.length > 0) {
            items.push({ id: "faqs", label: "FAQs" });
        }

        return items;
    }, [data, overview]);

    if (!data) return null;

    return (
        <section id="course-overview" className="relative py-10">
            {/* Floating Left Sections Navigation */}
            <CourseSectionsNav sections={navSections} />

            <div className="container mx-auto px-4 lg:px-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
                    {/* Left details column */}
                    <div className="lg:col-span-2 space-y-10">
                        <div id="overview" className="scroll-mt-24">
                            <OverviewHeader
                                title={overview.overview_title || ""}
                                description={overview.overview_description || ""}
                                stats={overview.stats || []}
                            />
                        </div>

                        {overview.skillfocused && (
                            <SkillsFocused skills={overview.skillfocused} />
                        )}

                        {(overview.overview_who_can_attend?.roles || overview.prerequisites) && (
                            <TargetAudience
                                whoCanAttend={overview.overview_who_can_attend}
                                prerequisites={overview.prerequisites}
                            />
                        )}

                        {overview.overview_key_features && (
                            <KeyFeatures features={overview.overview_key_features} />
                        )}

                        {data.syllabus_content && (
                            <div id="syllabus" className="scroll-mt-24">
                                <CourseSyllabus data={data.syllabus_content} />
                            </div>
                        )}

                        {(data.tools || data.skills) && (
                            <div id="tools-skills" className="scroll-mt-24">
                                <ToolsAndSkills tools={data.tools} skills={data.skills} />
                            </div>
                        )}

                        {data.trainers && data.trainers.length > 0 && (
                            <div id="trainers" className="scroll-mt-24">
                                <CourseTrainers trainers={data.trainers} />
                            </div>
                        )}

                        {data.career && (
                            <div id="career" className="scroll-mt-24">
                                <CourseCareer data={data.career} />
                            </div>
                        )}

                        {data.placements && (
                            <div id="placements" className="scroll-mt-24">
                                <CoursePlacements placements={data.placements} />
                            </div>
                        )}

                        {data.salaries && data.salaries.length > 0 && (
                            <div id="salaries" className="scroll-mt-24">
                                <CourseSalaries salaries={data.salaries} />
                            </div>
                        )}

                        {(overview.benefits || data.benefits) && (
                            <div id="benefits" className="scroll-mt-24">
                                <CourseBenefits benefits={overview.benefits || data.benefits} />
                            </div>
                        )}

                        <div id="reviews" className="scroll-mt-24">
                            <CourseTestimonials courseSlug={courseSlug} />
                        </div>

                        {data.faqs && data.faqs.length > 0 && (
                            <div id="faqs" className="scroll-mt-24">
                                <CourseFAQ items={data.faqs} />
                            </div>
                        )}
                    </div>

                    {/* Right checkout column */}
                    <div className="lg:col-span-1 hidden md:flex justify-center lg:justify-end lg:sticky lg:top-24 h-fit">
                        <CourseCheckoutCard
                            schedules={schedules || []}
                            tenants={tenants || []}
                            courseSlug={courseSlug}
                            selectedCompanyId={selectedCompanyId}
                            onCompanySelect={handleCompanySelect}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
