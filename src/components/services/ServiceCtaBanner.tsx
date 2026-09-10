"use client";

import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLeadModal } from "@/components/Forms/LeadModalContext";

interface ServiceCtaBannerProps {
    title: string;
    description?: string;
    buttonLabel?: string;
    source?: string;
    dark?: boolean;
}

/** Soft accent CTA card with a gradient edge rule. */
export default function ServiceCtaBanner({
    title,
    description,
    buttonLabel = "Talk To Our Team",
    source = "service-cta-banner",
    dark
}: ServiceCtaBannerProps) {
    const { openModal } = useLeadModal();

    return (
        <div
            className={`relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-5 rounded-2xl border p-6 md:p-7 ${dark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm"
                }`}
        >
            <span
                aria-hidden="true"
                className="absolute left-0 top-0 bottom-0 w-1"
                style={{ background: "var(--gradient-brand)" }}
            />
            <div className="space-y-1">
                <h4 className={`text-base font-bold leading-snug ${dark ? "text-white" : "text-brand-dark"}`}>{title}</h4>
                {description && (
                    <p className={`text-xs max-w-xl ${dark ? "text-white/60" : "text-brand-muted"}`}>{description}</p>
                )}
            </div>
            <Button
                onClick={() => openModal({ source, formTitle: title })}
                variant={dark ? "primary" : "outline-primary"}
                className="shrink-0 rounded-full font-bold text-sm cursor-pointer"
            >
                {buttonLabel}
                <ArrowUpRight className="w-4 h-4" />
            </Button>
        </div>
    );
}
