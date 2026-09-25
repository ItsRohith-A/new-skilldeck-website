import { CourseCardData } from "@/types";
import { ArrowRight, Clock, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CourseCardProps {
    course: CourseCardData;
    title: string;
    slug: string;
    categorySlug?: string;
}

export default function CourseCard({ course, title, slug, categorySlug }: CourseCardProps) {
    const imageUrl = course.courseThumbnail?.url || course.courseThumbnail?.thumbnail || "";

    return (
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm hover:shadow-xl hover:border-purple-500/10 transition-all duration-500 flex flex-col group overflow-hidden h-full">
            {/* Thumbnail */}
            <div className="relative h-48 w-full rounded-xl overflow-hidden mb-3 bg-slate-50 flex-shrink-0">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={course.courseThumbnail?.alt || title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        // Thumbnails are mostly square badges/logos; cover cropped them
                        // into a zoomed-in strip, so fit the whole image instead.
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100">
                        <span className="text-xs font-semibold">No Preview Image</span>
                    </div>
                )}
                {/* Overlay Badge */}
                {course.courseTag && (
                    <div className="absolute top-3 left-3 z-10">
                        <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-white rounded-lg shadow-sm border border-white/10">
                            {course.courseTag}
                        </span>
                    </div>
                )}
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 mb-1">
                {course.courseMode && (
                    <span className="bg-purple-50 text-purple-600 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border border-purple-100">
                        {course.courseMode}
                    </span>
                )}
                {course.courseType && (
                    <span className="bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border border-blue-100">
                        {course.courseType}
                    </span>
                )}
            </div>

            {/* Title */}
            <h3 className="text-base md:text-lg font-bold text-slate-800 mb-2 leading-snug line-clamp-2 min-h-auto group-hover:text-purple-600 transition-colors duration-300">
                {title}
            </h3>

            {/* Tagline */}
            {course.tagline && (
                <p className="text-xs text-slate-400 font-medium leading-relaxed mb-1 line-clamp-2">
                    {course.tagline}
                </p>
            )}

            {/* Stats row */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold border-t border-slate-50 pt-4 mb-6">
                <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-purple-500/70" />
                    <span>{course.totalEnrolled || '0'} Learners</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-purple-500/70" />
                    <span>{course.courseDuration || 'N/A'}</span>
                </div>
            </div>

            {/* Buttons */}
            <div className="mt-auto grid grid-cols-2 gap-3.5">
                <Link href={`/${categorySlug}/${slug}`} className="w-full">
                    <button className="w-full bg-slate-900 text-white py-3 rounded-full text-xs font-black uppercase tracking-wider hover:bg-purple-600 transition-all duration-300 cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-slate-900/5 group/btn">
                        Learn
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                </Link>
                <Link href={`/${categorySlug}/${slug}/#institute-schedules`} className="w-full">
                    <button className="w-full bg-transparent border border-slate-200 text-slate-700 py-3 rounded-full text-xs font-black uppercase tracking-wider hover:border-slate-800 hover:text-slate-900 transition-all duration-300 cursor-pointer">
                        Schedules
                    </button>
                </Link>
            </div>
        </div>
    );
}
