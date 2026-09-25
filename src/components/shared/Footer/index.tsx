import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FooterCTA from "./elements/FooterCTA";
import FooterLinks from "./elements/FooterLinks";
import ScrollToTop from "./elements/ScrollToTop";
import SocialLinks from "./elements/SocialLinks";
import { getFooterData } from "@/lib/footer";
import { getServicesByIds, type ServiceRef } from "@/lib/services";
import React from "react";

const SUPPORT_EMAIL = "hello@skilldeck.net";

async function Footer() {
    const data = await getFooterData();

    if (!data) {
        return null;
    }

    // Find the primary brand / About Us column (usually order 1 or title matching "About")
    const brandColumn = data.footer_columns?.find(
        (col) => col.order === 1 || col.title?.toLowerCase().includes("about")
    );

    const brandContent = brandColumn?.content;
    const brandLogoUrl = brandColumn?.logo?.url;
    const brandLogoAlt = brandColumn?.logo?.alt || "Logo";

    // `popular_services` arrives as bare ids that the footer endpoint does not
    // populate, so the names and slugs come from a second lookup. Anything the
    // backend does populate is used as-is.
    const rawServices = data.popular_services || [];
    const inlineServices: ServiceRef[] = rawServices
        .filter((item): item is Exclude<typeof item, string> => typeof item !== "string")
        .filter((item) => Boolean(item?.slug))
        .map((item) => ({ _id: item._id || "", name: item.name || "", slug: item.slug! }));
    const serviceIds = rawServices.filter((item): item is string => typeof item === "string");
    const resolvedServices = await getServicesByIds(serviceIds);
    const popularServices = [...inlineServices, ...resolvedServices];

    const hasPopularContent =
        (data.popular_categories && data.popular_categories.length > 0) ||
        (data.popular_courses && data.popular_courses.length > 0) ||
        popularServices.length > 0;

    return (
        <footer className="bg-white border-t border-slate-200" id="footer">
            <FooterCTA />

            {/* Main Footer Columns */}
            <div className="py-10 md:py-14">
                <div className="container mx-auto px-4 sm:px-2 xl:px-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
                        {/* Brand / About Column */}
                        {(brandLogoUrl || brandContent || (data.social && data.social.length > 0)) && (
                            <div className="lg:col-span-4 space-y-5">
                                {brandLogoUrl && (
                                    <div className="flex items-center gap-2 w-fit">
                                        <Image
                                            alt={brandLogoAlt}
                                            src={brandLogoUrl}
                                            width={180}
                                            height={40}
                                            className="h-8 md:h-9 w-auto object-contain"
                                        />
                                    </div>
                                )}

                                {brandContent && (
                                    <p className="text-sm text-brand-muted w-full md:max-w-xs leading-relaxed">
                                        {brandContent}
                                    </p>
                                )}

                                <SocialLinks items={data.social} />

                                {/* Contact row, divided off from the brand block the way the
                                    link columns are divided from each other. */}
                                <div className="pt-5 border-t border-slate-200 flex flex-wrap items-center gap-x-6 gap-y-3">
                                    <Link
                                        href={`mailto:${SUPPORT_EMAIL}`}
                                        rel="nofollow"
                                        className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-primary transition-colors"
                                    >
                                        <Mail className="w-4 h-4 text-brand-primary shrink-0" />
                                        {SUPPORT_EMAIL}
                                    </Link>

                                    {data.numbers?.map((phone, pIdx) => (
                                        <Link
                                            key={`phone-item-${pIdx}`}
                                            href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                                            rel="nofollow"
                                            className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-primary transition-colors"
                                        >
                                            <Phone className="w-4 h-4 text-brand-primary shrink-0" />
                                            {phone}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Navigation Columns */}
                        <FooterLinks columns={data.footer_columns} />
                    </div>
                </div>
            </div>

            {/* Directory Section: Top Categories / Top Courses */}
            {hasPopularContent && (
                <div className="border-t border-slate-200 bg-slate-50/70 py-8 md:py-10">
                    <div className="container mx-auto px-4 sm:px-2 xl:px-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 text-left">
                            {/* TOP CATEGORIES */}
                            {data.popular_categories && data.popular_categories.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-[11px] uppercase font-bold tracking-[0.15em] text-brand-dark">
                                        Top Categories
                                    </h4>
                                    <div className="text-xs leading-loose text-brand-muted">
                                        {data.popular_categories.map((cat, idx) => (
                                            <React.Fragment key={`${cat.slug}-${idx}`}>
                                                <Link
                                                    href={`/${cat.slug}`}
                                                    className="hover:text-brand-primary transition-colors inline-block"
                                                >
                                                    {cat.name}
                                                </Link>
                                                {idx < data.popular_categories!.length - 1 && (
                                                    <span className="text-slate-300 mx-2 select-none">|</span>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* TOP SERVICES */}
                            {popularServices.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-[11px] uppercase font-bold tracking-[0.15em] text-brand-dark">
                                        Top Services
                                    </h4>
                                    <div className="text-xs leading-loose text-brand-muted">
                                        {popularServices.map((service, idx) => (
                                            <React.Fragment key={`${service.slug}-${idx}`}>
                                                <Link
                                                    href={`/services/${service.slug}`}
                                                    className="hover:text-brand-primary transition-colors inline-block"
                                                >
                                                    {service.name}
                                                </Link>
                                                {idx < popularServices.length - 1 && (
                                                    <span className="text-slate-300 mx-2 select-none">|</span>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* TOP COURSES */}
                            {data.popular_courses && data.popular_courses.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-[11px] uppercase font-bold tracking-[0.15em] text-brand-dark">
                                        Top Courses
                                    </h4>
                                    <div className="text-xs leading-loose text-brand-muted">
                                        {data.popular_courses.map((course, idx) => {
                                            const href = course.categorySlug
                                                ? `/${course.categorySlug}/${course.slug}`
                                                : `/${course.slug}`;
                                            return (
                                                <React.Fragment key={`${course.slug}-${idx}`}>
                                                    <Link
                                                        href={href}
                                                        className="hover:text-brand-primary transition-colors inline-block"
                                                    >
                                                        {course.name}
                                                    </Link>
                                                    {idx < data.popular_courses!.length - 1 && (
                                                        <span className="text-slate-300 mx-2 select-none">|</span>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Disclaimer (if available) */}
            {data.disclaimer && (
                <div className="border-t border-slate-200 py-4">
                    <div className="container mx-auto px-4">
                        <p className="text-[11px] text-slate-400 leading-relaxed text-center md:text-left">
                            {data.disclaimer}
                        </p>
                    </div>
                </div>
            )}

            {/* Bottom Ribbon */}
            {data.bottom_ribbon && (
                <div className="border-t border-slate-200 py-4">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-row items-center justify-between gap-4">
                            <p className="text-xs md:text-sm text-brand-muted text-center md:text-left">
                                {data.bottom_ribbon}
                            </p>

                            <ScrollToTop />
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
}

export default Footer;
