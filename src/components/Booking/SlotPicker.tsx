"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CalendarX2, ChevronLeft, ChevronRight, Globe } from "lucide-react";

export interface SlotDay {
  date: string;
  slots: string[];
}

const WINDOW_DAYS = 14;

/** `YYYY-MM-DD` of a date in a time zone */
export function dayIn(tz: string, d: Date): string {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" })
      .formatToParts(d)
      .filter((x) => x.type !== "literal")
      .map((x) => [x.type, x.value])
  );
  return `${p.year}-${p.month}-${p.day}`;
}

export function addDays(date: string, n: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export const timeIn = (iso: string, tz: string) =>
  new Date(iso).toLocaleTimeString("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit" });

export const dateLabel = (date: string, opts: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" }) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { ...opts, timeZone: "UTC" });

export const fullWhen = (iso: string, tz: string) =>
  new Date(iso).toLocaleString("en-US", { timeZone: tz, weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit" });

const hourIn = (iso: string, tz: string) => Number(new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", hourCycle: "h23" }).format(new Date(iso)));

/** Start times split into morning, afternoon and evening, empty parts left out */
function partsOfDay(slots: string[], tz: string) {
  const parts = [
    { label: "Morning", slots: [] as string[] },
    { label: "Afternoon", slots: [] as string[] },
    { label: "Evening", slots: [] as string[] },
  ];
  for (const iso of slots) {
    const h = hourIn(iso, tz);
    parts[h < 12 ? 0 : h < 17 ? 1 : 2].slots.push(iso);
  }
  return parts.filter((p) => p.slots.length);
}

const NO_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

function Skeleton() {
  return (
    <div className="flex flex-col gap-5" aria-busy="true" aria-label="Loading times">
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="h-[84px] w-[76px] shrink-0 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
      <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-100" />
        ))}
      </div>
    </div>
  );
}

/**
 * Two weeks of days at a time; picking a day shows its free start times in the visitor's
 * time zone. `slotsUrl` gets `from`, `to` and `tz` added.
 */
export default function SlotPicker({
  slotsUrl,
  timezone,
  maxDaysAhead,
  selected,
  onSelect,
  headers,
}: {
  /** Extra request headers, e.g. the private booking token when rescheduling */
  headers?: Record<string, string>;
  slotsUrl: string;
  timezone: string;
  maxDaysAhead: number;
  selected: string | null;
  onSelect: (iso: string) => void;
}) {
  const today = useMemo(() => dayIn(timezone, new Date()), [timezone]);
  const lastDay = addDays(today, maxDaysAhead);
  const [from, setFrom] = useState(today);
  const [picked, setPicked] = useState<string | null>(null);
  // Results are kept with the request they answer, so a new request shows "loading" by itself
  const requestKey = `${slotsUrl}|${from}|${timezone}`;
  const [result, setResult] = useState<{ key: string; days: SlotDay[] | null; error: string | null }>({ key: "", days: null, error: null });

  useEffect(() => {
    let cancelled = false;
    const to = addDays(from, WINDOW_DAYS - 1);
    const sep = slotsUrl.includes("?") ? "&" : "?";
    fetch(`${slotsUrl}${sep}from=${from}&to=${to}&tz=${encodeURIComponent(timezone)}`, { cache: "no-store", headers })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data?.error || "Times couldn't load");
        return data as { days: SlotDay[] };
      })
      .then((data) => {
        if (!cancelled) setResult({ key: requestKey, days: data.days.filter((d) => d.slots.length), error: null });
      })
      .catch((e: Error) => {
        if (!cancelled) setResult({ key: requestKey, days: null, error: e.message });
      });
    return () => {
      cancelled = true;
    };
    // headers is fixed for the picker's lifetime (one token per page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, slotsUrl, timezone, requestKey]);

  const current = result.key === requestKey ? result : null;
  const days = current?.days ?? null;
  const error = current?.error ?? null;
  const activeDay = picked && days?.some((d) => d.date === picked) ? picked : days?.[0]?.date ?? null;
  const active = days?.find((d) => d.date === activeDay);
  const canEarlier = from > today;
  const canLater = addDays(from, WINDOW_DAYS) <= lastDay;

  // Day strip: arrows and edge fades show only when there are more days that way
  const strip = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });
  const measure = useCallback(() => {
    const el = strip.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdges({ left: el.scrollLeft > 1, right: el.scrollLeft < max - 1 });
  }, []);
  const hasDays = !!days?.length;

  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    measure();
    // A mouse wheel moves the strip sideways while it can move; at either end the page scrolls
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // trackpads already scroll sideways
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      if ((e.deltaY < 0 && el.scrollLeft <= 0) || (e.deltaY > 0 && el.scrollLeft >= max - 1)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      ro.disconnect();
      el.removeEventListener("wheel", onWheel);
    };
  }, [hasDays, requestKey, measure]);

  // Keep the picked day in view
  useEffect(() => {
    strip.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [activeDay]);

  const scrollStrip = (dir: 1 | -1) => {
    const el = strip.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const navButton = "rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:border-brand-primary hover:text-brand-primary disabled:pointer-events-none disabled:opacity-30";
  const edgeButton = "absolute top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-1.5 text-gray-600 shadow-sm transition-colors hover:border-brand-primary hover:text-brand-primary";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={() => setFrom(addDays(from, -WINDOW_DAYS))} disabled={!canEarlier} aria-label="Earlier dates" className={navButton}>
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="text-sm font-medium text-gray-700" aria-live="polite">
          {dateLabel(from, { day: "numeric", month: "short" })} – {dateLabel(addDays(from, WINDOW_DAYS - 1), { day: "numeric", month: "short", year: "numeric" })}
        </p>
        <button type="button" onClick={() => setFrom(addDays(from, WINDOW_DAYS))} disabled={!canLater} aria-label="Later dates" className={navButton}>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : days === null ? (
        <Skeleton />
      ) : days.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-200 px-4 py-10 text-center">
          <CalendarX2 className="h-6 w-6 text-gray-400" />
          <p className="text-sm font-medium text-gray-800">No times available in these two weeks</p>
          {canLater ? (
            <button type="button" onClick={() => setFrom(addDays(from, WINDOW_DAYS))} className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-brand-primary hover:underline">
              Show later dates <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <p className="text-sm text-gray-500">Please check back later.</p>
          )}
        </div>
      ) : (
        <>
          <div className="relative">
            {edges.left && (
              <>
                <div className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-12 bg-gradient-to-r from-white to-transparent" />
                <button type="button" onClick={() => scrollStrip(-1)} aria-label="Scroll days left" className={`${edgeButton} left-0`}>
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </>
            )}
            <div ref={strip} onScroll={measure} className={`flex snap-x gap-2 overflow-x-auto ${NO_SCROLLBAR}`} role="listbox" aria-label="Available days">
              {days.map((d) => {
                const on = d.date === activeDay;
                return (
                  <button
                    key={d.date}
                    type="button"
                    role="option"
                    aria-selected={on}
                    onClick={() => setPicked(d.date)}
                    className={`flex w-[76px] shrink-0 snap-start flex-col items-center rounded-xl border px-2 py-2 text-sm transition-colors ${
                      on ? "border-brand-primary bg-brand-primary text-white shadow-sm" : "border-gray-200 bg-white text-gray-800 hover:border-brand-primary"
                    }`}
                  >
                    <span className="text-[11px] font-medium uppercase opacity-80">{dateLabel(d.date, { weekday: "short" })}</span>
                    <span className="text-lg font-semibold leading-tight">{dateLabel(d.date, { day: "numeric" })}</span>
                    <span className="text-[11px] opacity-80">{dateLabel(d.date, { month: "short" })}</span>
                  </button>
                );
              })}
            </div>
            {edges.right && (
              <>
                <div className="pointer-events-none absolute inset-y-0 right-0 z-[5] w-12 bg-gradient-to-l from-white to-transparent" />
                <button type="button" onClick={() => scrollStrip(1)} aria-label="Scroll days right" className={`${edgeButton} right-0`}>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          {active && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="text-sm font-semibold text-gray-900">{dateLabel(active.date, { weekday: "long", day: "numeric", month: "long" })}</p>
                <p className="flex items-center gap-1 text-xs text-gray-500">
                  <Globe className="h-3.5 w-3.5" /> Times in {timezone.replace(/_/g, " ")}
                </p>
              </div>
              {partsOfDay(active.slots, timezone).map((part) => (
                <div key={part.label}>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">{part.label}</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {part.slots.map((iso) => (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => onSelect(iso)}
                        aria-pressed={selected === iso}
                        className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors ${
                          selected === iso ? "border-brand-primary bg-brand-primary text-white shadow-sm" : "border-gray-200 bg-white text-gray-800 hover:border-brand-primary hover:text-brand-primary"
                        }`}
                      >
                        {timeIn(iso, timezone)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
