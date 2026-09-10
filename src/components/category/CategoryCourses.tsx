"use client";

import { Course } from "@/types";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import CourseCard from "./courses/CourseCard";
import { bareCategoryName } from "@/lib/categoryName";

interface Meta {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

interface CategoryCoursesProps {
    categoryName: string;
    courses: Course[];
    meta: Meta;
    slug: string;
}

export default function CategoryCourses({ categoryName, courses: initialCourses, slug }: CategoryCoursesProps) {
    const ITEMS_PER_PAGE = 6;
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
    const [loadingMore, setLoadingMore] = useState(false);

    // Initial slice of first 6 courses
    const courses = initialCourses.slice(0, visibleCount);
    const hasMore = visibleCount < initialCourses.length;

    const handleLoadMore = () => {
        setLoadingMore(true);
        setTimeout(() => {
            setVisibleCount(prev => prev + ITEMS_PER_PAGE);
            setLoadingMore(false);
        }, 400);
    };

    if (!courses || courses.length === 0) return null;

    return (
        <section className="bg-white py-12 lg:py-20" id="course-list">
            <div className="container mx-auto px-4 lg:px-0">
                {/* Header */}
                <div className="mb-5 lg:mb-8 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-1.5 border border-blue-100/50 shadow-sm mb-4">
                        <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                        <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-widest">Available Programs</span>
                    </div>
                    <h2 className="text-lg md:text-xl lg:text-2xl font-black leading-tight text-slate-800 mb-4">
                        Explore {bareCategoryName(categoryName)} Courses
                    </h2>
                    <p className="text-xs md:text-sm text-slate-500 max-w-2xl font-medium leading-relaxed">
                        Choose from our top-rated, globally recognized certifications designed to accelerate your growth and expertise.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-5">
                    {[...courses]
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((course, index) => (
                            <CourseCard
                                key={course.slug || index}
                                course={course.courseCard}
                                slug={course.slug || ""}
                                title={course.course_name || course.course_title || ""}
                                categorySlug={course.category?.slug || slug}
                            />
                        ))}
                </div>

                {/* Pagination: Load More Button */}
                {hasMore && (
                    <div className="mt-16 text-center flex flex-col items-center gap-4">
                        <button
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="px-8 py-3.5 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-wider hover:bg-purple-600 transition-all duration-300 shadow-lg shadow-slate-900/10 hover:shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2.5 cursor-pointer"
                        >
                            {loadingMore ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                                    Loading...
                                </>
                            ) : (
                                "Load More Programs"
                            )}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
