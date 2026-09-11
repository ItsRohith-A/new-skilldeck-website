"use client";

import { ArrowUpRight } from "lucide-react";
import { useLeadModal } from "@/components/Forms/LeadModalContext";

interface ServiceMobileCtaProps {
    serviceName: string;
}

export default function ServiceMobileCta({ serviceName }: ServiceMobileCtaProps) {
    const { openModal } = useLeadModal();

    return (
        <div className="lg:hidden fixed bottom-4 inset-x-4 z-40">
            <button
                type="button"
                onClick={() =>
                    openModal({
                        source: "service-mobile-cta",
                        formTitle: `Get a Quote for ${serviceName}`,
                        defaultValues: { subject: `Quote request for ${serviceName}`, selectedService: serviceName },
                    })
                }
                className="w-full flex items-center justify-between gap-3 bg-brand-dark text-white rounded-2xl px-5 py-4 shadow-2xl shadow-brand-dark/30"
            >
                <span className="text-sm font-bold">Start the Conversation</span>
                <span className="w-8 h-8 rounded-full bg-brand-secondary flex items-center justify-center shrink-0">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                </span>
            </button>
        </div>
    );
}
