"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureAttribution } from "@/lib/utm";

/**
 * UtmTracker
 * Mounts in RootLayout (inside Suspense) to capture UTM parameters, ad click IDs (gclid/fbclid/msclkid),
 * and referrer info on every page entry and navigation.
 */
export default function UtmTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        captureAttribution();
    }, [pathname, searchParams]);

    return null;
}
