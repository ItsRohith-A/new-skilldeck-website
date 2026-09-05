/**
 * UTM & Marketing Attribution Tracker
 * 
 * Captures UTM parameters (?utm_source, ?utm_medium, ?utm_campaign, etc.), paid ad click IDs
 * (gclid, fbclid, msclkid), and external referrers on initial page landing, storing them in
 * sessionStorage and localStorage.
 * 
 * This ensures attribution is NOT lost when a user navigates between pages before
 * submitting a form, booking a demo, or registering.
 */

export interface UtmAttribution {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
    gclid?: string;
    fbclid?: string;
    msclkid?: string;
    referrer?: string;
    referrerUrl?: string;
    landingPage?: string;
}

const STORAGE_KEY = 'skilldeck_marketing_attribution';

/**
 * Detects organic search engine or social media platform from referrer
 */
function detectOrganicReferrer(referrerUrl: string): { source: string; medium: string } | null {
    try {
        const ref = new URL(referrerUrl);
        const host = ref.hostname.toLowerCase();

        if (host.includes('google.')) return { source: 'google', medium: 'organic' };
        if (host.includes('bing.')) return { source: 'bing', medium: 'organic' };
        if (host.includes('duckduckgo.')) return { source: 'duckduckgo', medium: 'organic' };
        if (host.includes('yahoo.')) return { source: 'yahoo', medium: 'organic' };
        if (host.includes('linkedin.')) return { source: 'linkedin', medium: 'social' };
        if (host.includes('facebook.')) return { source: 'facebook', medium: 'social' };
        if (host.includes('instagram.')) return { source: 'instagram', medium: 'social' };
        if (host.includes('twitter.') || host.includes('x.com')) return { source: 'twitter', medium: 'social' };
        if (host.includes('youtube.')) return { source: 'youtube', medium: 'social' };

        return { source: host.replace(/^www\./, ''), medium: 'referral' };
    } catch {
        return null;
    }
}

/**
 * Capture and store attribution from current URL and document.referrer
 */
export function captureAttribution(): void {
    if (typeof window === 'undefined') return;

    try {
        const urlParams = new URLSearchParams(window.location.search);
        let utmSource = urlParams.get('utm_source');
        let utmMedium = urlParams.get('utm_medium');
        const utmCampaign = urlParams.get('utm_campaign');
        const utmTerm = urlParams.get('utm_term');
        const utmContent = urlParams.get('utm_content');
        const gclid = urlParams.get('gclid');
        const fbclid = urlParams.get('fbclid');
        const msclkid = urlParams.get('msclkid');

        // Sponsored / Paid Ad Click Identifiers detection
        if (gclid && !utmSource) {
            utmSource = 'google';
            utmMedium = utmMedium || 'cpc';
        } else if (fbclid && !utmSource) {
            utmSource = 'facebook';
            utmMedium = utmMedium || 'paid_social';
        } else if (msclkid && !utmSource) {
            utmSource = 'bing';
            utmMedium = utmMedium || 'cpc';
        }

        const rawExisting = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
        const existing: UtmAttribution = rawExisting ? JSON.parse(rawExisting) : {};

        const hasNewUtms = Boolean(utmSource || utmMedium || utmCampaign || utmTerm || utmContent || gclid || fbclid || msclkid);
        const isExternalReferrer = Boolean(document.referrer && !document.referrer.includes(window.location.hostname));

        // Auto-detect organic search (e.g. google.com) or social referral if no UTM or paid click ID provided
        const organic = (!utmSource && isExternalReferrer) ? detectOrganicReferrer(document.referrer) : null;

        const effectiveSource = utmSource || (organic ? organic.source : existing.utm_source);
        const effectiveMedium = utmMedium || (organic ? organic.medium : existing.utm_medium);

        const updated: UtmAttribution = {
            ...existing,
            ...(effectiveSource ? { utmSource: effectiveSource, utm_source: effectiveSource } : {}),
            ...(effectiveMedium ? { utmMedium: effectiveMedium, utm_medium: effectiveMedium } : {}),
            ...(utmCampaign ? { utmCampaign, utm_campaign: utmCampaign } : {}),
            ...(utmTerm ? { utmTerm, utm_term: utmTerm } : {}),
            ...(utmContent ? { utmContent, utm_content: utmContent } : {}),
            gclid: gclid || existing.gclid,
            fbclid: fbclid || existing.fbclid,
            msclkid: msclkid || existing.msclkid,
            referrer: existing.referrer || (isExternalReferrer ? document.referrer : undefined),
            referrerUrl: existing.referrerUrl || (isExternalReferrer ? document.referrer : undefined),
            landingPage: existing.landingPage || window.location.pathname,
        };

        if (hasNewUtms || isExternalReferrer || !existing.landingPage) {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
    } catch {
        // Fail-safe for private mode or storage restrictions
    }
}

/**
 * Get current attribution parameters (reads live URL params first, falls back to stored session attribution)
 */
export function getAttributionData(): UtmAttribution {
    if (typeof window === 'undefined') return {};

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const utmSource = urlParams.get('utm_source');
        const utmMedium = urlParams.get('utm_medium');
        const utmCampaign = urlParams.get('utm_campaign');
        const utmTerm = urlParams.get('utm_term');
        const utmContent = urlParams.get('utm_content');

        const rawStored = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
        const stored: UtmAttribution = rawStored ? JSON.parse(rawStored) : {};

        const gclid = urlParams.get('gclid') || stored.gclid;
        const fbclid = urlParams.get('fbclid') || stored.fbclid;
        const msclkid = urlParams.get('msclkid') || stored.msclkid;
        const isExternalReferrer = Boolean(document.referrer && !document.referrer.includes(window.location.hostname));
        const organic = (!utmSource && !stored.utm_source && !gclid && isExternalReferrer) ? detectOrganicReferrer(document.referrer) : null;

        const paidSource = gclid ? 'google' : (fbclid ? 'facebook' : (msclkid ? 'bing' : undefined));
        const paidMedium = gclid ? 'cpc' : (fbclid ? 'paid_social' : (msclkid ? 'cpc' : undefined));

        const source = utmSource || stored.utm_source || stored.utmSource || paidSource || (organic ? organic.source : undefined);
        const medium = utmMedium || stored.utm_medium || stored.utmMedium || paidMedium || (organic ? organic.medium : undefined);
        const campaign = utmCampaign || stored.utm_campaign || stored.utmCampaign;
        const term = utmTerm || stored.utm_term || stored.utmTerm;
        const content = utmContent || stored.utm_content || stored.utmContent;
        const referrer = stored.referrer || (isExternalReferrer ? document.referrer : undefined);

        return {
            utmSource: source || undefined,
            utmMedium: medium || undefined,
            utmCampaign: campaign || undefined,
            utmTerm: term || undefined,
            utmContent: content || undefined,
            utm_source: source || undefined,
            utm_medium: medium || undefined,
            utm_campaign: campaign || undefined,
            utm_term: term || undefined,
            utm_content: content || undefined,
            gclid: gclid || undefined,
            fbclid: fbclid || undefined,
            msclkid: msclkid || undefined,
            referrer: referrer || undefined,
            referrerUrl: referrer || undefined,
            landingPage: stored.landingPage || window.location.pathname,
        };
    } catch {
        return {};
    }
}
