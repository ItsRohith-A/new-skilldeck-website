import { BookOpen, CheckCircle2, MapPin, ShieldCheck, Star, Users } from "lucide-react";
import Image from "next/image";

interface CompaniesHeroProps {
    totalCompanies?: number | string;
}

export default function CompaniesHero({ totalCompanies }: CompaniesHeroProps) {
    return (
        <section className="relative bg-white pt-20 md:pt-24 pb-10 lg:pt-7 lg:pb-0 overflow-hidden">
            <div className="container mx-auto px-4 lg:px-0">

                {/* ── Main hero grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center  lg:min-h-[480px] py-6 sm:py-10 lg:pb-0">

                    {/* ── LEFT: Text content ── */}
                    <div className="lg:col-span-6 flex flex-col justify-center space-y-5 relative z-10">

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-brand-primary flex items-center justify-center text-white shadow-sm shadow-brand-primary/20 shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.203 0-4.361.186-6.468.547V21M3.75 21h16.5" />
                                </svg>
                            </div>
                            <p className="text-xs font-semibold text-slate-400">
                                Discovery{" "}
                                <span className="text-brand-primary font-bold mx-1">/</span>{" "}
                                <span className="text-brand-primary font-bold">Training Institutes</span>
                            </p>
                        </div>

                        {/* Verified badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-dark text-[11px] font-semibold w-fit">
                            <ShieldCheck className="w-4 h-4 shrink-0 text-brand-primary" />
                            Every institute below is verified by SkillDeck
                        </div>

                        {/* Headline */}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-dark tracking-tight leading-[1.15] lg:leading-[1.1]">
                            The institute{" "}
                            <span className="bg-gradient-to-r from-brand-primary to-brand-primary/70 bg-clip-text text-transparent">
                                matters
                            </span>
                            <br />
                            as much as the{" "}
                            <span className="bg-gradient-to-r from-brand-secondary to-rose-500 bg-clip-text text-transparent">
                                syllabus.
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-lg">
                            Two institutes can teach the same curriculum and produce completely
                            different outcomes. Compare them on placement record, trainer
                            experience, facilities and what alumni say a year later.
                        </p>

                    </div>

                    {/* ── RIGHT: Image in container ── */}
                    <div className="lg:col-span-6 relative hidden lg:block w-full mt-6 lg:mt-0 mb-[-110px] min-h-[560px]">

                        {/* Soft brand arc behind image */}
                        <div className="absolute inset-0 rounded-[32px] rounded-tl-[60px] lg:rounded-tl-[100px] bg-gradient-to-br from-brand-primary/10 via-brand-primary/5 to-slate-50/10 z-0" />

                        {/* Image wrapper — taller, rounded top-left deeply */}
                        <div className="absolute inset-0 rounded-[32px] rounded-tl-[60px] lg:rounded-tl-[100px] overflow-hidden z-10">
                            <Image
                                src="/company/company_bg.jpeg"
                                alt="Training institute success"
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover object-right-top animate-fade-in"
                                priority
                            />
                            {/* Left-edge fade to blend with white bg */}
                            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white/30 to-transparent pointer-events-none" />
                        </div>

                        <div className="absolute top-[10%] left-2 sm:left-[-8px] bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl p-3 sm:p-3.5 shadow-xl shadow-slate-200/50 max-w-[170px] sm:max-w-[190px] z-20 flex gap-2.5 sm:gap-3 items-start hover:scale-[1.02] transition-transform duration-300">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                            </div>
                            <div>
                                <p className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">Quality Institutes</p>
                                <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 leading-tight">Carefully verified for your success</p>
                                <div className="flex gap-0.5 mt-1.5">
                                    {[...Array(4)].map((_, i) => (
                                        <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Floating — Trusted by card */}
                        <div className="absolute bottom-[10%] lg:top-[52%] lg:bottom-auto right-2 sm:left-[-8px] sm:right-auto bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl py-2.5 px-3.5 sm:py-3 sm:px-4 shadow-xl shadow-slate-200/50 z-20 flex gap-2.5 sm:gap-3 items-center hover:scale-[1.02] transition-transform duration-300">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-secondary/10 flex items-center justify-center shrink-0">
                                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-secondary" />
                            </div>
                            <div>
                                <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium">Trusted by</p>
                                <p className="text-xs sm:text-sm font-bold text-slate-800 leading-none mt-0.5">2.2L+ learners</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Stats strip ── */}
                <div className="md:pb-10 pt-0 relative z-10">
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-md p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-y-6 md:gap-y-0 divide-slate-100 md:divide-x">
                        {[
                            { icon: <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-brand-primary" />, bg: "bg-brand-primary/10", value: { totalCompanies }, label: "Verified institutes", underline: "bg-brand-primary" },
                            { icon: <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-brand-secondary" />, bg: "bg-brand-secondary/10", value: "10+", label: "Cities covered", underline: "bg-brand-secondary" },
                            { icon: <Users className="w-6 h-6 sm:w-7 sm:h-7 text-brand-primary" />, bg: "bg-brand-primary/10", value: "2.2L", label: "Learners trained", underline: "bg-brand-primary" },
                            { icon: <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-brand-secondary" />, bg: "bg-brand-secondary/10", value: "130", label: "Programmes listed", underline: "bg-brand-secondary" },
                        ].map(({ icon, bg, value, label, underline }, i) => (
                            <div key={i} className="flex items-center gap-3 sm:gap-4 py-2 px-2 sm:px-6 md:px-8 hover:scale-[1.02] transition-transform duration-300">
                                <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${bg} flex items-center justify-center shrink-0`}>
                                    {icon}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-lg md:text-xl 2xl:text-2xl font-extrabold text-slate-900 leading-none">
                                        {typeof value === "string" ? value : value?.totalCompanies ?? ""}
                                    </p>
                                    <p className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-1.5 leading-tight">{label}</p>
                                    <div className={`h-[3px] w-8 sm:w-10 rounded-full mt-2 ${underline}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
