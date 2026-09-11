"use client";

import { createContext, useContext, ReactNode } from "react";

export interface ServiceIdentity {
    /** Display name as it should appear on the lead, e.g. "CRM for Training Institutes". */
    name: string;
    /** CMS slug, e.g. "crm". */
    slug: string;
}

const ServiceIdentityContext = createContext<ServiceIdentity | null>(null);

/**
 * Names the service the visitor is looking at, so a CTA buried inside a section
 * component can tag its lead without every section having to forward the props.
 */
export function ServiceIdentityProvider({
    name,
    slug,
    children,
}: ServiceIdentity & { children: ReactNode }) {
    return (
        <ServiceIdentityContext.Provider value={{ name, slug }}>
            {children}
        </ServiceIdentityContext.Provider>
    );
}

/** Null anywhere outside a service page — callers fall back to their own defaults. */
export function useServiceIdentity(): ServiceIdentity | null {
    return useContext(ServiceIdentityContext);
}
