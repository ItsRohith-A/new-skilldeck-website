import React from "react";
import NextImage from "next/image";

/**
 * Shared building blocks for the /service-demo concept: an eyebrow, a section
 * heading and the two button skins. Kept local to the route so the live design
 * system is untouched, and kept small so each section file stays about layout.
 */

export function DemoEyebrow({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
    return (
        <span
            className={`inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] ${dark ? "text-[var(--sd-accent)]" : "text-[var(--sd-primary)]"
                }`}
        >
            <span aria-hidden="true" className="w-6 h-px bg-current opacity-50" />
            {children}
        </span>
    );
}

interface SectionHeadingProps {
    eyebrow?: string;
    title: React.ReactNode;
    description?: string;
    align?: "left" | "center";
    dark?: boolean;
    /** Section headings are `h2`; the hero owns the page `h1`. */
    as?: "h2" | "h3";
    className?: string;
}

export function DemoSectionHeading({
    eyebrow,
    title,
    description,
    align = "left",
    dark,
    as: Tag = "h2",
    className = "",
}: SectionHeadingProps) {
    return (
        <div
            className={`space-y-4 ${align === "center" ? "text-center mx-auto max-w-3xl" : "max-w-2xl"} ${className}`}
        >
            {eyebrow && (
                <div className={align === "center" ? "flex justify-center" : ""}>
                    <DemoEyebrow dark={dark}>{eyebrow}</DemoEyebrow>
                </div>
            )}
            <Tag
                className={`text-2xl md:text-4xl font-extrabold tracking-tight leading-[1.15] text-balance ${dark ? "text-white" : "text-[var(--sd-text)]"
                    }`}
            >
                {title}
            </Tag>
            {description && (
                <p className={`text-sm md:text-base leading-relaxed ${dark ? "text-white/60" : "text-[var(--sd-muted)]"}`}>
                    {description}
                </p>
            )}
        </div>
    );
}

type DemoButtonProps = {
    children: React.ReactNode;
    variant?: "solid" | "ghost" | "ghost-dark";
    className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
    Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

const buttonBase =
    "inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl text-sm font-bold transition-all duration-300 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sd-primary)]";

const buttonSkins = {
    solid: "text-white shadow-lg shadow-[#0E9A8D]/25 hover:shadow-xl hover:shadow-[#0E9A8D]/35 hover:-translate-y-0.5",
    ghost:
        "border border-[var(--sd-line)] bg-white text-[var(--sd-text)] hover:border-[var(--sd-primary)]/40 hover:bg-[var(--sd-surface)] hover:-translate-y-0.5",
    "ghost-dark":
        "border border-white/20 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/40 hover:-translate-y-0.5",
};

/** `solid` carries the teal ramp inline so the gradient never depends on a scanned class. */
export function DemoButton({ children, variant = "solid", className = "", href, ...props }: DemoButtonProps) {
    const classes = `${buttonBase} ${buttonSkins[variant]} ${className}`;
    const style = variant === "solid" ? { background: "var(--sd-gradient)" } : undefined;

    if (href) {
        return (
            <a href={href} className={classes} style={style}>
                {children}
            </a>
        );
    }

    return (
        <button type="button" className={classes} style={style} {...props}>
            {children}
        </button>
    );
}

/** Hairline card used across the light sections. */
export function DemoCard({
    children,
    className = "",
    interactive = true,
}: {
    children: React.ReactNode;
    className?: string;
    interactive?: boolean;
}) {
    return (
        <div
            className={`relative overflow-hidden rounded-2xl border border-[var(--sd-line)] bg-white ${interactive ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70 hover:border-[var(--sd-primary)]/30" : ""
                } ${className}`}
        >
            {children}
        </div>
    );
}

/**
 * Photo frame used across the concept — rounded, hairline-bordered, with an
 * optional overlay slot for the floating UI chips that sit on top of an image.
 */
export function DemoPhoto({
    src,
    alt,
    aspect = "aspect-[4/3]",
    className = "",
    priority,
    sizes = "(max-width: 1024px) 100vw, 50vw",
    children,
}: {
    src: string;
    alt: string;
    aspect?: string;
    className?: string;
    priority?: boolean;
    sizes?: string;
    children?: React.ReactNode;
}) {
    return (
        <div className={`relative ${className}`}>
            <div className={`relative ${aspect} rounded-2xl overflow-hidden border border-[var(--sd-line)] bg-slate-100 shadow-lg shadow-slate-200/60`}>
                <NextImage src={src} alt={alt} fill sizes={sizes} className="object-cover" priority={priority} />
                {/* Ink wash keeps white overlay chips legible on any photo */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(180deg, rgba(6,33,49,0.05) 0%, rgba(6,33,49,0.35) 100%)" }}
                />
            </div>
            {children}
        </div>
    );
}
