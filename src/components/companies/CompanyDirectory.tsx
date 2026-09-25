"use client";

import { Company } from "@/types";
import { Building2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import CompanyCard from "./CompanyCard";
import SearchInput from "./SearchInput";

interface CompanyDirectoryProps {
    regularCompanies: Company[];
    totalRegular: number;
    totalPages: number;
    page: number;
    fp: number;
    search?: string;
}

export default function CompanyDirectory({
    regularCompanies,
    totalRegular,
    totalPages,
    page,
    fp,
    search = ""
}: CompanyDirectoryProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [loadingDir, setLoadingDir] = useState<"prev" | "next" | null>(null);
    const [mobileIndex, setMobileIndex] = useState(0);
    const prevPageRef = useRef(page);

    // Sync mobileIndex slider placement based on page transitions
    useEffect(() => {
        if (page < prevPageRef.current) {
            setMobileIndex(Math.max(0, regularCompanies.length - 1));
        } else {
            setMobileIndex(0);
        }
        prevPageRef.current = page;
    }, [page, search, regularCompanies.length]);

    /** Navigate wrapped in transition so isPending becomes true */
    const navigate = (url: string, dir: "prev" | "next") => {
        setLoadingDir(dir);
        startTransition(() => {
            router.push(url, { scroll: false });
        });
    };

    // Clear loadingDir once navigation settles
    useEffect(() => {
        if (!isPending) setLoadingDir(null);
    }, [isPending]);

    const handleMobilePrev = () => {
        if (mobileIndex > 0) {
            setMobileIndex(mobileIndex - 1);
        } else if (page > 1) {
            navigate(`/companies?page=${page - 1}&fp=${fp}${search ? `&search=${encodeURIComponent(search)}` : ""}#all-providers`, "prev");
        }
    };

    const handleMobileNext = () => {
        if (mobileIndex < regularCompanies.length - 1) {
            setMobileIndex(mobileIndex + 1);
        } else if (page < totalPages) {
            navigate(`/companies?page=${page + 1}&fp=${fp}${search ? `&search=${encodeURIComponent(search)}` : ""}#all-providers`, "next");
        }
    };

    const handleDesktopPrev = () => {
        if (page <= 1) return;
        navigate(`/companies?page=${page - 1}&fp=${fp}${search ? `&search=${encodeURIComponent(search)}` : ""}#all-providers`, "prev");
    };

    const handleDesktopNext = () => {
        if (page >= totalPages) return;
        navigate(`/companies?page=${page + 1}&fp=${fp}${search ? `&search=${encodeURIComponent(search)}` : ""}#all-providers`, "next");
    };

    return (
        <div id="all-providers" className="mt-6">
            {/* Heading Group Panel */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-2 md:gap-4">
                <div>
                    <span className="text-[10px] font-extrabold text-brand-primary uppercase tracking-widest bg-brand-primary/5 px-3 py-1 rounded-full">
                        All Institutes
                    </span>
                    <h2 className="text-xl lg:text-2xl font-extrabold text-slate-900 mt-1 capitalize leading-tight">
                        Browse verified training institutes
                    </h2>
                    <p className="text-xs md:text-sm text-slate-500 max-w-2xl leading-relaxed">
                        Filter by city, specialism, fee band and placement record. Add up to four to compare.
                    </p>
                </div>

                {/* Server-Side Search input */}
                <div className="mb-5">
                    <SearchInput />
                </div>
            </div>

            {/* Results Grid / Fallback */}
            {regularCompanies.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 max-w-xl mx-auto">
                    <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-slate-900">No training institutes found</h3>
                    <p className="text-slate-500 mt-1.5 text-sm">
                        {search ? `No results matching "${search}". Please try a different query.` : "Please check back later."}
                    </p>
                </div>
            ) : (
                <>
                    {/* Companies listing label */}
                    <div className="flex items-center justify-between mb-5 px-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            {search ? `Search results for "${search}"` : "All training providers"}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 capitalize">
                            {totalRegular} {totalRegular === 1 ? "Institute" : "Institutes"} listed
                        </span>
                    </div>

                    {/* Desktop View: Grid of 3 Cards — dimmed while loading */}
                    <div className={`hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 transition-opacity duration-200 ${isPending ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
                        {regularCompanies.map((company) => (
                            <CompanyCard key={company.id} company={company} />
                        ))}
                    </div>

                    {/* Mobile View: 1 Card Carousel — dimmed while loading */}
                    {(() => {
                        const safeMobileIndex = Math.min(mobileIndex, Math.max(0, regularCompanies.length - 1));
                        return (
                            <div className="block md:hidden mb-8">
                                <div className={`mb-6 transition-opacity duration-200 ${isPending ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
                                    <CompanyCard company={regularCompanies[safeMobileIndex]} />
                                </div>
                                {/* Mobile Navigation Controls */}
                                <div className="flex items-center justify-between bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
                                    <button
                                        onClick={handleMobilePrev}
                                        disabled={isPending || (page === 1 && mobileIndex === 0)}
                                        className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition disabled:opacity-30 disabled:pointer-events-none"
                                    >
                                        {isPending && loadingDir === "prev" ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronLeft className="w-5 h-5" />}
                                    </button>
                                    <span className="text-xs font-semibold text-slate-700">
                                        {safeMobileIndex + 1} of {regularCompanies.length} on Page {page}
                                    </span>
                                    <button
                                        onClick={handleMobileNext}
                                        disabled={isPending || (page === totalPages && mobileIndex === regularCompanies.length - 1)}
                                        className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition disabled:opacity-30 disabled:pointer-events-none"
                                    >
                                        {isPending && loadingDir === "next" ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Desktop Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="hidden md:flex items-center justify-center gap-2 mt-8">
                            <button
                                onClick={handleDesktopPrev}
                                disabled={isPending || page === 1}
                                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-all disabled:opacity-40 disabled:pointer-events-none"
                            >
                                {isPending && loadingDir === "prev" ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronLeft className="w-5 h-5" />}
                            </button>
                            <span className="text-sm font-medium text-slate-700 px-4">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={handleDesktopNext}
                                disabled={isPending || page === totalPages}
                                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-all disabled:opacity-40 disabled:pointer-events-none"
                            >
                                {isPending && loadingDir === "next" ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
