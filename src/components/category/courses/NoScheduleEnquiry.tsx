"use client";

import Link from "next/link";
import { CalendarClock } from "lucide-react";
import GenericForm from "@/components/Forms/GenericForm";

interface NoScheduleEnquiryProps {
    courseSlug: string;
    courseTitle?: string;
    className?: string;
}

/**
 * Shown in place of the pricing card when a course has no listed batches.
 *
 * The old empty state was a blurred dummy price card with a "list your
 * institute" CTA — nothing a learner landing here could act on. This captures
 * their enquiry instead, and keeps the provider CTA as a footnote; the full
 * pitch to both audiences lives in NoPartnersPromo, down in the partners
 * section.
 */
export default function NoScheduleEnquiry({
    courseSlug,
    courseTitle,
    className = "",
}: NoScheduleEnquiryProps) {
    return (
        <div
            className={`w-full bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-4 ${className}`}
        >
            <div className="flex flex-col gap-2">
                <span className="inline-flex self-start items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
                    <CalendarClock className="w-3 h-3" />
                    Get the Best Quote
                </span>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                    Suggest Me The Best Institute!
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                    Get the course fee, Syllabus, Benefits, duration, and Placement records of various training providers.
                </p>
            </div>

            <GenericForm
                formtype="enquiry"
                title=""
                description=""
                formId={`no-schedule-${courseSlug}`}
                courseSlug={courseSlug}
                selectedCourse={courseTitle}
                showDemoOption={false}
            />

            <p className="text-[11px] text-slate-500 text-center border-t border-slate-100 pt-3">
                Run a training institute?{" "}
                <Link href="/register" className="font-semibold text-brand-primary hover:underline">
                    List your batches
                </Link>
            </p>
        </div>
    );
}
