"use client";

import SectionTag from "@/components/ui/SectionTag";
import { CheckCircle, Star, ThumbsUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Testimonial {
    _id: string;
    name: string;
    company?: string;
    message: string;
    rating: number;
    createdAt?: string;
    title?: string;
    helpfulCount?: number;
}

interface CourseTestimonialsProps {
    courseSlug: string;
}

const CardSkeleton = () => (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 space-y-4 shadow-sm animate-pulse">
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0" />
                <div className="space-y-2">
                    <div className="h-3 w-24 bg-slate-100 rounded" />
                    <div className="h-2 w-16 bg-slate-50 rounded" />
                </div>
            </div>
            <div className="h-3 w-12 bg-slate-100 rounded shrink-0" />
        </div>
        <div className="space-y-2 pt-2">
            <div className="h-3 w-1/3 bg-slate-100 rounded" />
            <div className="h-2.5 w-full bg-slate-100 rounded" />
            <div className="h-2.5 w-5/6 bg-slate-50 rounded" />
        </div>
    </div>
);

export default function CourseTestimonials({ courseSlug }: CourseTestimonialsProps) {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [stats, setStats] = useState({ avg: 0, totalCount: 0, distribution: [0, 0, 0, 0, 0] });
    const [loading, setLoading] = useState(true);
    // Separate from `loading`, which also covers paging. Until the first fetch
    // answers we do not know whether this course has reviews at all.
    const [initialLoaded, setInitialLoaded] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadReviews = async (page: number) => {
        try {
            const res = await fetch(`/api/testimonials?courseSlug=${courseSlug}&page=${page}&limit=3`);
            if (res.ok) {
                const payload = await res.json();
                if (payload && payload.data) {
                    setTestimonials(payload.data);
                    if (payload.meta) {
                        setTotalPages(payload.meta.pages || 1);
                    }
                }
            }
        } catch (error) {
            console.error("Error loading testimonials page:", error);
        }
    };

    const handlePageChange = async (newPage: number) => {
        setLoading(true);
        setCurrentPage(newPage);
        await loadReviews(newPage);
        setLoading(false);
    };

    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = containerRef.current;
        if (!el || isVisible) return;
        if (typeof IntersectionObserver === "undefined") {
            setIsVisible(true);
            return;
        }
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "400px 0px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible) return;
        const loadTestimonialsAndStats = async () => {
            try {
                const [reviewsRes, statsRes] = await Promise.all([
                    fetch(`/api/testimonials?courseSlug=${courseSlug}&page=1&limit=3`),
                    fetch(`/api/testimonials/stats?courseSlug=${courseSlug}`)
                ]);

                if (reviewsRes.ok) {
                    const payload = await reviewsRes.json();
                    if (payload && payload.data) {
                        setTestimonials(payload.data);
                        if (payload.meta) {
                            setTotalPages(payload.meta.pages || 1);
                        }
                    }
                }

                if (statsRes.ok) {
                    const statsPayload = await statsRes.json();
                    if (statsPayload) {
                        setStats(statsPayload);
                    }
                }
            } catch (error) {
                console.error("Error loading testimonials or stats:", error);
            } finally {
                setLoading(false);
                setInitialLoaded(true);
            }
        };
        loadTestimonialsAndStats();
    }, [courseSlug, isVisible]);

    // Render nothing but the observer target until the first fetch answers: the
    // full header plus skeletons used to appear and then vanish on courses with
    // no reviews, taking the section's nav entry with it. The element has to
    // stay in the DOM because IntersectionObserver watches it to trigger that
    // fetch in the first place.
    if (!initialLoaded) {
        return <div ref={containerRef} aria-hidden="true" className="h-0" />;
    }

    if (testimonials.length === 0) return null;

    return (
        <div ref={containerRef} className="space-y-6 md:pt-6">
            {/* Header */}
            <div className="space-y-2">
                <SectionTag text="Learner Reviews" />
                <h3 className="text-xl md:text-2xl font-black heading-Color tracking-tight">
                    What people said afterwards
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                    Only learners with a verified enrolment can leave a review.
                </p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

                {/* Left Side: Rating Summary Card */}
                <div className="md:col-span-4 bg-white border border-slate-100 rounded-2xl p-5 space-y-4 shadow-sm">
                    <div className="space-y-0">
                        <div className="flex items-baseline gap-2">
                            <span className="heading-section font-black text-[#101A3D]">{stats.avg}</span>
                            <div className="flex gap-0.5 text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-current shrink-0" />
                                ))}
                            </div>
                            <span className="text-xs text-right font-bold text-gray-500">{stats.avg}</span>
                        </div>
                        <p className="text-xs text-gray-400 font-normal">{stats.totalCount.toLocaleString()} verified reviews</p>
                    </div>

                    {/* Progress bars */}
                    <div className="space-y-2">
                        {stats.distribution.map((percentage, index) => {
                            const starNum = 5 - index;
                            return (
                                <div key={index} className="flex items-center gap-3 text-[11px] font-bold">
                                    <span className="text-gray-500 shrink-0 w-4">{starNum}★</span>
                                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-amber-500 transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-gray-500 shrink-0 w-8 text-right">{percentage}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Side: Stack of Review Cards */}
                <div className="md:col-span-8 space-y-4">
                    {loading ? (
                        <>
                            <CardSkeleton />
                            <CardSkeleton />
                            <CardSkeleton />
                        </>
                    ) : (
                        testimonials.map((review) => {
                            const initials = review.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

                            return (
                                <div
                                    key={review._id}
                                    className="bg-white border border-slate-100 rounded-2xl p-4 space-y-4 shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    {/* Card Header */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            {/* Avatar initials */}
                                            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center font-bold text-xs text-purple-600 shrink-0">
                                                {initials}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <h4 className="text-xs font-bold text-[#101A3D] truncate">{review.name}</h4>
                                                    <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10 shrink-0" />
                                                </div>
                                                {review.company && (
                                                    <p className="text-[10px] text-gray-400 font-medium truncate">{review.company}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Star Rating & Date */}
                                        <div className="text-right shrink-0">
                                            <div className="flex items-center gap-1 text-amber-500">
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-3 h-3 fill-current ${i < Math.round(review.rating) ? "text-amber-500" : "text-gray-200"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-500">{review.rating.toFixed(1)}</span>
                                            </div>
                                            {review.createdAt && (
                                                <span className="text-[9px] text-gray-400 font-medium">{review.createdAt}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Review content */}
                                    <div className="space-y-1.5">
                                        {review.title && (
                                            <h5 className="text-xs font-bold text-[#101A3D]">{review.title}</h5>
                                        )}
                                        <div
                                            className="text-[11px] text-gray-500 font-medium leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: review.message }}
                                        />
                                    </div>

                                    {/* Footer helpful count */}
                                    {review.helpfulCount && (
                                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold border-t border-slate-50 pt-3">
                                            <ThumbsUp className="w-3.5 h-3.5" />
                                            <span>Helpful ({review.helpfulCount})</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}

                    {/* Pagination Navigators */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 pt-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() => handlePageChange(page)}
                                    className={`w-7 h-7 rounded-full text-xs font-bold transition-all cursor-pointer ${page === currentPage
                                        ? "bg-purple-600 text-white"
                                        : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
