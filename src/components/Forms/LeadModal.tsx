'use client';

import { MailIcon, PhoneCall, Sparkles, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';
import img from '../../../public/heroSection/woman_laptop.webp';
import InteractiveDotBackground from '../ui/InteractiveDotBackground';
import GenericForm from './GenericForm';
import { useLeadModal } from './LeadModalContext';

const LeadModal = () => {
    const { isOpen, closeModal, modalConfig } = useLeadModal();

    // Close form on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeModal();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, closeModal]);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // Determine the form type: defaults to 'enquiry', uses 'corporate' if specified
    const formType = modalConfig.source === 'corporate' ? 'corporate' : 'enquiry';

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={closeModal}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-md md:max-w-lg lg:max-w-2xl z-10 animate-fade-in-up bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center lg:flex-row max-h-[85vh]">
                {/* Cancel button */}
                <button
                    onClick={closeModal}
                    className="absolute top-3 right-3 border border-gray-200 rounded-full p-1.5 cursor-pointer text-gray-500 hover:text-red-500 hover:border-red-500 transition-colors z-20 bg-white shadow-sm"
                    aria-label="Close modal"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Left Visual Panel - Desktop Only */}
                <div className="hidden lg:flex relative w-[38%] self-stretch bg-gradient-to-br from-brand-dark to-slate-900 text-white overflow-hidden p-6 flex-col justify-between">
                    {/* Interactive Dot Grid Background */}
                    <InteractiveDotBackground dotColor="rgba(255, 255, 255, 0.12)" radius={1.2} gap={16} />

                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

                    {/* Content Section */}
                    <div className="relative z-10 space-y-2">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md rounded-full px-2.5 py-1 shadow-sm w-fit border border-white/10">
                            <Sparkles className="w-3.5 h-3.5 text-brand-primary animate-pulse" />
                            <span className="text-[11px] font-semibold tracking-wide text-white">
                                {modalConfig.badgeText || "Get in Touch"}
                            </span>
                        </div>

                        {/* Heading */}
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold tracking-tight">
                                {modalConfig.sidebarTitle || "Let's Connect"}
                            </h3>
                            <p className="text-xs text-white/70 leading-relaxed">
                                {modalConfig.sidebarDescription || "Fill out the form and our team will respond within 24 hours."}
                            </p>
                        </div>

                        {/* Contact Items */}
                        <div className="space-y-2 pt-1">
                            <a
                                href="tel:+919036707847"
                                className="flex items-center gap-3 group/link hover:opacity-90 transition-opacity"
                            >
                                <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover/link:bg-white/20 transition-colors flex-shrink-0">
                                    <PhoneCall className="w-4 h-4 text-brand-primary" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-white/50 leading-none mb-0.5">Phone</p>
                                    <p className="text-xs font-semibold">+91 9036707847</p>
                                </div>
                            </a>
                            <a
                                href="mailto:hello@skilldeck.net"
                                className="flex items-center gap-3 group/link hover:opacity-90 transition-opacity"
                            >
                                <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover/link:bg-white/20 transition-colors flex-shrink-0">
                                    <MailIcon className="w-4 h-4 text-brand-primary" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-white/50 leading-none mb-0.5">Email</p>
                                    <p className="text-xs font-semibold break-all">hello@skilldeck.net</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Bottom Image */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center z-10 pointer-events-none translate-y-[22%]">
                        <Image
                            src={img}
                            alt="Illustration"
                            className="w-[72%] max-w-[240px] h-auto opacity-100 object-contain drop-shadow-2xl"
                            priority
                        />
                    </div>
                </div>

                {/* Right Form Section */}
                <div className="p-5 space-y-2 relative flex-1 bg-white overflow-y-auto flex flex-col w-full max-h-[85vh] lg:max-h-[90vh]">
                    <div className="text-center">
                        <h2 className="text-lg 2xl:text-2xl font-semibold text-gray-900">
                            {modalConfig.formTitle ? (
                                <span dangerouslySetInnerHTML={{ __html: modalConfig.formTitle }} />
                            ) : formType === 'corporate' ? (
                                <>Scale Your <span className="bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] bg-clip-text text-transparent">Training Business</span></>
                            ) : (
                                <>We&apos;d Love to <span className="bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] bg-clip-text text-transparent">Hear From You</span></>
                            )}
                        </h2>
                        <p className="text-gray-500 text-xs 2xl:text-sm ">
                            {modalConfig.formDescription || "Complete the form below and we'll get back to you shortly."}
                        </p>
                    </div>
                    <GenericForm
                        formtype={formType}
                        onClose={closeModal}
                        courseSlug={modalConfig.courseSlug || modalConfig.defaultValues?.courseSlug}
                        selectedCourse={modalConfig.defaultValues?.selectedCourse}
                        serviceSlug={modalConfig.serviceSlug || modalConfig.defaultValues?.serviceSlug}
                        selectedService={modalConfig.defaultValues?.selectedService}
                        // `subject` is a generic label from the CTA; the form files it
                        // under the course or the service based on the page it sits on.
                        contextLabel={modalConfig.defaultValues?.subject}
                        formId={modalConfig.formId ? String(modalConfig.formId) : "modal-lead-form"}
                    />
                </div>
            </div>
        </div>
    );
};

export default LeadModal;
