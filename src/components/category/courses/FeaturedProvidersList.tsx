"use client";

import { Institute } from "@/types/schedules";
import Image from "next/image";

interface FeaturedProvidersListProps {
    institutesList: Institute[];
    verifiedCount: number;
    selectedCompanyId: string | null;
    onCompanySelect: (id: string) => void;
}

export default function FeaturedProvidersList({
    institutesList,
    verifiedCount,
    selectedCompanyId,
    onCompanySelect
}: FeaturedProvidersListProps) {
    if (institutesList.length === 0) return null;

    return (
        <div className="mt-2 space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="w-5 h-[3px] bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] rounded-full shrink-0" />
                    <span className="text-[10px] font-black tracking-widest text-[#101A3D]/70 uppercase">Featured Training Providers</span>
                </div>
                {verifiedCount > 0 && (
                    <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-2 py-0.5 shrink-0">
                        {verifiedCount} Verified
                    </span>
                )}
            </div>

            <p className="text-[10px] text-slate-500 -mt-2">
                Select a provider to see their fee and batch dates above.
            </p>

            {/* Providers list, presented as a radio group so the cards read as
                one choice rather than four separate links. */}
            <div className="space-y-2" role="radiogroup" aria-label="Featured training providers">
                {institutesList.map((inst) => {
                    const isSelected = selectedCompanyId === inst.id;
                    return (
                    <button
                        key={inst.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => onCompanySelect(inst.id)}
                        className={`w-full flex items-center justify-between gap-2 border rounded-xl p-3 transition-all text-left cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary ${isSelected
                                ? "border-brand-primary ring-2 ring-brand-primary/10 bg-brand-primary/5"
                                : "bg-white border-slate-100 hover:border-brand-primary/40 hover:bg-slate-50"
                            }`}
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            {/* Radio mark — the affordance the plain cards were missing */}
                            <span
                                aria-hidden="true"
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected
                                        ? "border-brand-primary"
                                        : "border-slate-300"
                                    }`}
                            >
                                {isSelected && <span className="w-2 h-2 rounded-full bg-brand-primary" />}
                            </span>

                            <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                                {inst.logo ? (
                                    <Image
                                        src={inst.logo}
                                        alt={inst.name}
                                        fill
                                        sizes="40px"
                                        className="object-contain p-1"
                                    />
                                ) : (
                                    <span className="text-sm font-bold text-indigo-600 uppercase">
                                        {inst.name.charAt(0)}
                                    </span>
                                )}
                            </div>
                            <div className="min-w-0">
                                <h5 className="text-xs font-bold text-slate-800 truncate">{inst.name}</h5>
                                <p className="text-[10px] text-slate-500 mt-0.5 capitalize truncate">
                                    {[
                                        inst.address || "Hybrid",
                                        inst.industry || "Training"
                                    ].filter(Boolean).join(" · ")}
                                </p>
                            </div>
                        </div>
                        {inst.rating && inst.rating > 0 ? (
                            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-md px-1.5 py-0.5 text-[10px] font-bold flex-shrink-0">
                                <span>★</span>
                                <span>{inst.rating}</span>
                            </div>
                        ) : null}
                    </button>
                    );
                })}
            </div>

            {/* Pricing disclaimer subtitle */}
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                Fees shown are for the upcoming cohort and exclude taxes. Confirm the final amount with the institute before paying.
            </p>

            {/* Job Guarantee Alert Box */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3.5 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div>
                    <h5 className="text-xs font-bold text-emerald-800">Job guarantee included</h5>
                    <p className="text-[10px] text-emerald-600/90 mt-0.5 font-medium">
                        89% placed within six months across 8.9k learners.
                    </p>
                </div>
            </div>
        </div>
    );
}
