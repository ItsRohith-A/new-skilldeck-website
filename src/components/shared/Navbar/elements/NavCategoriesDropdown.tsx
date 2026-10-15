"use client";

import { MenuItem } from "@/components/ui/navbar-menu";
import { ArrowRight, BookOpen, ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Only the icon URL is sent (see getCategories); alt text is the course name.
interface CourseCardData {
    courseIcon?: {
        url?: string;
    };
}

interface CategoryCourse {
    slug: string;
    order?: number;
    course_name: string;
    courseCard?: CourseCardData;
}

interface CategoryWithCourses {
    _id: string;
    name: string;
    slug: string;
    courses: CategoryCourse[];
    order?: number;
}

export default function NavCategoriesDropdown({
    initialCategories = [],
    active,
    setActive
}: {
    initialCategories?: CategoryWithCourses[],
    active: string | null,
    setActive: (item: string | null) => void
}) {
    const [activeCategory, setActiveCategory] = useState<CategoryWithCourses | null>(null);
    const [loadingTarget, setLoadingTarget] = useState<string | null>(null);
    const pathname = usePathname();

    const sortedCategories = [...initialCategories].sort((a, b) => (a.order || 0) - (b.order || 0));

    useEffect(() => {
        if (sortedCategories.length > 0 && !activeCategory) {
            setActiveCategory(sortedCategories[0]);
        }
    }, [sortedCategories, activeCategory]);

    useEffect(() => {
        setLoadingTarget(null);
        setActive(null);
    }, [pathname, setActive]);

    const activeCourses = activeCategory?.courses || [];

    return (
        <MenuItem setActive={setActive} active={active} item="Courses" centered>
            <div className="w-[85vw] max-w-5xl h-[500px] bg-white rounded-xl overflow-hidden grid grid-cols-12 border border-slate-100 shadow-xl">
                {/* Left Sidebar: Categories */}
                <div className="col-span-12 lg:col-span-3 border-r border-slate-100 bg-slate-50/50 px-2 pt-4 pb-2 flex flex-col h-full">
                    <div className="px-2 pb-4 text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                        Browse by Domain
                    </div>

                    <div className="h-[430px] overflow-y-auto space-y-2 pr-2 pb-6 custom-scrollbar">
                        {sortedCategories.map((cat) => (
                            <button
                                key={cat._id}
                                onClick={() => setActiveCategory(cat)}
                                className={`w-full text-left px-2.5 py-2 rounded-lg text-[13px] font-semibold transition-all duration-300 flex items-center justify-between group cursor-pointer
                                ${activeCategory?._id === cat._id
                                        ? "bg-white shadow-sm text-black ring-1 ring-slate-200/60"
                                        : "text-slate-600 hover:bg-white hover:text-black/90"
                                    }
                            `}
                            >
                                <span className="truncate text-bold">{cat.name}</span>
                                <ChevronRight className={`w-3.5 h-3.5 transition-all duration-300 ${activeCategory?._id === cat._id
                                    ? "text-blue-600 translate-x-0 opacity-100"
                                    : "translate-x-[-4px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 text-slate-400"
                                    }`} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Content: Course Grid */}
                <div className="col-span-12 lg:col-span-9 bg-white overflow-y-auto custom-scrollbar flex flex-col h-full">
                    {activeCategory ? (
                        <div className="h-full flex flex-col">
                            {/* Sticky Header */}
                            <div className="sticky top-0 z-20 bg-white border-b border-slate-100 px-5 py-3.5 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                                        <BookOpen className="w-4.5 h-4.5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-base text-slate-900 leading-tight">
                                            {activeCategory.name}
                                        </h4>
                                        <p className="text-[11px] text-slate-500 mt-0.5">Explore our top-rated courses</p>
                                    </div>
                                </div>

                                <Link
                                    href={`/${activeCategory.slug}`}
                                    prefetch={false}
                                    onClick={() => setLoadingTarget(`explore-${activeCategory.slug}`)}
                                    className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] text-white text-[11px] font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all group shrink-0"
                                >
                                    Explore All
                                    {loadingTarget === `explore-${activeCategory.slug}` ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                    )}
                                </Link>
                            </div>

                            {/* Course List */}
                            <div className="px-5 py-3.5 flex-1 overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                    {activeCourses.length > 0 ? (
                                        [...activeCourses]
                                            .sort((a, b) => (a.order || 0) - (b.order || 0))
                                            .map((course, idx) => {
                                                const courseIconUrl = course.courseCard?.courseIcon?.url;
                                                const isImageUrl = courseIconUrl && (courseIconUrl.startsWith("http://") || courseIconUrl.startsWith("https://") || courseIconUrl.startsWith("/"));

                                                return (
                                                    <Link
                                                        key={course.slug || idx}
                                                        href={`/${activeCategory.slug}/${course.slug}`}
                                                        prefetch={false}
                                                        onClick={() => {
                                                            const targetPath = `/${activeCategory.slug}/${course.slug}`;
                                                            if (typeof window !== 'undefined' && window.location.pathname !== targetPath) {
                                                                setLoadingTarget(course.slug);
                                                            }
                                                        }}
                                                        className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 hover:shadow-sm transition-all duration-200 group"
                                                    >
                                                        <div
                                                            className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm border
                                                                ${isImageUrl ? 'bg-white border-slate-200 overflow-hidden p-1' : 'bg-blue-50 border-blue-100 text-blue-500'}`}
                                                        >
                                                            {isImageUrl ? (
                                                                <Image
                                                                    src={courseIconUrl || ""}
                                                                    alt={course.course_name}
                                                                    width={32}
                                                                    height={32}
                                                                    className="w-full h-full object-contain"
                                                                />
                                                            ) : (
                                                                <BookOpen className="w-4.5 h-4.5" aria-hidden="true" />
                                                            )}
                                                        </div>
                                                        <span className="text-[12px] text-slate-700 font-bold group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug flex-1">
                                                            {course.course_name}
                                                        </span>
                                                        <div className="shrink-0 flex items-center ml-1">
                                                            {loadingTarget === course.slug ? (
                                                                <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                                                            ) : (
                                                                <ArrowRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
                                                            )}
                                                        </div>
                                                    </Link>
                                                );
                                            })
                                    ) : (
                                        <div className="col-span-full h-full flex flex-col items-center justify-center py-20 text-slate-300">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                <BookOpen className="w-8 h-8 opacity-20" />
                                            </div>
                                            <p className="text-sm font-medium">Coming Soon</p>
                                            <p className="text-xs mt-1">We're currently curating new courses for this domain.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                            <div className="text-center">
                                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                <p>Select a domain to explore courses</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MenuItem>
    );
}
