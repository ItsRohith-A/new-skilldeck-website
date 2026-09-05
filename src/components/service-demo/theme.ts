import type { CSSProperties } from "react";

/**
 * Scoped palette for the /service-demo page.
 *
 * The site's brand ramp (violet → magenta → orange) belongs to the live pages,
 * so this concept runs on its own tokens: a deep petrol navy ground with a
 * teal/cyan signal colour. They are declared as CSS variables on the page
 * wrapper rather than in `globals.css`, so nothing outside this route can pick
 * them up and the whole direction can be re-tuned from one object.
 *
 * Components reference them as `bg-[var(--sd-primary)]` etc. — literal class
 * strings, so Tailwind's scanner keeps them.
 */
export const demoTheme = {
    "--sd-ink": "#062131",
    "--sd-ink-2": "#0A2E42",
    "--sd-ink-3": "#0F3C55",
    "--sd-primary": "#0E9A8D",
    "--sd-primary-strong": "#0A7A70",
    "--sd-accent": "#2DD4BF",
    "--sd-cyan": "#22D3EE",
    "--sd-surface": "#F4FAF9",
    "--sd-line": "#DCE9E7",
    "--sd-text": "#0B2530",
    "--sd-muted": "#557080",
    "--sd-gradient": "linear-gradient(120deg, #0E9A8D 0%, #22D3EE 100%)",
    "--sd-gradient-deep": "linear-gradient(140deg, #062131 0%, #0A2E42 45%, #0E5C63 100%)",
} as CSSProperties;

/** Per-item accents for grids that would otherwise read as one flat colour. */
export const demoAccents = [
    { hex: "#0E9A8D", chip: "bg-[#0E9A8D]/10 text-[#0E9A8D]", ring: "ring-[#0E9A8D]/20" },
    { hex: "#22D3EE", chip: "bg-[#22D3EE]/12 text-[#0891B2]", ring: "ring-[#22D3EE]/25" },
    { hex: "#6366F1", chip: "bg-[#6366F1]/10 text-[#6366F1]", ring: "ring-[#6366F1]/20" },
    { hex: "#F59E0B", chip: "bg-[#F59E0B]/10 text-[#B45309]", ring: "ring-[#F59E0B]/20" },
    { hex: "#EC4899", chip: "bg-[#EC4899]/10 text-[#DB2777]", ring: "ring-[#EC4899]/20" },
    { hex: "#10B981", chip: "bg-[#10B981]/10 text-[#059669]", ring: "ring-[#10B981]/20" },
] as const;

export function demoAccentAt(index: number) {
    return demoAccents[index % demoAccents.length];
}

/** One page rhythm, so every section stacks to the same gap. */
export const sectionPad = "py-16 md:py-24";
export const shell = "container mx-auto px-4 sm:px-6 lg:px-0";
