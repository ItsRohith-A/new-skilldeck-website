import React from "react";
import { BarChart3, CalendarClock, GraduationCap, LineChart, Users, Wallet } from "lucide-react";

/**
 * CSS-only product visuals.
 *
 * The concept needs product shots, and inventing screenshots as images would
 * ship dead weight plus a locale/theme mismatch. These are built from divs, so
 * they scale, respond and recolour with the page tokens.
 */

function WindowChrome({ label, dark }: { label: string; dark?: boolean }) {
    return (
        <div
            className={`flex items-center gap-2 px-4 py-3 border-b ${dark ? "border-white/10 bg-white/[0.03]" : "border-[var(--sd-line)] bg-[var(--sd-surface)]"
                }`}
        >
            <span className="flex gap-1.5" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F87171]/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#34D399]/70" />
            </span>
            <span className={`ml-2 text-[11px] font-semibold ${dark ? "text-white/45" : "text-[var(--sd-muted)]"}`}>
                {label}
            </span>
        </div>
    );
}

const CHART_BARS = [38, 54, 46, 72, 60, 88, 76, 96];

/** Hero visual: a cohort dashboard with KPI tiles, a chart and a live feed. */
export function DashboardMock() {
    return (
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#08283A] shadow-2xl shadow-black/40">
            <WindowChrome label="skilldeck · cohort overview" dark />

            <div className="p-4 md:p-5 space-y-4">
                {/* KPI row */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { icon: Users, label: "Active learners", value: "12,480", delta: "+14%" },
                        { icon: Wallet, label: "Revenue", value: "$318K", delta: "+9%" },
                        { icon: GraduationCap, label: "Completion", value: "82%", delta: "+6%" },
                    ].map(({ icon: Icon, label, value, delta }) => (
                        <div key={label} className="rounded-xl bg-white/[0.04] border border-white/10 p-3">
                            <div className="flex items-center gap-1.5 text-white/45">
                                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                                <span className="text-[10px] font-semibold truncate">{label}</span>
                            </div>
                            <p className="mt-2 text-base md:text-lg font-black text-white leading-none">{value}</p>
                            <p className="mt-1 text-[10px] font-bold text-[var(--sd-accent)]">{delta}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {/* Chart */}
                    <div className="sm:col-span-3 rounded-xl bg-white/[0.04] border border-white/10 p-3.5">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-white/70">Enrolments</span>
                            <span className="text-[10px] text-white/35">Last 8 weeks</span>
                        </div>
                        <div className="mt-4 flex items-end gap-1.5 h-24" aria-hidden="true">
                            {CHART_BARS.map((height, i) => (
                                <div
                                    key={i}
                                    className="flex-1 rounded-t-md"
                                    style={{
                                        height: `${height}%`,
                                        background:
                                            i === CHART_BARS.length - 1
                                                ? "var(--sd-gradient)"
                                                : "rgba(255,255,255,0.14)",
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Live feed */}
                    <div className="sm:col-span-2 rounded-xl bg-white/[0.04] border border-white/10 p-3.5 space-y-3">
                        <span className="text-[11px] font-bold text-white/70">Today</span>
                        {[
                            { icon: CalendarClock, title: "Live class · UX Foundations", meta: "in 20 min" },
                            { icon: BarChart3, title: "Batch report ready", meta: "2 min ago" },
                            { icon: LineChart, title: "Renewal forecast synced", meta: "9 min ago" },
                        ].map(({ icon: Icon, title, meta }) => (
                            <div key={title} className="flex items-start gap-2.5">
                                <span className="w-7 h-7 rounded-lg bg-[var(--sd-primary)]/20 flex items-center justify-center shrink-0">
                                    <Icon className="w-3.5 h-3.5 text-[var(--sd-accent)]" aria-hidden="true" />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-semibold text-white/85 leading-snug truncate">{title}</p>
                                    <p className="text-[10px] text-white/35">{meta}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/** Light-surface mock: a course builder canvas. */
export function BuilderMock() {
    return (
        <div className="rounded-2xl overflow-hidden border border-[var(--sd-line)] bg-white shadow-sm">
            <WindowChrome label="course builder" />
            <div className="p-4 space-y-2.5">
                {[
                    { label: "Module 01 · Orientation", width: "w-full", done: true },
                    { label: "Module 02 · Core concepts", width: "w-[86%]", done: true },
                    { label: "Module 03 · Live workshop", width: "w-[64%]", done: false },
                    { label: "Module 04 · Assessment", width: "w-[42%]", done: false },
                ].map((row) => (
                    <div
                        key={row.label}
                        className="flex items-center gap-3 rounded-xl border border-[var(--sd-line)] bg-[var(--sd-surface)]/60 px-3 py-2.5"
                    >
                        <span
                            aria-hidden="true"
                            className={`w-2 h-2 rounded-full shrink-0 ${row.done ? "bg-[var(--sd-primary)]" : "bg-slate-300"}`}
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-[var(--sd-text)] truncate">{row.label}</p>
                            <div className="mt-1.5 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${row.width}`}
                                    style={{ background: "var(--sd-gradient)" }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/** Light-surface mock: learner outcome panel with a progress ring. */
export function OutcomeMock() {
    return (
        <div className="rounded-2xl overflow-hidden border border-[var(--sd-line)] bg-white shadow-sm">
            <WindowChrome label="learner outcomes" />
            <div className="p-5 flex items-center gap-5">
                <div
                    className="relative w-24 h-24 rounded-full shrink-0"
                    style={{
                        background: `conic-gradient(var(--sd-primary) 0% 78%, #E2E8F0 78% 100%)`,
                    }}
                    aria-hidden="true"
                >
                    <div className="absolute inset-[10px] rounded-full bg-white flex items-center justify-center">
                        <span className="text-xl font-black text-[var(--sd-text)]">78%</span>
                    </div>
                </div>
                <div className="space-y-2.5 min-w-0">
                    {[
                        { label: "Course completion", value: "78%" },
                        { label: "Assessment pass rate", value: "91%" },
                        { label: "Repeat enrolment", value: "34%" },
                    ].map((row) => (
                        <div key={row.label} className="flex items-center justify-between gap-4">
                            <span className="text-[11px] font-semibold text-[var(--sd-muted)] truncate">{row.label}</span>
                            <span className="text-[11px] font-black text-[var(--sd-text)] shrink-0">{row.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
