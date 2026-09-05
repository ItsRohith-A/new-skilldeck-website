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

// Helper to extract the `src` URL from a <script src="..."> tag
function extractSrc(rawScript: string): string | null {
    const match = rawScript.match(/<script[^>]+src=["']([^"']+)["']/i);
    return match ? match[1] : null;
}

// Helper to strip <script> wrapper tags and return inner content
function extractInlineContent(rawScript: string): string {
    return rawScript
        .replace(/<script[^>]*>/gi, "")
        .replace(/<\/script>/gi, "")
        .trim();
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
            {otherScripts.map((script, index) => {
                const key = script._id?.$oid || `${script.name}-${index}`;
                const src = extractSrc(script.script);
                const inlineContent = extractInlineContent(script.script);

                // Determine Next.js Script strategy based on location:
                // - "head" scripts use afterInteractive (non-blocking, loaded after hydration)
                // - all others use lazyOnload (loaded during idle time)
                const strategy: "afterInteractive" | "lazyOnload" =
                    script.location === "head" ? "afterInteractive" : "lazyOnload";

                // External script (has a src attribute)
                if (src) {
                    return (
                        <Script
                            key={key}
                            id={key}
                            src={src}
                            strategy={strategy}
                            async
                        />
                    );
                }

                // Inline script (no src, just code)
                if (inlineContent) {
                    return (
                        <Script
                            key={key}
                            id={key}
                            strategy={strategy}
                            dangerouslySetInnerHTML={{ __html: inlineContent }}
                        />
                    );
                }

                return null;
            })}
        </>
    );
}
