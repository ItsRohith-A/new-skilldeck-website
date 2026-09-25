"use client";

import Image from "next/image";
import { courseSubject, titleFromSlug } from "@/lib/courseTitle";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Building2, CheckCircle2, ChevronDown, ChevronRight, Info, Monitor, Plus, Star, TrendingDown, X, Zap } from "lucide-react";
import { formatPrice, getCurrencySymbol } from "@/lib/courseCardHelpers";
import ComparePickerModal, { PickerItem } from "@/components/compare/ComparePickerModal";
import CompanyContactButton from "@/components/companies/CompanyContactButton";

/** Only the schedule fields this table compares on. */
interface PartnerSchedule {
    deliveryType?: string;
    batchType?: string;
    venu?: string;
    country?: { name?: string };
    totalSessions?: number | string;
    duration?: number | string;
    startsAt?: string;
    commencementDate?: string;
    seatsAvailable?: number;
    enableFastfilling?: boolean;
    enableRecommend?: boolean;
    isFlexibleSchedule?: boolean;
    isFeatured?: boolean;
}

/** An institute row from TopPartnersSection: mapToInstitute output + price/schedule aggregates. */
export interface ComparisonPartner {
    id: string;
    _id?: string;
    name: string;
    slug?: string;
    logo?: string;
    rating?: number;
    reviewCount?: number;
    industry?: string;
    companySize?: string;
    established?: string;
    highlights?: string[];
    symbol?: string;
    lowestPrice?: number;
    lowestCompared?: number;
    schedules?: PartnerSchedule[];
}

interface PartnerComparisonTableProps {
    partners: ComparisonPartner[];
    activeCurrency: string;
    maxCompare?: number;
    /** Trims to the headline rows, with an in-place toggle for the rest. */
    compact?: boolean;
    /** Enables the deep link into the standalone /compare page. */
    courseSlug?: string;
    /** Course title to display in comparison header. */
    courseTitle?: string;
    /** The location segment on a city URL, e.g. "mumbai". Absent on the plain course URL. */
    locationSlug?: string;
    /** Ids currently ticked on the cards; empty means "show the default top N". */
    compareList?: string[];
    onAdd?: (id: string) => void;
    onRemove?: (id: string) => void;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(value?: string): string {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * The backend occasionally returns currency symbols double-encoded (₹ arrives as
 * "â‚¹"), so fall back to a known-good symbol when the string is not printable.
 */
function safeSymbol(symbol: string | undefined, currency: string): string {
    if (!symbol || /[ÂÃâ]/.test(symbol)) return getCurrencySymbol(currency);
    return symbol;
}

function titleCase(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Collapse every schedule for a partner into the values the table compares on. */
function summarise(partner: ComparisonPartner, activeCurrency: string) {
    const schedules: PartnerSchedule[] = partner.schedules || [];
    const isText = (v: string | undefined): v is string => Boolean(v && v.trim());

    const modes = Array.from(new Set(schedules.map((s) => s.deliveryType).filter(isText).map(titleCase)));
    const batchTypes = Array.from(new Set(schedules.map((s) => s.batchType).filter(isText).map(titleCase)));
    const locations = Array.from(new Set(schedules.map((s) => s.venu || s.country?.name).filter(isText)));

    const sessions = schedules.map((s) => Number(s.totalSessions)).filter((n) => n > 0);
    const minutes = schedules.map((s) => Number(s.duration)).filter((n) => n > 0);

    const startDates = schedules
        .map((s) => s.startsAt || s.commencementDate)
        .filter(isText)
        .map((v) => new Date(v))
        .filter((d) => !Number.isNaN(d.getTime()))
        .sort((a, b) => a.getTime() - b.getTime());

    const seats = schedules.map((s) => Number(s.seatsAvailable)).filter((n) => Number.isFinite(n) && n > 0);

    const symbol = safeSymbol(partner.symbol, activeCurrency);
    const price = Number(partner.lowestPrice) || 0;
    const listPrice = Number(partner.lowestCompared) || 0;
    const discount = listPrice > price && price > 0 ? Math.round(((listPrice - price) / listPrice) * 100) : 0;

    return {
        modes,
        batchTypes,
        locations,
        sessions: sessions.length ? Math.max(...sessions) : 0,
        minutes: minutes.length ? Math.max(...minutes) : 0,
        nextBatch: startDates.length ? formatDate(startDates[0].toISOString()) : "",
        seatsLeft: seats.length ? Math.min(...seats) : 0,
        fillingFast: schedules.some((s) => s.enableFastfilling),
        recommended: schedules.some((s) => s.enableRecommend),
        flexible: schedules.some((s) => s.isFlexibleSchedule),
        featured: schedules.some((s) => s.isFeatured),
        symbol,
        price,
        listPrice,
        discount,
    };
}

const Yes = () => <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" aria-label="Yes" />;
const No = () => <X className="w-4 h-4 text-slate-300 mx-auto" aria-label="No" />;
const Dash = () => <span className="text-slate-300">—</span>;

/** Sticky label column needs an opaque fill so scrolled cells do not show through. */
const LABEL_CELL =
    "text-left px-3 md:px-4 py-3 text-[11px] md:text-xs font-bold text-slate-700 bg-slate-50 sticky left-0 z-10 border-r border-slate-200";

export default function PartnerComparisonTable({
    partners,
    activeCurrency,
    maxCompare = 4,
    compact = false,
    courseSlug,
    courseTitle,
    locationSlug,
    compareList = [],
    onAdd,
    onRemove,
}: PartnerComparisonTableProps) {
    const [pickerOpen, setPickerOpen] = useState(false);
    /** Full comparison by default; the viewer can collapse it to the headline rows. */
    const [showAllRows, setShowAllRows] = useState(true);

    const selected = useMemo(() => {
        const picked = compareList.length > 0
            ? partners.filter((p) => compareList.includes(p.id))
            : partners.slice(0, maxCompare);
        return picked.slice(0, maxCompare);
    }, [partners, compareList, maxCompare]);

    const available = useMemo(
        () => partners.filter((p) => !selected.some((s) => s.id === p.id)),
        [partners, selected]
    );

    const pickerItems: PickerItem[] = useMemo(
        () =>
            available.map((p) => ({
                key: p.id,
                title: p.name,
                subtitle: [p.industry, p.companySize].filter(Boolean).join(" · "),
                logo: p.logo,
                group: "Institutes" as const,
            })),
        [available]
    );

    const rows = useMemo(() => selected.map((p) => summarise(p, activeCurrency)), [selected, activeCurrency]);

    if (selected.length === 0) return null;

    const cheapest = Math.min(...rows.map((r) => r.price).filter((n) => n > 0));
    const mostSessions = Math.max(...rows.map((r) => r.sessions));

    // Only render a row when at least one partner actually has the data.
    const has = {
        rating: selected.some((p) => Number(p.rating) > 0),
        price: rows.some((r) => r.price > 0),
        sessions: rows.some((r) => r.sessions > 0),
        minutes: rows.some((r) => r.minutes > 0),
        nextBatch: rows.some((r) => r.nextBatch),
        mode: rows.some((r) => r.modes.length > 0),
        batchType: rows.some((r) => r.batchTypes.length > 0),
        location: rows.some((r) => r.locations.length > 0),
        seats: rows.some((r) => r.seatsLeft > 0),
        flags: rows.some((r) => r.fillingFast || r.recommended || r.flexible || r.featured),
        established: selected.some((p) => p.established),
        team: selected.some((p) => p.companySize),
        industry: selected.some((p) => p.industry),
        highlights: selected.some((p) => (p.highlights || []).length > 0),
    };

    // Preview on the course page: headline rows only until expanded in place.
    if (compact && !showAllRows) {
        has.minutes = false;
        has.batchType = false;
        has.location = false;
        has.seats = false;
        has.flags = false;
        has.established = false;
        has.team = false;
    }

    const canAdd = selected.length < maxCompare && available.length > 0;

    // Carries the current selection so /compare opens on the same companies.
    const fullComparisonHref = courseSlug
        ? `/compare?type=companies&course=${encodeURIComponent(courseSlug)}` +
        (courseTitle ? `&title=${encodeURIComponent(courseTitle)}` : "") +
        (locationSlug ? `&city=${encodeURIComponent(locationSlug)}` : "") +
        (selected.length > 0 ? `&ids=${selected.map((p) => p.id).join(",")}` : "")
        : undefined;

    const columnCount = selected.length + (canAdd ? 1 : 0);

    const companyHref = (p: ComparisonPartner) =>
        p.slug ? `/companies/${p.slug}?id=${p.id || p._id}` : `/companies/${p.id || p._id}`;

    const addPickerOnPrimary = (
        <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="w-full inline-flex items-center justify-center gap-1.5 h-9 rounded-xl border border-dashed border-white/50 text-[11px] md:text-xs font-bold text-white hover:bg-white/10 transition-colors"
        >
            <Plus className="w-3.5 h-3.5" />
            Add Company
        </button>
    );

    const addPicker = (
        <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="w-full inline-flex items-center justify-center gap-1.5 h-9 rounded-xl border border-dashed border-slate-300 text-[11px] md:text-xs font-bold text-slate-500 hover:border-[#5544CC] hover:text-[#5544CC] transition-colors"
        >
            <Plus className="w-3.5 h-3.5" />
            Add Company
        </button>
    );

    const subject = courseSubject(courseTitle, courseSlug);
    const city = locationSlug ? titleFromSlug(locationSlug) : "";

    return (
        <div className="space-y-4" id="compare-partners">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                    <h3 className="text-base md:text-lg font-extrabold text-slate-800 tracking-tight">
                        Compare {subject ? `${subject} ` : ""}Training Centers{city ? ` in ${city}` : ""}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                        {compact && !showAllRows
                            ? "A quick side by side look — expand for every detail"
                            : "Compare course fees, curriculum, duration, learning modes, reviews, and other key details before you enroll."}
                    </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                    {/* States a limit rather than offering an action, so it reads as a
                        note, not a control -- nothing here is clickable. */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-100 text-[11px] font-medium text-sky-900">
                        <Info className="w-3.5 h-3.5 shrink-0 text-sky-500" />
                        You Compare up to {maxCompare} Companies
                    </span>
                    {compact && (
                        <button
                            type="button"
                            onClick={() => setShowAllRows((v) => !v)}
                            aria-expanded={showAllRows}
                            aria-controls="compare-partners-table"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-500 bg-white text-[11px] font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                            {showAllRows ? "Show less" : "Detailed comparison"}
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllRows ? "rotate-180" : ""}`} />
                        </button>
                    )}
                </div>
            </div>

            {/* Swipe affordance — the table scrolls sideways below lg. */}
            <p className="lg:hidden flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                Swipe to compare
                <ChevronRight className="w-3.5 h-3.5" />
            </p>

            {/*
                overflow-auto makes this element a scroll container on both axes, so the
                sticky header anchors here rather than to the viewport. Capping the
                height gives it somewhere to stick to during vertical scroll.
            */}
            <div id="compare-partners-table" className="overflow-auto max-h-[70vh] rounded-2xl border border-slate-200 bg-white overscroll-x-contain">
                <table className="w-full table-fixed border-collapse">
                    <colgroup>
                        <col className="w-[110px] md:w-[170px]" />
                        {Array.from({ length: columnCount }).map((_, i) => (
                            <col key={i} className="w-[160px] md:w-[210px]" />
                        ))}
                    </colgroup>

                    <thead>
                        <tr>
                            <th className="text-left px-3 md:px-4 py-3.5 font-bold text-white text-[10px] md:text-xs uppercase tracking-wide bg-brand-primary sticky left-0 top-0 z-30 border-b border-brand-primary">
                                Companies
                            </th>
                            {selected.map((p) => (
                                <th
                                    key={p.id}
                                    className="px-3 md:px-4 py-3.5 bg-brand-primary sticky top-0 z-20 border-b border-l border-white/20 align-middle"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="relative w-7 h-7 shrink-0 rounded-lg bg-white p-0.5">
                                            {p.logo ? (
                                                <Image src={p.logo} alt={p.name} fill sizes="28px" className="object-contain p-0.5" />
                                            ) : (
                                                <span className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[11px] font-black text-brand-primary">
                                                    {p.name?.charAt(0)}
                                                </span>
                                            )}
                                        </span>
                                        <Link
                                            href={companyHref(p)}
                                            data-no-loader="true"
                                            title={p.name}
                                            rel="nofollow"
                                            className="flex-1 min-w-0 text-[11px] md:text-xs font-bold text-white hover:text-white/80 transition-colors line-clamp-2 text-left"
                                        >
                                            {p.name}
                                        </Link>
                                        {onRemove && (
                                            <button
                                                type="button"
                                                onClick={() => onRemove(p.id)}
                                                aria-label={`Remove ${p.name} from comparison`}
                                                className="shrink-0 text-white/60 hover:text-white transition-colors"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {canAdd && (
                                <th className="px-3 md:px-4 py-3.5 bg-brand-primary sticky top-0 z-20 border-b border-l border-white/20 align-middle">
                                    {addPickerOnPrimary}
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {has.rating && (
                            <Row label="Overall Rating" canAdd={canAdd}>
                                {selected.map((p) => (
                                    <Cell key={p.id}>
                                        {Number(p.rating) > 0 ? (
                                            <span className="inline-flex items-center gap-1.5 font-bold text-slate-800">
                                                {p.rating}
                                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                {p.reviewCount ? (
                                                    <span className="text-[11px] font-medium text-slate-400">({p.reviewCount})</span>
                                                ) : null}
                                            </span>
                                        ) : <Dash />}
                                    </Cell>
                                ))}
                            </Row>
                        )}

                        {has.price && (
                            <Row label="Course Fee" canAdd={canAdd}>
                                {rows.map((r, i) => (
                                    <Cell key={selected[i].id}>
                                        {r.price > 0 ? (
                                            <div className="flex flex-col items-center gap-0.5">
                                                <span className={`font-bold inline-flex items-center gap-1 ${r.price === cheapest ? "text-emerald-600" : "text-slate-800"}`}>
                                                    {formatPrice(r.price, r.symbol)}
                                                    {r.price === cheapest && <TrendingDown className="w-3.5 h-3.5" />}
                                                </span>
                                                {r.listPrice > r.price && (
                                                    <span className="text-[11px] text-slate-400 line-through">
                                                        {formatPrice(r.listPrice, r.symbol)}
                                                    </span>
                                                )}
                                                {r.discount > 0 && (
                                                    <span className="text-[10px] font-bold text-emerald-600">{r.discount}% off</span>
                                                )}
                                            </div>
                                        ) : <span className="text-slate-400 italic text-xs">Get Quote</span>}
                                    </Cell>
                                ))}
                            </Row>
                        )}

                        {has.sessions && (
                            <Row label="Sessions" canAdd={canAdd}>
                                {rows.map((r, i) => (
                                    <Cell key={selected[i].id}>
                                        {r.sessions > 0 ? (
                                            <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border ${r.sessions === mostSessions ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-600 border-slate-200"}`}>
                                                {r.sessions} Sessions
                                            </span>
                                        ) : <Dash />}
                                    </Cell>
                                ))}
                            </Row>
                        )}

                        {has.minutes && (
                            <Row label="Session Duration" canAdd={canAdd}>
                                {rows.map((r, i) => (
                                    <Cell key={selected[i].id}>{r.minutes > 0 ? `${r.minutes} mins` : <Dash />}</Cell>
                                ))}
                            </Row>
                        )}

                        {has.nextBatch && (
                            <Row label="Next Batch" canAdd={canAdd}>
                                {rows.map((r, i) => (
                                    <Cell key={selected[i].id}>{r.nextBatch || <Dash />}</Cell>
                                ))}
                            </Row>
                        )}

                        {has.mode && (
                            <Row label="Mode" canAdd={canAdd}>
                                {rows.map((r, i) => (
                                    <Cell key={selected[i].id}>
                                        {r.modes.length > 0 ? (
                                            <span className="inline-flex items-center gap-1.5 text-[11px] md:text-xs font-medium text-slate-700">
                                                {r.modes.some((m) => /class|offline/i.test(m))
                                                    ? <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                    : <Monitor className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                                                {r.modes.join(" / ")}
                                            </span>
                                        ) : <Dash />}
                                    </Cell>
                                ))}
                            </Row>
                        )}

                        {has.batchType && (
                            <Row label="Batch Type" canAdd={canAdd}>
                                {rows.map((r, i) => (
                                    <Cell key={selected[i].id}>
                                        {r.batchTypes.length > 0 ? (
                                            <span className="inline-block px-2 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] text-slate-600 capitalize">
                                                {r.batchTypes.join(" / ")}
                                            </span>
                                        ) : <Dash />}
                                    </Cell>
                                ))}
                            </Row>
                        )}

                        {has.location && (
                            <Row label="Location" canAdd={canAdd}>
                                {rows.map((r, i) => (
                                    <Cell key={selected[i].id}>
                                        {r.locations.length > 0 ? (
                                            <span
                                                className="block text-[11px] text-slate-600 line-clamp-3"
                                                title={r.locations.join(", ")}
                                            >
                                                {r.locations[0]}
                                                {r.locations.length > 1 && (
                                                    <span className="text-slate-400"> +{r.locations.length - 1}</span>
                                                )}
                                            </span>
                                        ) : <Dash />}
                                    </Cell>
                                ))}
                            </Row>
                        )}

                        {has.seats && (
                            <Row label="Seats Available" canAdd={canAdd}>
                                {rows.map((r, i) => (
                                    <Cell key={selected[i].id}>{r.seatsLeft > 0 ? `${r.seatsLeft} left` : <Dash />}</Cell>
                                ))}
                            </Row>
                        )}

                        {has.flags && (
                            <>
                                <Row label="Filling Fast" canAdd={canAdd}>
                                    {rows.map((r, i) => (
                                        <Cell key={selected[i].id}>
                                            {r.fillingFast ? (
                                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600">
                                                    <Zap className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> Yes
                                                </span>
                                            ) : <No />}
                                        </Cell>
                                    ))}
                                </Row>
                                <Row label="Flexible Schedule" canAdd={canAdd}>
                                    {rows.map((r, i) => (
                                        <Cell key={selected[i].id}>{r.flexible ? <Yes /> : <No />}</Cell>
                                    ))}
                                </Row>
                                <Row label="Recommended" canAdd={canAdd}>
                                    {rows.map((r, i) => (
                                        <Cell key={selected[i].id}>{r.recommended ? <Yes /> : <No />}</Cell>
                                    ))}
                                </Row>
                            </>
                        )}

                        {has.industry && (
                            <Row label="Specialisation" canAdd={canAdd}>
                                {selected.map((p) => (
                                    <Cell key={p.id}>
                                        {p.industry ? (
                                            <span className="text-[11px] md:text-xs font-semibold text-purple-600 capitalize line-clamp-2">
                                                {p.industry}
                                            </span>
                                        ) : <Dash />}
                                    </Cell>
                                ))}
                            </Row>
                        )}

                        {has.established && (
                            <Row label="Established" canAdd={canAdd}>
                                {selected.map((p) => <Cell key={p.id}>{p.established || <Dash />}</Cell>)}
                            </Row>
                        )}

                        {has.team && (
                            <Row label="Team Size" canAdd={canAdd}>
                                {selected.map((p) => <Cell key={p.id}>{p.companySize || <Dash />}</Cell>)}
                            </Row>
                        )}

                        {has.highlights && (
                            <Row label="Key Highlights" canAdd={canAdd} align="top">
                                {selected.map((p) => (
                                    <Cell key={p.id} align="top">
                                        {(p.highlights || []).length > 0 ? (
                                            <ul className="space-y-1.5 text-left">
                                                {(p.highlights || []).slice(0, 5).map((h) => (
                                                    <li key={h} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#5544CC] shrink-0 mt-0.5" />
                                                        <span className="line-clamp-2">{h}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : <Dash />}
                                    </Cell>
                                ))}
                            </Row>
                        )}

                        {/* Closing CTA row */}
                        <tr>
                            <td className={`${LABEL_CELL} py-4`} />
                            {selected.map((p) => (
                                <td key={p.id} className="px-3 md:px-4 py-4 border-l border-slate-100 align-middle space-y-2">
                                    <Link
                                        href={companyHref(p)}
                                        data-no-loader="true"
                                        rel="nofollow"
                                        className="w-full inline-flex items-center justify-center gap-1.5 h-9 rounded-xl border border-slate-200 text-[11px] md:text-xs font-bold text-slate-700 hover:border-brand-primary/40 hover:text-brand-primary transition-colors"
                                    >
                                        View Full Details
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>

                                    {/* Company-targeted, so the enquiry lands in this
                                        institute's CRM rather than the platform inbox. */}
                                    <CompanyContactButton
                                        tenantId={p.id || p._id}
                                        companyName={p.name}
                                        courseId={courseSlug}
                                        courseTitle={courseTitle || (courseSlug ? titleFromSlug(courseSlug) : undefined)}
                                        renderButton={(onClick) => (
                                            <button
                                                type="button"
                                                onClick={onClick}
                                                className="w-full inline-flex items-center justify-center h-9 rounded-xl text-[11px] md:text-xs font-bold text-white bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] hover:brightness-110 transition-all"
                                            >
                                                Enquire now
                                            </button>
                                        )}
                                    />
                                </td>
                            ))}
                            {canAdd && (
                                <td className="px-3 md:px-4 py-4 border-l border-slate-100 align-middle">{addPicker}</td>
                            )}
                        </tr>
                    </tbody>
                </table>
            </div>

            {compact && (
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        type="button"
                        onClick={() => setShowAllRows((v) => !v)}
                        aria-expanded={showAllRows}
                        aria-controls="compare-partners-table"
                        className="w-full sm:flex-1 min-w-0 flex items-center justify-center gap-2 h-9 rounded-xl border border-brand-primary/30 bg-white text-xs md:text-sm font-bold text-brand-primary hover:bg-brand-primary hover:text-white transition-colors"
                    >
                        {showAllRows ? "Show fewer details" : "Show detailed comparison report"}
                        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${showAllRows ? "rotate-180" : ""}`} />
                    </button>

                    {fullComparisonHref && (
                        <Link
                            href={fullComparisonHref}
                            rel="nofollow"
                            className="w-full sm:flex-1 min-w-0 flex items-center justify-center gap-2 h-9 rounded-xl text-xs md:text-sm font-bold text-white bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] hover:brightness-110 transition-all"
                        >
                            Open full comparison page
                            <ArrowRight className="w-4 h-4 shrink-0" />
                        </Link>
                    )}
                </div>
            )}

            <p className="text-center text-[11px] text-slate-400">
                * Course fees and details are indicative and may vary. Please check official websites for latest information.
            </p>

            {pickerOpen && (
                <ComparePickerModal
                    items={pickerItems}
                    noun="a company"
                    onPick={(id) => {
                        onAdd?.(id);
                        setPickerOpen(false);
                    }}
                    onClose={() => setPickerOpen(false)}
                />
            )}
        </div>
    );
}

function Row({
    label,
    children,
    canAdd,
    align = "middle",
}: {
    label: string;
    children: React.ReactNode;
    canAdd: boolean;
    align?: "middle" | "top";
}) {
    const valign = align === "top" ? "align-top" : "align-middle";
    return (
        <tr>
            <th scope="row" className={`${LABEL_CELL} ${valign}`}>
                {label}
            </th>
            {children}
            {canAdd && <td className={`px-3 md:px-4 py-3 border-l border-slate-100 ${valign}`} />}
        </tr>
    );
}

function Cell({ children, align = "middle" }: { children: React.ReactNode; align?: "middle" | "top" }) {
    const valign = align === "top" ? "align-top" : "align-middle";
    return (
        <td className={`px-3 md:px-4 py-3 border-l border-slate-100 text-center text-slate-700 ${valign}`}>
            {children}
        </td>
    );
}
