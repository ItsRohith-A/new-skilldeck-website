import Script from "next/script";
import { fetchFromBackend } from "./apiProxy";

// Define the type for the script object based on the API structure
interface ScriptItem {
    name: string;
    script: string;
    isActive?: boolean;
    location?: string;
    _id?: {
        $oid: string;
    };
}

interface ScriptsResponse {
    _id?: { $oid: string };
    scripts: ScriptItem[];
}

interface ScriptPart {
    src?: string;
    /** The tag's `type`, e.g. "application/ld+json"; undefined for plain JavaScript. */
    type?: string;
    code?: string;
}

const JS_TYPES = new Set(["", "text/javascript", "application/javascript", "module"]);

/**
 * Splits a CMS snippet into its <script> tags. A snippet can hold several tags (gtag.js is an
 * external tag plus an inline config tag), and HTML around them (<noscript>, <!-- comments -->,
 * <meta>) is dropped: it is not JavaScript, and running it as a script throws
 * "Unexpected token '<'". A snippet with no tags at all is taken as plain JavaScript.
 */
function parseSnippet(raw: string): ScriptPart[] {
    const source = raw.replace(/<!--[\s\S]*?-->/g, "").trim();
    const tags = [...source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)];

    if (!tags.length) {
        // Bare code is fine; leftover markup (or a tag missing its closing </script>) is not.
        return source && !source.startsWith("<") ? [{ code: source }] : [];
    }

    return tags.flatMap(([, attrs, body]): ScriptPart[] => {
        const src = attrs.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
        const type = attrs.match(/\btype\s*=\s*["']([^"']*)["']/i)?.[1]?.trim().toLowerCase();
        const code = body.trim();
        if (src) return [{ src, type }];
        if (code) return [{ code, type: type && !JS_TYPES.has(type) ? type : undefined }];
        return [];
    });
}

export default async function DynamicScripts() {
    let activeScripts: ScriptItem[] = [];

    try {
        const response = await fetchFromBackend("/scripts", { next: { tags: ['scripts'] } });

        if (response.ok) {
            const data: ScriptsResponse = await response.json();
            if (data && data.scripts) {
                // If isActive is missing, assume true.
                activeScripts = data.scripts
                    .filter((s) => s.isActive !== false) // Default to true if undefined
                    .filter((s) => s.name !== "Robots.txt");
            }
        } else {
            console.error("Failed to fetch scripts:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Error fetching scripts:", error);
    }

    const googleAnalytics = activeScripts.find((s) => s.name === "Google Analytics");
    const otherScripts = activeScripts.filter((s) => s.name !== "Google Analytics");

    // Helper to extract GTM ID
    const getGtmId = (scriptContent: string) => {
        const match = scriptContent.match(/GTM-[A-Za-z0-9]+/);
        return match ? match[0] : null;
    };

    const gtmId = googleAnalytics ? getGtmId(googleAnalytics.script) : null;

    return (
        <>
            {gtmId && (
                <>
                    <Script
                        id="gtm-script"
                        strategy="lazyOnload"
                        dangerouslySetInnerHTML={{
                            __html: `
                                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                                })(window,document,'script','dataLayer','${gtmId}');
                            `,
                        }}
                    />
                    <noscript>
                        <iframe
                            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                            height="0"
                            width="0"
                            style={{ display: "none", visibility: "hidden" }}
                        />
                    </noscript>
                </>
            )}
            {otherScripts.flatMap((script, index) => {
                const baseKey = script._id?.$oid || `${script.name}-${index}`;

                // Determine Next.js Script strategy based on location:
                // - "head" scripts use afterInteractive (non-blocking, loaded after hydration)
                // - all others use lazyOnload (loaded during idle time)
                const strategy: "afterInteractive" | "lazyOnload" =
                    script.location === "head" ? "afterInteractive" : "lazyOnload";

                return parseSnippet(script.script || "").map((part, partIndex) => {
                    const key = partIndex ? `${baseKey}-${partIndex}` : baseKey;

                    // External script (has a src attribute)
                    if (part.src) {
                        return <Script key={key} id={key} src={part.src} strategy={strategy} async />;
                    }

                    // Data blocks such as JSON-LD are not executed; keep them as a plain tag.
                    if (part.type) {
                        return (
                            <script
                                key={key}
                                id={key}
                                type={part.type}
                                dangerouslySetInnerHTML={{ __html: part.code!.replace(/</g, "\\u003c") }}
                            />
                        );
                    }

                    // Inline JavaScript
                    return (
                        <Script
                            key={key}
                            id={key}
                            strategy={strategy}
                            dangerouslySetInnerHTML={{ __html: part.code! }}
                        />
                    );
                });
            })}
        </>
    );
}
