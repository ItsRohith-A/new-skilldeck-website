import DOMPurify from "@/lib/dompurify";

interface PatternContentProps {
    content: string;
}

/** Force rel="nofollow noreferrer" on every <a> tag in raw HTML */
function injectNofollow(html: string): string {
    if (!html) return "";
    return html.replace(/<a\b([^>]*?)>/gi, (match, attrs) => {
        if (/\brel=/i.test(attrs)) {
            return match.replace(/\brel="[^"]*"/i, 'rel="nofollow noreferrer"');
        }
        return `<a${attrs} rel="nofollow noreferrer">`;
    });
}

export default function PatternContent({ content }: PatternContentProps) {
    if (!content) return null;

    const sanitizedAndNofollow = injectNofollow(DOMPurify.sanitize(content));

    return (
        <section className="rounded-2xl">
            <div className="container mx-auto px-0">
                <div
                    className="skilldeck-content text-slate-700 leading-relaxed text-sm md:text-base prose max-w-none prose-purple prose-headings:font-bold prose-a:text-purple-600 prose-a:underline hover:prose-a:text-purple-700"
                    dangerouslySetInnerHTML={{ __html: sanitizedAndNofollow }}
                />
            </div>
        </section>
    );
}
