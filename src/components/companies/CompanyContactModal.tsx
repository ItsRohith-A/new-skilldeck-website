"use client";

import CompanyForm from "@/components/Forms/CompanyForm";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface CompanyContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    tenantId?: string;
    companyName?: string;
    scheduleId?: string;
    courseId?: string;
    courseTitle?: string;
    showPreferredDateTime?: boolean;
}

export default function CompanyContactModal({
    isOpen,
    onClose,
    tenantId,
    companyName = "",
    scheduleId,
    courseId,
    courseTitle,
    showPreferredDateTime = false
}: CompanyContactModalProps) {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-999999 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-red-500"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-6">
                    <h3 className="heading-card font-bold text-gray-900">Request Callback</h3>
                    <p className="text-gray-500 text-sm mt-1">
                        Leave your details and {companyName} will contact you shortly.
                    </p>
                </div>

                <CompanyForm
                    onClose={onClose}
                    tenantId={tenantId}
                    scheduleId={scheduleId}
                    courseId={courseId}
                    courseTitle={courseTitle}
                    showPreferredDateTime={showPreferredDateTime}
                />
            </div>
        </div>,
        document.body
    );
}
