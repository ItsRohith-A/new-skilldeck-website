import { Cloud, Beaker, UserCheck, Target, BookOpen, Accessibility } from "lucide-react";

const facilities = [
    {
        title: "Cloud sandbox",
        description: "Unlimited AWS credits for every enrolled learner",
        icon: <Cloud className="w-5 h-5" />,
        colorClass: "border-t-indigo-500",
        iconBgClass: "bg-indigo-50 text-indigo-600",
    },
    {
        title: "Hardware labs",
        description: "Three networking and infrastructure labs across campuses",
        icon: <Beaker className="w-5 h-5" />,
        colorClass: "border-t-blue-500",
        iconBgClass: "bg-blue-50 text-blue-600",
    },
    {
        title: "1:1 mentorship",
        description: "Weekly scheduled slot with a working engineer",
        icon: <UserCheck className="w-5 h-5" />,
        colorClass: "border-t-emerald-500",
        iconBgClass: "bg-emerald-50 text-emerald-600",
    },
    {
        title: "Placement cell",
        description: "Nine full-time coordinators, six-month post-course support",
        icon: <Target className="w-5 h-5" />,
        colorClass: "border-t-amber-500",
        iconBgClass: "bg-amber-50 text-amber-600",
    },
    {
        title: "Resource library",
        description: "18-month recording and material access after completion",
        icon: <BookOpen className="w-5 h-5" />,
        colorClass: "border-t-rose-500",
        iconBgClass: "bg-rose-50 text-rose-600",
    },
    {
        title: "Accessible campuses",
        description: "Step-free access and captioned recordings throughout",
        icon: <Accessibility className="w-5 h-5" />,
        colorClass: "border-t-sky-500",
        iconBgClass: "bg-sky-50 text-sky-600",
    },
];

export default function CompanyFacilitiesCard() {
    return (
        <div id="facilities" className="pt-6 border-t border-slate-100">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1.5">ON CAMPUS</p>
            <h2 className="text-2xl font-black text-slate-900 mb-6">
                Facilities and what they are actually for
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                {facilities.map((f, i) => (
                    <div
                        key={i}
                        className={`bg-white rounded-xl sm:rounded-2xl border-l-4 sm:border-l-0 sm:border-t-4 border-r sm:border-x border-b border-slate-200/80 p-3 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-row sm:flex-col items-center sm:items-start gap-3 sm:gap-0 ${f.colorClass}`}
                    >
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 sm:mb-4 ${f.iconBgClass}`}>
                            {f.icon}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-0.5 sm:mb-1.5">
                                {f.title}
                            </h3>
                            <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                                {f.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
