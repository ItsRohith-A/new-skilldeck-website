import CompanyAboutCard from "@/components/companies/CompanyAboutCard";
import CompanyContactCard from "@/components/companies/CompanyContactCard";
import CompanyFacilitiesCard from "@/components/companies/CompanyFacilitiesCard";
import CompanyInfoCard from "@/components/companies/CompanyInfoCard";
import CompanyProfileHero from "@/components/companies/CompanyProfileHero";
import CompanySchedulesList from "@/components/companies/CompanySchedulesList";
import CompanyScoreCard from "@/components/companies/CompanyScoreCard";
import CompanyServicesCard from "@/components/companies/CompanyServicesCard";
import { CompareProvider } from "@/components/companies/compare/CompareContext";
import { CompareDrawer } from "@/components/companies/compare/CompareDrawer";
import Footer from "@/components/shared/Footer";
import MainNav from "@/components/shared/Navbar";
import { getTenantProfile } from "@/lib/platformService";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const revalidate = false; // Pure On-Demand ISR: cached permanently on Edge CDN until webhook purge
export const dynamicParams = true;

// URL: /companies/[slug]?id=<tenantId>
// slug → SEO path  |  id → backend fetch key
interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ id?: string }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { slug } = await params;
    const { id } = await searchParams;
    const tenant = await getTenantProfile(id || slug);
    if (!tenant) return { title: "Company Not Found | SkillDeck" };

    const name = tenant.legalName || tenant.name;
    const desc = (tenant.platformProfile?.shortDescription || "").replace(/<[^>]*>/g, "");

    return {
        title: `${name}`,
        description: desc,
        openGraph: { title: `${name} | SkillDeck`, description: desc, images: tenant.logo ? [{ url: tenant.logo }] : [] },
        robots: { index: true, follow: true },
        alternates: { canonical: `/companies/${slug}` },
    };
}

function hasTextContent(html?: string): boolean {
    if (!html) return false;
    const text = html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, "").trim();
    return text.length > 0;
}

export default async function CompanyProfilePage({ params, searchParams }: Props) {
    const { slug } = await params;
    const { id } = await searchParams;

    const tenant = await getTenantProfile(id || slug);
    if (!tenant) notFound();

    const name = tenant.legalName || tenant.name;
    const profile = tenant.platformProfile || {};

    const hasDesc = hasTextContent(profile.description);
    const aboutDescription = hasDesc ? (profile.description || "") : (profile.shortDescription || "");

    return (
        <CompareProvider>
            <div className="min-h-screen flex flex-col bg-white">
                <MainNav />

                <main className="flex-1">
                    {/* ── Hero: breadcrumb, logo, name, tags ── */}
                    <CompanyProfileHero tenant={{ ...tenant, name }} />

                    {/* ── Stats bar + company overview (dynamic only) ── */}
                    <CompanyInfoCard
                        info={{
                            foundedYear: tenant.foundedYear,
                            employeeCount: tenant.companySize,
                            industry: tenant.industry,
                            headquarters: tenant.address,
                        }}
                    />

                    {/* ── Main 2-column layout ── */}
                    <div className="container mx-auto px-2 lg:px-0 py-10">
                        <div className="flex flex-col lg:flex-row gap-10">
                            {/* Left — main content */}
                            <div className="flex-1 min-w-0 space-y-8">
                                {/* About section */}
                                <CompanyAboutCard
                                    companyName={name}
                                    description={aboutDescription}
                                />

                                {/* Score card — deterministic per company, always shown */}
                                <CompanyScoreCard tenantId={tenant.id} />

                                {/* Training areas */}
                                <CompanyServicesCard services={profile.trainingAreas || []} />



                                {/* Schedules — client island */}
                                <div id="schedules" className="pt-6 border-t border-slate-100">
                                    <Suspense fallback={
                                        <div className="space-y-3">
                                            {[0, 1, 2].map(i => (
                                                <div key={i} className="h-28 animate-pulse bg-slate-100 rounded-xl" />
                                            ))}
                                        </div>
                                    }>
                                        <CompanySchedulesList companyId={tenant.id} />
                                    </Suspense>
                                </div>
                                {/* Facilities static block */}
                                <CompanyFacilitiesCard />
                            </div>

                            {/* Right — sticky contact card */}
                            <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
                                <CompanyContactCard
                                    companyName={name}
                                    tenantId={tenant.id}
                                    address={tenant.address}
                                    contact={{
                                        website: profile.website,
                                        email: profile.email || tenant.ownerEmail,
                                        phone: profile.phoneNumber || profile.phone || tenant.phoneNumber,
                                    }}
                                />
                            </div>
                        </div>
                    </div>


                </main>

                <Footer />
                <CompareDrawer />
            </div>
        </CompareProvider>
    );
}
