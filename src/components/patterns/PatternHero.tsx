"use client";

import Image from 'next/image';
import { useState } from 'react';
import { BookOpen, Share2, Check, ArrowUpRight, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { useLeadModal } from "@/components/Forms/LeadModalContext";

interface PatternHeroProps {
    data: {
        title: string;
        smallDescription: string;
        photo?: {
            url: string;
            alt: string;
        };
        createdAt?: string;
    };
    courseTitle?: string;
    patternSlug?: string;
}

export default function PatternHero({ data, courseTitle, patternSlug }: PatternHeroProps) {
    const { openModal } = useLeadModal();
    const [copied, setCopied] = useState(false);
    const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

    const handleShare = async () => {
        if (typeof window !== 'undefined') {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: data.title,
                        text: data.smallDescription,
                        url: window.location.href,
                    });
                    return;
                } catch {
                    // fall back to clipboard
                }
            }
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // 3D card effect calculations on mouse move
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const box = card.getBoundingClientRect();
        const x = e.clientX - box.left - box.width / 2;
        const y = e.clientY - box.top - box.height / 2;
        setMouseCoords({ x: x / 15, y: -y / 15 });
    };

    const handleMouseLeave = () => {
        setMouseCoords({ x: 0, y: 0 });
    };

    const readingTime = useMemoReadingTime(data.smallDescription);

    return (
        <section className="relative bg-white pt-20 pb-12 lg:pt-28 lg:pb-16 overflow-hidden border-b border-slate-100">
            {/* Soft decorative background gradient circles */}
            <div className="absolute bottom-0 left-0 w-100 h-100 bg-brand-secondary/5 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 -z-10" />

            {/* Right-side dark background split */}
            <div
                aria-hidden="true"
                className="absolute top-0 right-0 w-1/2 h-full bg-[#0B0F19] -z-20 hidden lg:block"
            />
            {/* Glow circles behind the right column card */}
            <div className="absolute top-12 right-12 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none hidden lg:block" />
            <div className="absolute bottom-12 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none hidden lg:block" />

            <div className="container mx-auto px-4 lg:px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

                    {/* Left Column - Content */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* Upper Badges & Info Row */}
                        <div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold text-slate-500">
                            {courseTitle && (
                                <>
                                    <span>Part of {courseTitle}</span>
                                    <span className="text-slate-300">•</span>
                                </>
                            )}
                            <span className="flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                                {readingTime}
                            </span>
                        </div>

                        {/* Interactive Page Heading */}
                        <div className="space-y-4">
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-[#101A3D] leading-[1.1] tracking-tight">
                                {data.title}
                            </h1>
                            <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-2xl font-medium">
                                {data.smallDescription}
                            </p>
                        </div>

                        {/* Interactive Actions Grid */}
                        <div className="flex flex-wrap items-center gap-3 pt-4">
                            <Button
                                variant="outline-primary"
                                size="lg"
                                className="rounded-full font-bold"
                                onClick={() => {
                                    const contentEl = document.querySelector('article');
                                    if (contentEl) {
                                        contentEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                }}
                            >
                                Start reading
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>

                            <Button
                                onClick={() =>
                                    openModal({
                                        source: "pattern-hero",
                                        formTitle: courseTitle
                                            ? `Book a Demo - ${courseTitle}`
                                            : "Book a Demo with Skilldeck",
                                        defaultValues: {
                                            selectedCourse: courseTitle || data.title,
                                            pagePath: typeof window !== "undefined" ? window.location.pathname : (patternSlug ? `/info/${patternSlug}` : undefined),
                                        },
                                    })
                                }
                                variant="primary"
                                size="lg"
                                className="rounded-full font-bold"
                            >
                                Book My Free Demo
                                <ArrowUpRight className="w-4 h-4" />
                            </Button>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={handleShare}
                                    title={copied ? "Link Copied!" : "Share guide"}
                                    aria-label={copied ? "Link Copied!" : "Share guide"}
                                    className="flex items-center justify-center w-12 h-12 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
                                >
                                    {copied ? (
                                        <Check className="w-5 h-5 text-emerald-600" />
                                    ) : (
                                        <Share2 className="w-5 h-5 text-slate-600" />
                                    )}
                                </button>
                                {copied && (
                                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2.5 py-1 text-[11px] font-semibold text-white bg-slate-900 rounded-md shadow-lg whitespace-nowrap pointer-events-none z-20">
                                        Link copied!
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - 3D Hover Interactive Card */}
                    {data.photo?.url && (
                        <div className="lg:col-span-5 flex justify-center py-4 relative">
                            <div
                                className="relative w-full max-w-120 aspect-[16/10] overflow-hidden rounded-2xl cursor-pointer transition-transform duration-150 ease-out bg-slate-900 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.5)] border border-slate-800 lg:border-white/10"
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                                style={{
                                    transform: `perspective(1000px) rotateX(${mouseCoords.y}deg) rotateY(${mouseCoords.x}deg)`,
                                    transformStyle: 'preserve-3d'
                                }}
                            >
                                <Image
                                    src={data.photo.url}
                                    alt={data.photo.alt || data.title}
                                    fill
                                    priority
                                    fetchPriority="high"
                                    sizes="(max-width: 1024px) 100vw, 480px"
                                    className="object-cover"
                                />

                                {/* Overlay glow gradient */}
                                <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

                                {/* Reading Time Widget floating on the card */}
                                <div className="absolute top-4 right-4 bg-slate-950/60 backdrop-blur-md text-white border border-white/10 px-3 py-2 rounded-xl flex items-center gap-2.5 select-none pointer-events-none">
                                    <div className="flex items-center justify-center bg-white/10 p-1 rounded-full">
                                        <BookOpen className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex flex-col leading-tight">
                                        <span className="text-xs font-black tracking-tight">{readingTime.split(' ')[0]}</span>
                                        <span className="text-[8px] uppercase tracking-wider font-semibold opacity-85">min read</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </section>
    );
}

// Simple estimated reading time generator based on description length
function useMemoReadingTime(description: string) {
    const wordCount = description?.split(/\s+/).length || 0;
    const minutes = Math.max(2, Math.ceil(wordCount / 5));
    return `${minutes} min read`;
}
