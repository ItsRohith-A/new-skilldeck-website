"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    Home,
    ArrowLeft,
    Search,
    Compass,
    Sparkles,
    LayoutTemplate,
    GraduationCap,
    LifeBuoy,
    ArrowRight,
    CheckCircle2
} from 'lucide-react';

export default function NotFound() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = searchQuery.trim();
        if (trimmed) {
            router.push(`/services?search=${encodeURIComponent(trimmed)}`);
        } else {
            router.push('/services');
        }
    };

    const popularDestinations = [
        {
            title: "Services & Platform",
            description: "Explore our all-in-one LMS, CRM, and automation suite.",
            href: "/services",
            icon: GraduationCap,
            iconBg: "bg-blue-50 text-blue-600 border-blue-100",
            hoverBorder: "hover:border-blue-300 hover:shadow-blue-500/10",
        },
        {
            title: "Web Templates",
            description: "Browse high-converting, modern website templates.",
            href: "/web-templates",
            icon: LayoutTemplate,
            iconBg: "bg-purple-50 text-purple-600 border-purple-100",
            hoverBorder: "hover:border-purple-300 hover:shadow-purple-500/10",
        },
        {
            title: "Pricing & Plans",
            description: "Find the ideal flexible plan tailored to your team.",
            href: "/pricing",
            icon: Sparkles,
            iconBg: "bg-amber-50 text-amber-600 border-amber-100",
            hoverBorder: "hover:border-amber-300 hover:shadow-amber-500/10",
        },
        {
            title: "Help & Support",
            description: "Get in touch with our team for quick assistance.",
            href: "/contact-us",
            icon: LifeBuoy,
            iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
            hoverBorder: "hover:border-emerald-300 hover:shadow-emerald-500/10",
        },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50/30 text-slate-800 flex flex-col justify-between">
            {/* Ambient background glows */}
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-tr from-blue-400/20 via-indigo-400/15 to-purple-400/20 blur-3xl rounded-full pointer-events-none -z-10" />
            <div className="absolute top-1/2 -right-48 w-96 h-96 bg-blue-300/10 blur-3xl rounded-full pointer-events-none -z-10" />
            <div className="absolute bottom-10 -left-48 w-96 h-96 bg-purple-300/10 blur-3xl rounded-full pointer-events-none -z-10" />

            {/* Subtle Grid Pattern Overlay */}
            <div
                className="absolute inset-0 pointer-events-none -z-10 opacity-40"
                style={{
                    backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                }}
            />

            {/* Top Navigation Bar */}
            <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between relative z-10">
                <Link href="/" className="inline-flex items-center gap-2 group transition-transform hover:scale-[1.02]">
                    <Image
                        src="/logos/mainlogo.svg"
                        alt="SkillDeck Logo"
                        width={132}
                        height={34}
                        className="h-8 w-auto object-contain"
                        priority
                    />
                </Link>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-slate-200/80 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        Systems Operational
                    </div>

                    <Link
                        href="/contact-us"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 px-3.5 py-1.5 rounded-lg hover:bg-slate-100/80 transition-colors"
                    >
                        Contact Support
                    </Link>
                </div>
            </header>

            {/* Main 404 Hero Section */}
            <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 text-center relative z-10 flex-1 flex flex-col justify-center items-center">
                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-700 text-xs sm:text-sm font-semibold shadow-xs mb-6">
                    <Compass className="w-4 h-4 text-blue-600 animate-spin" style={{ animationDuration: '14s' }} />
                    <span>Error 404 • Destination Not Found</span>
                </div>

                {/* Big Visual 404 Display */}
                <div className="relative mb-6 select-none">
                    <div className="text-8xl sm:text-[140px] md:text-[170px] font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 drop-shadow-sm">
                        404
                    </div>
                </div>

                {/* Heading and Description */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                    Looks like you&apos;ve drifted off course
                </h1>
                <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed mb-8">
                    The page you are looking for doesn&apos;t exist, was moved, or may have expired. Let&apos;s get you right back to what you need.
                </p>

                {/* Interactive Search Box */}
                <form
                    onSubmit={handleSearch}
                    className="w-full max-w-md mx-auto mb-8 relative flex items-center"
                >
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                            <Search className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search services, LMS features, templates..."
                            className="w-full pl-11 pr-24 py-3.5 bg-white border border-slate-200/90 rounded-2xl text-sm sm:text-base text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 inset-y-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-semibold rounded-xl hover:opacity-95 shadow-sm transition flex items-center gap-1 cursor-pointer"
                        >
                            Search
                        </button>
                    </div>
                </form>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3.5 justify-center w-full max-w-md mb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35 hover:-translate-y-0.5 transition-all duration-200 text-sm sm:text-base"
                    >
                        <Home className="w-4 h-4" />
                        Return to Homepage
                    </Link>
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200/90 text-slate-700 px-6 py-3.5 rounded-xl font-semibold shadow-xs hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 text-sm sm:text-base cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Previous Page
                    </button>
                </div>

                {/* Popular Destinations Cards */}
                <div className="w-full border-t border-slate-200/70 pt-10">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <span className="h-px w-8 bg-slate-200" />
                        <span className="text-xs uppercase tracking-widest font-bold text-slate-400">Popular Destinations</span>
                        <span className="h-px w-8 bg-slate-200" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-left w-full">
                        {popularDestinations.map((dest, idx) => {
                            const Icon = dest.icon;
                            return (
                                <Link
                                    key={idx}
                                    href={dest.href}
                                    className={`group p-4 bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${dest.hoverBorder} flex flex-col justify-between`}
                                >
                                    <div>
                                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${dest.iconBg}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                                            {dest.title}
                                            <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-600" />
                                        </h3>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            {dest.description}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </main>

            {/* Subtle Bottom Footer */}
            <footer className="w-full border-t border-slate-200/60 bg-white/60 backdrop-blur-xs py-5 px-4 sm:px-6 relative z-10 text-xs text-slate-500">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p>© {new Date().getFullYear()} SkillDeck Platform. All rights reserved.</p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href="/about-us" className="hover:text-slate-800 transition-colors">About</Link>
                        <span>•</span>
                        <Link href="/services" className="hover:text-slate-800 transition-colors">Services</Link>
                        <span>•</span>
                        <Link href="/pricing" className="hover:text-slate-800 transition-colors">Pricing</Link>
                        <span>•</span>
                        <Link href="/privacy-policy" className="hover:text-slate-800 transition-colors">Privacy</Link>
                        <span>•</span>
                        <Link href="/terms-of-service" className="hover:text-slate-800 transition-colors">Terms</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
