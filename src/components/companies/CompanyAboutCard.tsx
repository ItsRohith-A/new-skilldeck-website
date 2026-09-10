import DOMPurify from "@/lib/dompurify";
import TruncatedContent from "@/components/ui/TruncatedContent";

interface Props {
    companyName: string;
    description: string;
}

function hasTextContent(html: string): boolean {
    if (!html) return false;
    const text = html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, "").trim();
    return text.length > 0;
}

/** Force rel="nofollow noreferrer" on every <a> tag in raw HTML */
function injectNofollow(html: string): string {
    return html.replace(/<a\b([^>]*?)>/gi, (_, attrs) => {
        // Replace or append rel attribute
        if (/\brel=/i.test(attrs)) {
            return `<a${attrs.replace(/\brel="[^"]*"/i, 'rel="nofollow noreferrer"')}>`;
        }
        return `<a${attrs} rel="nofollow noreferrer">`;
    });
}

// Server Component — no "use client"
export default function CompanyAboutCard({ companyName, description }: Props) {
    if (!description || !hasTextContent(description)) return null;

    return (
        <div id="about">
            {/* Section label */}
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">About</p>

            {/* Heading — fully dynamic */}
            <h2 className="text-2xl font-black text-slate-900 mb-4">
                How {companyName} works
            </h2>

            {description && (
                <TruncatedContent
                    content={injectNofollow(DOMPurify.sanitize(description))}
                    maxLines={10}
                    className="skilldeck-content text-slate-600"
                />
            )}
        </div>
    );
}
