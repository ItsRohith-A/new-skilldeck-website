import { Breadcrumb } from "@/components/ui/Breadcrumb";
import DOMPurify from "@/lib/dompurify";
import { BadgeCheck, CalendarDays, MapPin, Star, Users } from "lucide-react";
import Image from "next/image";
import CompanyContactButton from "./CompanyContactButton";

interface Props {
    tenant: {
        id: string;
        name: string;
        logo?: string;
        isVerified?: boolean;
        isSponsored?: boolean;
        industry?: string;
        foundedYear?: number;
        companySize?: string;
        rating?: number;
        reviewCount?: number;
        platformProfile?: {
            shortDescription?: string;
            description?: string;
            trainingAreas?: string[];
            certifications?: string[];
            location?: string;
            branchCount?: number;
        };
        address?: { city?: string; state?: string; country?: string };
    };
}
function getInitials(name: string) {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : name.charAt(0).toUpperCase();
}

function hasTextContent(html?: string): boolean {
    if (!html) return false;
    const text = html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, "").trim();
    return text.length > 0;
}

/** Force rel="nofollow noreferrer" on every anchor tag in raw HTML */
function injectNofollow(html: string): string {
    return html.replace(/<a\b([^>]*?)>/gi, (match, attrs) => {
        if (/\brel=/i.test(attrs)) {
            return match.replace(/\brel="[^"]*"/i, 'rel="nofollow noreferrer"');
        }
        return `<a${attrs} rel="nofollow noreferrer">`;
    });
}

// Pure Server Component — no "use client"
export default function CompanyProfileHero({ tenant }: Props) {
    const p = tenant.platformProfile || {};
    const location = tenant.address?.city
        ? [tenant.address.city, tenant.address.state].filter(Boolean).join(", ")
        : p.location;

    const tags = [
        ...(p.trainingAreas || []),
        ...(p.certifications || []),
    ];

    return (
        <section className="bg-linear-to-b from-indigo-50/80 to-white border-b border-slate-200">
            {/* Breadcrumb — using shared Breadcrumb UI component */}
            <div className="container mx-auto px-4 lg:px-0 pt-20 md:pt-20 lg:pt-28 lg:pb-6">
                <Breadcrumb
                    items={[
                        { label: "Home", href: "/" },
                        { label: "Training Institutes", href: "/companies" },
                        { label: tenant.name },
                    ]}
                />
            </div>

            {/* Main header */}
            <div className="container mx-auto px-4 lg:px-0 py-4 lg:py-8">
                <div className="flex flex-col gap-3 md:gap-6">
                    {/* Logo + Name row — horizontal on all screens */}
                    <div className="flex flex-row items-start gap-3 md:gap-6">
                        {/* Logo */}
                        <div className="w-18 h-18 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl bg-white shadow border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                            {tenant.logo ? (
                                <Image src={tenant.logo} alt={tenant.name} width={96} height={96} className="object-contain w-full h-full p-1.5 sm:p-2" />
                            ) : (
                                <span className="text-lg sm:text-2xl font-black text-indigo-600">{getInitials(tenant.name)}</span>
                            )}
                        </div>

                        {/* Name + badges + rating */}
                        <div className="flex-1 min-w-0">
                            {/* Name + verified + sponsored badges */}
                            <h1 className="text-lg sm:text-3xl font-black text-slate-900 leading-tight mb-1 sm:mb-2">
                                {tenant.name}

                                {/* Verified badge — blue BadgeCheck */}
                                <BadgeCheck className="inline-block align-[-0.1em] ml-1.5 w-4 h-4 sm:w-5 sm:h-5 text-blue-500" aria-label="Verified" />

                                {/* Sponsored / Featured Partner badge — teal circle */}
                                {tenant.isSponsored && (
                                    <span
                                        aria-label="Featured Partner"
                                        title="Featured Partner"
                                        className="inline-flex align-middle items-center justify-center ml-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-teal-500 shrink-0"
                                    >
                                        <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                    </span>
                                )}
                            </h1>

                            {/* Location / Founded / Campuses — only render if data exists */}
                            <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 text-[11px] sm:text-sm text-slate-500 mb-2 sm:mb-3">
                                {location && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {location}
                                    </span>
                                )}
                                {tenant.foundedYear && (
                                    <span className="flex items-center gap-1">
                                        <CalendarDays className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Est. {tenant.foundedYear}
                                    </span>
                                )}
                                {p.branchCount && (
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {p.branchCount} campus{p.branchCount > 1 ? "es" : ""}
                                    </span>
                                )}
                                {tenant.companySize && (
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {tenant.companySize} employees
                                    </span>
                                )}
                                {tenant.industry && (
                                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] sm:text-xs font-semibold rounded-full border border-indigo-100">
                                        {tenant.industry}
                                    </span>
                                )}
                            </div>

                            {/* Rating — inline on mobile, end-aligned on desktop */}
                            {tenant.rating && (
                                <div className="flex items-center gap-1 mb-2 sm:mb-0">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < Math.round(tenant.rating!) ? "text-yellow-400 fill-yellow-400" : "text-slate-200 fill-slate-200"}`}
                                        />
                                    ))}
                                    <span className="text-xs sm:text-sm font-bold text-slate-800 ml-1">{tenant.rating.toFixed(1)}</span>
                                    {tenant.reviewCount && (
                                        <span className="text-[10px] sm:text-xs text-slate-400 ml-1">({tenant.reviewCount.toLocaleString()} reviews)</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Short description — below the logo+name row */}
                    {p.shortDescription && p.description && hasTextContent(p.description) && (
                        <div
                            className="skilldeck-content text-slate-600 text-xs sm:text-sm max-w-5xl [&_*]:text-[length:inherit]!"
                            dangerouslySetInnerHTML={{ __html: injectNofollow(DOMPurify.sanitize(p.shortDescription)) }}
                        />
                    )}

                    {/* Tags — only if backend provides them */}
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {tags.map((tag, i) => (
                                <span
                                    key={i}
                                    className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold border ${i < (p.trainingAreas?.length || 0)
                                        ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                        }`}
                                >
                                    {i >= (p.trainingAreas?.length || 0) && (
                                        <span className="mr-1 text-amber-500">✦</span>
                                    )}
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Enquiry CTA — mobile visible, desktop shown inline via contact card */}
                <div className="mt-5 md:hidden">
                    <CompanyContactButton
                        tenantId={tenant.id}
                        companyName={tenant.name}
                        className="w-full py-3 bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] text-white font-bold rounded-xl text-sm"
                    >
                        Send an enquiry
                    </CompanyContactButton>
                </div>
            </div>
        </section>
    );
}
