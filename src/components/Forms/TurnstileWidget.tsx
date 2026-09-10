"use client";

import { env } from '@/lib/env';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

// Extend Window interface to include turnstile
declare global {
    interface Window {
        turnstile: any;
    }
}

interface TurnstileWidgetProps {
    onVerify: (token: string) => void;
    onError?: () => void;
    onExpire?: () => void;
    isInteracted?: boolean; // Enable lazy loading
    className?: string; // Optional custom className
}

const SITE_KEY = env.NEXT_TURNSTILE_SITE_KEY;

const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({
    onVerify,
    onError,
    onExpire,
    isInteracted = true, // Default to immediate load for backward compatibility
    className
}) => {
    const turnstileRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        // If script is already on the page (from other components), mark as loaded
        if (typeof window !== 'undefined' && window.turnstile) {
            setScriptLoaded(true);
        }
    }, []);

    const onVerifyRef = useRef(onVerify);
    const onErrorRef = useRef(onError);
    const onExpireRef = useRef(onExpire);

    useEffect(() => {
        onVerifyRef.current = onVerify;
        onErrorRef.current = onError;
        onExpireRef.current = onExpire;
    }, [onVerify, onError, onExpire]);

    useEffect(() => {
        if (!isInteracted || !scriptLoaded || !SITE_KEY) return;

        const renderTurnstile = () => {
            if (window.turnstile && turnstileRef.current && !widgetIdRef.current) {
                try {
                    widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
                        sitekey: SITE_KEY,
                        callback: (token: string) => {
                            if (onVerifyRef.current) onVerifyRef.current(token);
                        },
                        'error-callback': () => {
                            if (onErrorRef.current) onErrorRef.current();
                        },
                        'expired-callback': () => {
                            if (onExpireRef.current) onExpireRef.current();
                        },
                        theme: 'light',
                    });
                } catch (error) {
                    console.warn('[TurnstileWidget] Render error:', error);
                }
            }
        };

        renderTurnstile();

        // Cleanup function
        return () => {
            if (widgetIdRef.current && window.turnstile) {
                try {
                    window.turnstile.remove(widgetIdRef.current);
                    widgetIdRef.current = null;
                } catch (error) {
                    // Ignore removal errors
                }
            }
        };
    }, [isInteracted, scriptLoaded]);

    if (!SITE_KEY) {
        return (
            <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-red-600 text-sm text-center">
                Captcha Configuration Error: Site Key Missing
            </div>
        );
    }

    return (
        <div className={className !== undefined ? className : "flex justify-center my-4 min-h-[65px]"}>
            {/* Inject script if not present. Use strategy="lazyOnload" or "afterInteractive" */}
            <Script
                src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                strategy="lazyOnload"
                onLoad={() => setScriptLoaded(true)}
            />
            <div ref={turnstileRef} />
        </div>
    );
};

export default TurnstileWidget;
