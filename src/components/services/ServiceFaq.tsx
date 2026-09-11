"use client";

import { useState } from "react";
import { ArrowUpRight, MessageCircleQuestion, Minus, Plus } from "lucide-react";
import { ServiceFAQs } from "./types";
import ServiceSectionIntro from "./ServiceSectionIntro";
import { normalizeRichText } from "./richText";
import { Button } from "@/components/ui/Button";
import { useLeadModal } from "@/components/Forms/LeadModalContext";
import { useServiceIdentity } from "./ServiceIdentityContext";

interface ServiceFaqProps {
    faqs?: ServiceFAQs;
    serviceName?: string;
}

/** Numbered, minimal-rule FAQ list with an upfront contact card. */
export default function ServiceFaq({ faqs, serviceName }: ServiceFaqProps) {
    const { openModal } = useLeadModal();
    const service = useServiceIdentity();
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const items = (faqs?.accordions || []).filter((f) => f?.title);

    if (items.length === 0) return null;

    return (
        <section id="faq" className="scroll-mt-24 section-y">
            <div className="container mx-auto px-4 lg:px-0">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
                    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28 self-start">
                        <ServiceSectionIntro
                            numeral="08"
                            kicker={faqs?.tagline || "Got Questions?"}
                            title={faqs?.title || "Frequently Asked Questions"}
                            description={faqs?.description}
                        />

                        {/* The flat grey box read as a disabled panel; the dark card gives the
                            ask-us prompt the weight of an actual offer. */}
                        <div className="relative overflow-hidden rounded-2xl bg-brand-dark p-6 space-y-4">
                            <div
                                aria-hidden="true"
                                className="absolute -top-20 -right-16 w-56 h-56 rounded-full blur-3xl opacity-30 pointer-events-none"
                                style={{ background: "var(--gradient-brand)" }}
                            />
                            <span
                                aria-hidden="true"
                                className="absolute inset-x-0 top-0 h-1"
                                style={{ background: "var(--gradient-brand)" }}
                            />

                            <div className="relative space-y-3">
                                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                                    <MessageCircleQuestion className="w-5 h-5 text-white" />
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-base font-extrabold text-white">Still not sure?</p>
                                    <p className="text-sm text-white/60 leading-relaxed">
                                        Talk to our team for a straight answer, not a sales pitch.
                                    </p>
                                </div>
                                <Button
                                    onClick={() => openModal({
                                        source: "service-faq",
                                        formTitle: serviceName ? `Ask Our Team about ${serviceName}` : "Ask Our Team",
                                        serviceSlug: service?.slug,
                                        defaultValues: service ? { selectedService: service.name } : undefined,
                                    })}
                                    variant="primary"
                                    className="w-full rounded-xl font-bold gap-2 cursor-pointer"
                                >
                                    Ask a question
                                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 divide-y divide-slate-200">
                        {items.map((item, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <div key={index} className="py-5">
                                    <button
                                        type="button"
                                        onClick={() => setOpenIndex(isOpen ? null : index)}
                                        aria-expanded={isOpen}
                                        className="w-full flex items-start gap-4 text-left group"
                                    >
                                        <span className="text-xs font-black text-brand-primary/40 pt-0.5 w-6 shrink-0">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <span className="flex-1 text-sm md:text-base font-bold text-brand-dark group-hover:text-brand-primary transition-colors">
                                            {item.title}
                                        </span>
                                        <span className="shrink-0 text-brand-primary">
                                            {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                        </span>
                                    </button>
                                    {/* Every answer stays in the DOM and is collapsed with CSS —
                                        unmounting the closed ones hides them from crawlers, and the
                                        page emits FAQPage structured data claiming all of them. */}
                                    {item.description && (
                                        <div
                                            className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                                }`}
                                        >
                                            <div className="overflow-hidden">
                                                <div
                                                    className="pl-10 pt-3 text-sm text-brand-muted leading-relaxed prose prose-sm max-w-none prose-p:my-1"
                                                    dangerouslySetInnerHTML={{ __html: normalizeRichText(item.description) }}
                                                />
                                            </div>
                                        </div>
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
