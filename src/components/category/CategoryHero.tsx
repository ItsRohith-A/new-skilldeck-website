import { CategoryData } from "@/types";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "../ui/Breadcrumb";
import { Button } from "../ui/Button";
import ComparisonProof from "../shared/ComparisonProof";

interface CategoryHeroProps {
    data: CategoryData;
}

export default function CategoryHero({ data }: CategoryHeroProps) {
    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: data.name, href: `/${data.slug}` },
    ];

    return (
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f5f3ff_0%,#eef2ff_50%,#e0e7ff_100%)] py-10 md:py-24 lg:pt-26 text-slate-800">
            <div className="container mx-auto px-4 lg:px-0 relative z-10">
                {/* Breadcrumbs */}
                <div className="flex justify-start mb-6">
                    <Breadcrumb items={breadcrumbItems} className="text-slate-500 font-semibold" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Left: Content */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="space-y-3">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight md:leading-none">
                                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 bg-clip-text text-transparen">
                                    {data.name}
                                </span>
                            </h1>
                        </div>

                        {data.description && (
                            <div
                                className="text-slate-600 text-sm leading-relaxed max-w-2xl font-medium"
                                dangerouslySetInnerHTML={{ __html: data.description }}
                            />
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <Link href="#course-list" className="w-full sm:w-auto">
                                <Button variant="primary" size="lg" className="rounded-full px-8 py-4 text-xs font-black uppercase tracking-wider w-full sm:w-auto shadow-lg shadow-purple-600/20 hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2">
                                    Explore Courses
                                    <ArrowDown className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>

                        {/* Comparison outcomes — the reason to compare before enrolling. */}
                        <ComparisonProof className="pt-4" />
                    </div>

                    {/* Right: Image */}
                    <div className="hidden lg:col-span-5 relative w-full lg:flex justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-indigo-500 blur-3xl opacity-10 rounded-full scale-75 pointer-events-none" />
                        <div className="relative overflow-hidden border border-slate-200 shadow-2xl bg-white/70 backdrop-blur-md p-4 rounded-3xl w-full max-w-[480px]">
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
                                {data.image?.url ? (
                                    <Image
                                        src={data.image.url}
                                        alt={data.image.alt || data.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 40vw"
                                        className="object-cover"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center p-8 text-center text-slate-400">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            {data.name} Program
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
