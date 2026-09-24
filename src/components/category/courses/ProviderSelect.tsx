"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Building2, CalendarDays, Check, ChevronDown } from "lucide-react";
import { formatDate } from "@/lib/courseCardHelpers";
import type { PlatformSchedule } from "@/types/hero";

export interface ProviderOption {
    tenantId: string;
    name: string;
    logo?: string;
    schedule: PlatformSchedule;
}

interface ProviderSelectProps {
    providers: ProviderOption[];
    value?: string;
    onChange: (tenantId: string) => void;
    placeholder?: string;
    id?: string;
}

function ProviderLogo({ provider, size = "md" }: { provider: ProviderOption; size?: "sm" | "md" }) {
    const box = size === "sm" ? "w-7 h-7" : "w-8 h-8";

    if (!provider.logo) {
        return (
            <span className={`${box} rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0`}>
                <Building2 className="w-3.5 h-3.5 text-brand-primary" />
            </span>
        );
    }

    return (
        <span className={`${box} relative rounded-lg bg-white border border-slate-100 overflow-hidden shrink-0`}>
            <Image
                src={provider.logo}
                alt=""
                fill
                sizes="32px"
                className="object-contain p-0.5"
            />
        </span>
    );
}

/**
 * Provider picker for the hero lead form.
 *
 * A native `<select>` could not show the logos, and on Windows it renders the
 * long "name — starts date" strings in the OS dropdown style, which looked
 * nothing like the rest of the card.
 */
export default function ProviderSelect({
    providers,
    value,
    onChange,
    placeholder = "Select a training provider",
    id = "hero-provider",
}: ProviderSelectProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selected = providers.find((p) => p.tenantId === value);

    useEffect(() => {
        if (!open) return;

        const onPointerDown = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
        };
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };

        document.addEventListener("mousedown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    return (
        <div ref={containerRef} className="relative">
            <button
                id={id}
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className={`w-full flex items-center gap-2.5 bg-white border rounded-xl pl-3 pr-9 py-2.5 text-left transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${open ? "border-brand-primary" : "border-slate-200 hover:border-brand-primary/50"
                    }`}
            >
                {selected ? (
                    <>
                        <ProviderLogo provider={selected} />
                        <span className="min-w-0 flex-1">
                            <span className="block text-xs 2xl:text-sm font-bold text-slate-800 truncate">
                                {selected.name}
                            </span>
                            {selected.schedule.startsAt && (
                                <span className="flex items-center gap-1 text-[10px] text-slate-500">
                                    <CalendarDays className="w-2.5 h-2.5" />
                                    Starts {formatDate(selected.schedule.startsAt)}
                                </span>
                            )}
                        </span>
                    </>
                ) : (
                    <span className="flex-1 text-xs 2xl:text-sm font-semibold text-slate-400">
                        {placeholder}
                    </span>
                )}

                <ChevronDown
                    className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""
                        }`}
                />
            </button>

            {open && (
                <div
                    role="listbox"
                    aria-label="Training providers"
                    className="absolute z-30 mt-2 w-full max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 p-1.5"
                >
                    {providers.map((provider) => {
                        const isSelected = provider.tenantId === value;
                        return (
                            <button
                                key={provider.tenantId}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => {
                                    onChange(provider.tenantId);
                                    setOpen(false);
                                }}
                                className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left transition-colors cursor-pointer ${isSelected ? "bg-brand-primary/10" : "hover:bg-slate-50"
                                    }`}
                            >
                                <ProviderLogo provider={provider} size="sm" />

                                <span className="min-w-0 flex-1">
                                    <span className="block text-xs font-bold text-slate-800 truncate">
                                        {provider.name}
                                    </span>
                                    {provider.schedule.startsAt && (
                                        <span className="flex items-center gap-1 text-[10px] text-slate-500">
                                            <CalendarDays className="w-2.5 h-2.5" />
                                            Starts {formatDate(provider.schedule.startsAt)}
                                        </span>
                                    )}
                                </span>

                                {isSelected && <Check className="w-3.5 h-3.5 text-brand-primary shrink-0" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
