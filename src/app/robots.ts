import { fetchFromBackend } from "@/lib/apiProxy";
import { SITE_URL } from "@/lib/sitemap";
import { MetadataRoute } from "next";


interface ScriptItem {
    name: string;
    script: string;
    isActive?: boolean;
}

interface ScriptsResponse {
    scripts: ScriptItem[];
}

interface ParsedRules {
    userAgent: string | string[];
    allow?: string[];
    disallow?: string[];
}

export default async function robots(): Promise<MetadataRoute.Robots> {
    const rules: ParsedRules[] = [];
    const sitemaps: string[] = [];

    try {
        const response = await fetchFromBackend("/scripts");

        if (response.ok) {
            const data: ScriptsResponse = await response.json();
            if (data && data.scripts) {
                const robotsScript = data.scripts.find(
                    (s) => s.name === "Robots.txt" && s.isActive !== false
                );

                if (robotsScript && robotsScript.script) {
                    const lines = robotsScript.script.split("\n");
                    let currentUserAgents: string[] = [];

                    // Temporary storage to accumulate rules for the current set of user agents
                    let currentAllows: string[] = [];
                    let currentDisallows: string[] = [];

                    const flushRule = () => {
                        if (currentUserAgents.length > 0) {
                            rules.push({
                                userAgent: currentUserAgents,
                                allow: currentAllows.length > 0 ? currentAllows : undefined,
                                disallow: currentDisallows.length > 0 ? currentDisallows : undefined,
                            });
                        }
                        currentUserAgents = [];
                        currentAllows = [];
                        currentDisallows = [];
                    };

                    for (const line of lines) {
                        const trimmedLine = line.trim();
                        // Ignore empty lines and comments
                        if (!trimmedLine || trimmedLine.startsWith("#")) {
                            continue;
                        }

                        // Split key and value, handle potential separators (colon or semicolon)
                        // Standard is colon, but we support semicolon for robustness against typos
                        const match = trimmedLine.match(/[:;]/);
                        if (!match) continue;
                        const separatorIndex = match.index!;

                        const key = trimmedLine.substring(0, separatorIndex).trim().toLowerCase();
                        const value = trimmedLine.substring(separatorIndex + 1).trim();

                        if (key === "user-agent") {
                            // If we encounter a User-agent and we have previous rules pending (allows/disallows),
                            // it means the previous block is finished.
                            if (currentAllows.length > 0 || currentDisallows.length > 0) {
                                flushRule();
                            }
                            currentUserAgents.push(value);
                        } else if (key === "allow") {
                            // Default to * if no user agent has been specified yet
                            if (currentUserAgents.length === 0) {
                                currentUserAgents.push("*");
                            }
                            currentAllows.push(value);
                        } else if (key === "disallow") {
                            // Default to * if no user agent has been specified yet
                            if (currentUserAgents.length === 0) {
                                currentUserAgents.push("*");
                            }
                            currentDisallows.push(value);
                        } else if (key === "sitemap") {
                            // Only XML/text sitemaps are valid here. The CMS
                            // script listed /sitemap-html, an HTML page, which
                            // Search Console reports as a broken sitemap.
                            if (/\.(xml|txt)(\.gz)?$/i.test(value.split(/[?#]/)[0])) {
                                sitemaps.push(value);
                            }
                        }
                    }
                    // Flush any remaining rules at the end
                    flushRule();
                }
            }
        }
    } catch (error) {
        console.error("Error fetching robots.txt script:", error);
    }

    // Default fallback if no rules found
    if (rules.length === 0) {
        rules.push({
            userAgent: "*",
            allow: ["/"],
        });
    }

    const result: MetadataRoute.Robots = {
        rules: rules,
    };

    result.sitemap = sitemaps.length > 0 ? sitemaps : [`${SITE_URL}/sitemap.xml`];

    return result;
}