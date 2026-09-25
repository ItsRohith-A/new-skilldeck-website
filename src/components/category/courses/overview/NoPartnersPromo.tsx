"use client";

import Link from "next/link";
import {
    ArrowRight,
    BadgeCheck,
    CalendarClock,
    Scale,
    Store,
    TrendingUp,
    Users,
} from "lucide-react";
import OpenModalButton from "@/components/ui/OpenModalButton";

interface NoPartnersPromoProps {
    /** Course subject, e.g. "Digital Marketing". */
    subject?: string;
    courseSlug?: string;
    courseTitle?: string;
}

const learnerPromises = [
    { icon: BadgeCheck, text: "Vetted institutes, not a directory dump" },
    { icon: Scale, text: "Fees, reviews and outcomes compared for you" },
    { icon: CalendarClock, text: "Batch dates the moment they open" },
];

const providerPromises = [
    { icon: Users, text: "Reach learners already searching for this course" },
    { icon: TrendingUp, text: "Bid for top placement in the marketplace" },
    { icon: ArrowRight, text: "Enquiries land straight in your CRM" },
];

/**
 * Fills the training-partners section when no institute has listed this course.
 *
 * Two audiences land on an empty course page and the section was simply blank
 * for both: a learner who still wants the course, and a training company that
 * could be the one listing it.
 */
export default function NoPartnersPromo({
    subject,
    courseSlug,
    courseTitle,
}: NoPartnersPromoProps) {
    const label = subject ? `${subject} ` : "";

    return (
        <div className="grid md:grid-cols-2 gap-5">
            {/* ── Learners ── */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col gap-4">
                <span className="inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black tracking-wider uppercase bg-purple-50 border border-purple-100 text-[#5544CC]">
                    For students
                </span>

                <div className="flex flex-col gap-2">
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
                        We promise you the best {label}courses from the right training companies
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Leave the headache of finding the right institute to us. Tell us what you
                        need and we come back with providers worth your money — their fees,
                        reviews, trainers and batch dates lined up side by side.
                    </p>
                </div>

                <ul className="flex flex-col gap-2.5">
                    {learnerPromises.map(({ icon: Icon, text }) => (
                        <li key={text} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-600 leading-relaxed">
                            <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-brand-primary/10 flex items-center justify-center">
                                <Icon className="w-3 h-3 text-brand-primary" />
                            </span>
                            <span>{text}</span>
                        </li>
                    ))}
                </ul>

                <div className="flex flex-wrap items-center gap-3 mt-auto pt-2">
                    <OpenModalButton
                        variant="primary"
                        size="sm"
                        className="rounded-xl font-bold"
                        config={{
                            source: `course-no-partners:${courseSlug || "unknown"}`,
                            formTitle: "Find me the right institute",
                            formDescription:
                                "Tell us what you are looking for and we will come back with providers, fees and batch dates.",
                            courseSlug,
                            showDemoOption: false,
                        }}
                    >
                        Get recommendations
                        <ArrowRight className="w-3.5 h-3.5" />
                    </OpenModalButton>

                    <Link
                        href="/companies"
                        className="text-xs font-bold text-brand-primary hover:underline"
                    >
                        Browse all institutes
                    </Link>
                </div>
            </div>

            {/* ── Training companies ── */}
            <div className="relative overflow-hidden rounded-2xl bg-brand-dark p-6 flex flex-col gap-4">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-20 -right-12 w-64 h-64 rounded-full bg-brand-primary/30 blur-[80px]" />
                    <div className="absolute -bottom-24 -left-10 w-64 h-64 rounded-full bg-brand-secondary/20 blur-[80px]" />
                </div>

                <div className="relative flex flex-col gap-4 h-full">
                    <span className="inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black tracking-wider uppercase bg-white/10 text-white">
                        <Store className="w-3 h-3" />
                        For training companies
                    </span>

                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg md:text-xl font-bold text-white leading-snug">
                            Runing a training institute ? Be the first to list your batches
                        </h3>
                        <p className="text-sm text-white/70 leading-relaxed">
                            Publish your schedules on the SkillDeck marketplace and put them in
                            front of the learners already on this page looking for this course.
                        </p>
                    </div>

                    <ul className="flex flex-col gap-2.5">
                        {providerPromises.map(({ icon: Icon, text }) => (
                            <li key={text} className="flex items-start gap-2.5 text-xs md:text-sm text-white/75 leading-relaxed">
                                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                                    <Icon className="w-3 h-3 text-white" />
                                </span>
                                <span>{text}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="flex flex-wrap items-center gap-3 mt-auto pt-2">
                        <Link
                            href="/register"
                            rel="nofollow"
                            className="inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-xl bg-white text-xs font-bold text-brand-dark hover:bg-white/90 transition-colors"
                        >
                            List your schedules
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <span className="text-[11px] text-white/60">No listing fee to start</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
