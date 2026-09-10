import { Briefcase, Calendar, MapPin, Users } from "lucide-react";

interface Props {
    info: {
        foundedYear?: number;
        employeeCount?: string;
        industry?: string;
        headquarters?: string | { city?: string; state?: string; country?: string };
    };
}

function formatHq(hq: Props["info"]["headquarters"]): string | null {
    if (!hq) return null;
    if (typeof hq === "string") return hq || null;
    return [hq.city, hq.country].filter(Boolean).join(", ") || null;
}

// Colored top border + value text per column — matches screenshot design
const COLUMN_STYLES = [
    { border: "border-t-indigo-500", value: "text-indigo-700", bg: "bg-indigo-50/60" },
    { border: "border-t-blue-500", value: "text-blue-700", bg: "bg-blue-50/60" },
    { border: "border-t-emerald-500", value: "text-emerald-700", bg: "bg-emerald-50/60" },
    { border: "border-t-amber-500", value: "text-amber-700", bg: "bg-amber-50/60" },
];

// Server Component — only renders if backend provides at least one fact
export default function CompanyInfoCard({ info }: Props) {
    const hq = formatHq(info.headquarters);
    const yearsInBiz = info.foundedYear ? new Date().getFullYear() - info.foundedYear : null;

    // Build fact columns only from dynamic data — nothing renders if field is absent
    const facts = [
        info.foundedYear && {
            icon: Calendar,
            label: "Founded",
            value: String(info.foundedYear),
            sub: yearsInBiz ? `${yearsInBiz} years in business` : undefined,
        },
        info.employeeCount && {
            icon: Users,
            label: "Team Size",
            value: info.employeeCount,
            sub: "Employees",
        },
        info.industry && {
            icon: Briefcase,
            label: "Industry",
            value: info.industry,
            sub: undefined,
        },
        hq && {
            icon: MapPin,
            label: "Headquarters",
            value: hq,
            sub: undefined,
        },
    ].filter(Boolean) as { icon: any; label: string; value: string; sub?: string }[];

    if (facts.length === 0) return null;

    return (
        <section className="py-8 bg-white">
            <div className="container mx-auto px-4 lg:px-0">
                {/* Single rounded card — screenshot style */}
                <div className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className={`grid grid-cols-2 md:grid-cols-${Math.min(facts.length, 4)} divide-x divide-slate-200`}>
                        {facts.map(({ icon: Icon, label, value, sub }, i) => {
                            const style = COLUMN_STYLES[i % COLUMN_STYLES.length];
                            return (
                                <div
                                    key={i}
                                    className={`flex flex-col gap-1 px-6 py-4 border-t-[3px] ${style.border} ${style.bg}`}
                                >
                                    {/* Large bold colored value */}
                                    <span className={`text-xl font-semibold ${style.value} leading-none`}>
                                        {value}
                                    </span>

                                    {/* Label */}
                                    <span className="text-xs font-semibold text-slate-800">{label}</span>

                                    {/* Optional sub-text */}
                                    {sub && (
                                        <span className="text-xs text-slate-500">{sub}</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
