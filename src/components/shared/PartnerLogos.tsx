"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface PartnerLogosProps {
    showBorder?: boolean;
    className?: string;
    title?: string;
    /** Server-fetched logos so the strip is in the initial HTML for crawlers. */
    initialLogos?: { src: string; alt: string }[];
}

let globalPartnerLogosCache: { src: string; alt: string }[] | null = null;

export default function PartnerLogos({
    showBorder = true,
    className = "",
    title = "Top Training Providers on Skilldeck",
    initialLogos
}: PartnerLogosProps) {
    const [partnerLogos, setPartnerLogos] = useState<{ src: string; alt: string }[]>(
        () => (initialLogos && initialLogos.length > 0 ? initialLogos : globalPartnerLogosCache || [])
    );

    useEffect(() => {
        // Server already supplied the list; no need to fetch it again.
        if (initialLogos && initialLogos.length > 0) {
            globalPartnerLogosCache = initialLogos;
            return;
        }
        if (globalPartnerLogosCache && globalPartnerLogosCache.length > 0) {
            setPartnerLogos(globalPartnerLogosCache);
            return;
        }

        const getFallbackLogos = () => [
            { src: "/logos/mainlogo.svg", alt: "SkillDeck" }
        ];

        const fetchPartners = async () => {
            try {
                const res = await fetch("/api/tenants?fields=logo,legalName&limit=50");
                if (!res.ok) {
                    const fallback = getFallbackLogos();
                    globalPartnerLogosCache = fallback;
                    setPartnerLogos(fallback);
                    return;
                }
                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    const fallback = getFallbackLogos();
                    globalPartnerLogosCache = fallback;
                    setPartnerLogos(fallback);
                    return;
                }
                const result = await res.json();
                if (result.data) {
                    const logos = result.data
                        .filter((t: any) => t.logo)
                        .map((t: any) => ({
                            src: t.logo,
                            alt: t.legalName || t.name || "Training Partner"
                        }));
                    const finalLogos = logos.length > 0 ? logos : getFallbackLogos();
                    globalPartnerLogosCache = finalLogos;
                    setPartnerLogos(finalLogos);
                } else {
                    const fallback = getFallbackLogos();
                    globalPartnerLogosCache = fallback;
                    setPartnerLogos(fallback);
                }
            } catch (error) {
                console.error("Error fetching partner logos:", error);
                const fallback = getFallbackLogos();
                globalPartnerLogosCache = fallback;
                setPartnerLogos(fallback);
            }
        };
        fetchPartners();
    }, [initialLogos]);

    if (partnerLogos.length === 0) return null;

    return (
        <div className={`w-full ${showBorder ? "mt-12 pt-10 border-t border-indigo-50/50" : ""} ${className}`}>
            <p className="text-center text-sm font-semibold text-brand-muted uppercase tracking-widest mb-8">
                {title}
            </p>

            <div className="relative overflow-hidden">
                {/* Gradient Fades */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

                <div className="flex overflow-hidden py-2">
                    <div className="flex animate-scroll gap-12 items-center" style={{ animationDuration: "60s" }}>
                        {/* Duplicate the logos for seamless scrolling */}
                        {[...partnerLogos, ...partnerLogos].map((logo, idx) => (
                            <div
                                key={idx}
                                className="flex-shrink-0 transition-all duration-300 transform hover:scale-110 cursor-pointer w-32 h-16 flex items-center justify-center"
                                title={logo.alt}
                            >
                                {/* next/image so the CMS originals (some are multi-MB)
                                    are resized and served as webp/avif, not raw.
                                    No `sizes`: at a fixed width Next emits a 1x/2x
                                    srcset (2 URLs) instead of one per breakpoint (13),
                                    which was ~3 KB of markup per logo. */}
                                <Image
                                    src={logo.src}
                                    alt={logo.alt}
                                    width={128}
                                    height={64}
                                    className="max-w-full max-h-full object-contain"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
