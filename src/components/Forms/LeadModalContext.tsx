'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface LeadModalConfig {
    // Form Content
    formTitle?: string;
    formDescription?: string;
    formId?: number | string;
    badgeText?: string;
    sidebarTitle?: string;
    sidebarDescription?: string;

    // Configuration
    config?: {
        budget?: boolean;
        participants?: boolean;
        hearAbout?: boolean;
        subject?: boolean;
    };

    // Default Values
    defaultValues?: {
        leadSource?: string;
        courseSlug?: string;
        serviceSlug?: string;
        pagePath?: string;
        hearAboutUs?: string;
        subject?: string;
        selectedCourse?: string;
        selectedService?: string;
    };

    // Backward compatibility / Shortcuts
    source?: string;
    courseSlug?: string;
    serviceSlug?: string;
    participants?: boolean;
}

interface LeadModalContextType {
    isOpen: boolean;
    openModal: (config?: LeadModalConfig) => void;
    closeModal: () => void;
    modalConfig: LeadModalConfig;
}

const LeadModalContext = createContext<LeadModalContextType | undefined>(undefined);

export function LeadModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState<LeadModalConfig>({});

    const openModal = (config?: LeadModalConfig) => {
        if (config) {
            setModalConfig(config);
        }
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    return (
        <LeadModalContext.Provider value={{ isOpen, openModal, closeModal, modalConfig }}>
            {children}
        </LeadModalContext.Provider>
    );
}

export function useLeadModal() {
    const context = useContext(LeadModalContext);
    if (context === undefined) {
        // Return a safe no-op fallback instead of throwing.
        // This allows the hook to be used in components that may render
        // before the provider mounts (e.g. during SSR).
        return {
            isOpen: false,
            openModal: () => { },
            closeModal: () => { },
            modalConfig: {} as LeadModalConfig,
        };
    }
    return context;
}
