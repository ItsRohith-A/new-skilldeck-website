/**
 * CourseHeroParts — course-specific helpers and small UI primitives
 * used exclusively within the CourseHero banner system.
 *
 * Generic components (Breadcrumb) live in @/components/ui/.
 * Shared types live in @/types/hero.ts.
 */

import type { BreadcrumbItem } from "@/components/ui/Breadcrumb";
import type { CourseHeroData, PlatformSchedule } from "@/types/hero";
import { useMemo, type ReactNode } from "react";

// Re-export for backwards compat so existing imports don't break
export type { CourseHeroData, PlatformSchedule as HeroSchedule, PlatformSchedule };

// ─── Location helper ──────────────────────────────────────────────────────────

/** "new-york" → "New York" */
export function formatLocation(slug: string): string {
    return slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

// ─── Breadcrumb item builder ──────────────────────────────────────────────────

/**
 * Builds a breadcrumb item array for the course detail page.
 * Pass the result directly into <Breadcrumb items={...} />.
 */
export function buildCourseBreadcrumb(
    course: Pick<CourseHeroData, "category" | "course_name" | "course_title">,
    courseSlug: string,
    locationSlug?: string
): BreadcrumbItem[] {
    const items: BreadcrumbItem[] = [
        { label: "Home", href: "/" },
        ...(course.category?.name
            ? [{ label: course.category.name, href: `/${course.category.slug}` }]
            : []),
        {
            label: course.course_name || course.course_title,
            href: locationSlug
                ? `/${course.category?.slug}/${courseSlug}`
                : undefined,
        },
    ];
    if (locationSlug) {
        items.push({ label: formatLocation(locationSlug) });
    }
    return items;
}

// ─── Keypoints HTML parser ────────────────────────────────────────────────────

/**
 * Extracts plain-text list items from a `<li>` HTML string.
 * Strips all inner tags, trims whitespace, and removes empty entries.
 */
export function parseKeypoints(keypoints?: string): string[] {
    if (!keypoints) return [];
    const liRegex = /<li[^>]*>(.*?)<\/li>/g;
    const matches = [...keypoints.matchAll(liRegex)];
    if (matches.length > 0) {
        return matches
            .map((m) => m[1].replace(/<[^>]*>?/gm, "").trim())
            .filter((t) => t.length > 0);
    }
    return [];
}

// ─── Featured schedule selector ───────────────────────────────────────────────

/**
 * Picks the top-ranked featured schedule and merges resolved tenant data.
 */
export function pickFeaturedSchedule(
    schedules: PlatformSchedule[] = [],
    tenants: Record<string, unknown>[] = []
): PlatformSchedule | null {
    const featured = schedules
        .filter((s) => s.isFeatured)
        .sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));

    if (featured.length === 0) return null;

    const selected = featured[0];
    const tenant = tenants.find((t: any) => t.id === selected.tenantId);

    return {
        ...selected,
        tenant: tenant
            ? {
                id: (tenant as any).id,
                name: (tenant as any).legalName || (tenant as any).name,
                logo: (tenant as any).logo,
            }
            : selected.tenant,
    };
}

// ─── Course-specific UI primitives ───────────────────────────────────────────

/**
 * Attribute pill — icon + main label + optional sublabel.
 * Used in the hero banner attribute row.
 *
 * @param iconClassName — Tailwind classes for the icon wrapper (bg + text color).
 *   Defaults to `bg-blue-100 text-blue-500`.
 */
export function AttrPill({
    icon,
    label,
    sublabel,
    iconClassName = "bg-blue-100 text-blue-500",
}: {
    icon: ReactNode;
    label: string;
    sublabel?: string;
    /** Tailwind classes controlling the icon wrapper background & icon color. */
    iconClassName?: string;
}) {
    return (
        <div className="flex items-center gap-3 md:gap-4  px-2 md:px-4 py-2 rounded-md border border-gray-200 bg-white text-[#1F2937] shadow-sm min-w-[80px] md:min-w-[110px]">
            <div className={`flex-shrink-0 p-1.5 md:p-2 rounded-md ${iconClassName}`}>{icon}</div>
            <div>
                <div className="text-xs md:text-[13px] font-semibold capitalize leading-tight">{label}</div>
                {sublabel && (
                    <div className="text-xs md:text-[12px] text-gray-600 leading-tight">{sublabel}</div>
                )}
            </div>
        </div>
    );
}

import type { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";

// Stat icons are stored as a plain "IconName,colorHex" string
function resolveStatIcon(icon?: string): { Icon: LucideIcon; color: string } | null {
    if (!icon) return null;
    const [name, color] = icon.split(",");
    const trimmedName = name?.trim();
    if (!trimmedName) return null;
    const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[trimmedName];
    if (!Icon) return null;
    return { Icon, color: color?.trim() || "currentColor" };
}

/**
 * Stat box — white value + gray label + purple line accent.
 * Used in the dark hero stats strip.
 */
export function StatBox({ value, label, icon }: { value: string; label: string; icon?: string }) {
    const resolvedIcon = resolveStatIcon(icon);

    // Create a matching background color style using the icon's color with opacity
    const bgStyle = useMemo(() => {
        if (!resolvedIcon) return {};
        const color = resolvedIcon.color.trim();
        if (color.startsWith("#")) {
            return { backgroundColor: `${color}1A` }; // 10% opacity
        }
        return { backgroundColor: "rgba(255, 255, 255, 0.1)" };
    }, [resolvedIcon]);

    return (
        <div className="flex items-center gap-3 py-1">
            {resolvedIcon && (
                <div
                    className="w-8 h-8 md:w-11 md:h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={bgStyle}
                >
                    <resolvedIcon.Icon
                        className="w-4 h-4 md:w-5.5 md:h-5.5"
                        style={{ color: resolvedIcon.color }}
                    />
                </div>
            )}
            <div className="space-y-1 text-left">
                <div className="text-base md:text-2xl font-bold text-white leading-none">{value}</div>
                <div className="text-[9px] md:text-[11px] font-medium text-gray-400 text-nowrap leading-none">{label}</div>
                <div className="w-8 h-1 bg-purple-600 rounded-full mt-1.5" />
            </div>
        </div>
    );
}
