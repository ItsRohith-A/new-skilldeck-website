import CompaniesHero from "@/components/companies/CompaniesHero";
import CompanyDirectory from "@/components/companies/CompanyDirectory";
import SponsoredCarousel from "@/components/companies/SponsoredCarousel";
import BrandLogos from "@/components/shared/BrandLogos";
import Footer from "@/components/shared/Footer";
import MainNav from "@/components/shared/Navbar";
import { getTenants } from "@/lib/platformService";
import { Company } from "@/types";
import { Loader2 } from "lucide-react";
import { headers } from "next/headers";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: "Training Companies Directory | SkillDeck",
    description: "Discover top-tier training companies, explore their professional courses, and find the perfect training provider on SkillDeck.",
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: "/companies",
    },
};

interface CompaniesPageProps {
    searchParams: Promise<{ page?: string; fp?: string; search?: string }> | { page?: string; fp?: string; search?: string };
}

async function fetchDirectoryData(page: number, fp: number, search?: string) {
    const headersList = await headers();
    const userIp = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "127.0.0.1";

    let regularCompanies: Company[] = [];
    let featuredCompanies: Company[] = [];
    let totalPages = 1;
    let totalRegular = 0;
    let totalFeaturedPages = 1;

    try {
        const regularRes = await getTenants({
            featured: false,
            page: page,
            limit: 6,
            userIp,
            search: search || undefined
        });

        totalPages = regularRes.totalPages || 1;
        totalRegular = regularRes.total || 0;
        regularCompanies = (regularRes.data || []).map((c: any) => ({
            id: c.id,
            name: c.legalName || c.name,
            slug: c.slug || c.id,
            logo: c.logo || "",
            shortDescription: c.platformProfile?.shortDescription || "Leading training provider",
            description: c.platformProfile?.description || "",
            industry: c.industry || "Professional Training",
            location: c.address ? `${c.address.city || ''}, ${c.address.country || ''}`.replace(/^, /, '') : "Global",
            isVerified: true,
            isSponsored: false,
            companySize: c.companySize,
            foundedYear: c.foundedYear
        }));

        const featuredRes = await getTenants({
            featured: true,
            page: fp,
            limit: 3,
            userIp
        });

        totalFeaturedPages = featuredRes.totalPages || 1;
        featuredCompanies = (featuredRes.data || []).map((c: any) => ({
            id: c.id,
            name: c.legalName || c.name,
            slug: c.slug || c.id,
            logo: c.logo || "",
            shortDescription: c.platformProfile?.shortDescription || "Featured partner",
            description: c.platformProfile?.description || "",
            industry: c.industry || "Professional Training",
            location: c.address ? `${c.address.city || ''}, ${c.address.country || ''}`.replace(/^, /, '') : "Global",
            isVerified: true,
            isSponsored: true,
            companySize: c.companySize,
            foundedYear: c.foundedYear
        }));
    } catch (err) {
        console.error("[CompaniesPage] SSR Fetch Error:", err);
    }

    return {
        regularCompanies,
        featuredCompanies,
        totalPages,
        totalRegular,
        totalFeaturedPages
    };
}


export default async function CompaniesPage({ searchParams }: CompaniesPageProps) {
    const resolvedSearchParams = await searchParams;
    const page = Number(resolvedSearchParams?.page) || 1;
    const fp = Number(resolvedSearchParams?.fp) || 1;
    const search = resolvedSearchParams?.search || "";

    const {
        regularCompanies,
        featuredCompanies,
        totalPages,
        totalRegular,
        totalFeaturedPages
    } = await fetchDirectoryData(page, fp, search);

    // Schema.org Structured Data for SEO optimization
    const directorySchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": [...featuredCompanies, ...regularCompanies].map((company, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "EducationalOrganization",
                "name": company.name,
                "url": `https://skilldeck.com/${company.slug}`,
                "image": company.logo || undefined,
                "description": company.shortDescription
            }
        }))
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            {/* Structured Schema Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(directorySchema) }}
            />

            <MainNav />

            <main className="flex-1">
                {/* Visual Companies Banner Hero */}
                <CompaniesHero totalCompanies={totalRegular} />
                <div className="container mx-auto px-4 lg:px-0">
                    <BrandLogos className="mt-10 mb-15" />
                </div>

                <div className="container mx-auto px-4 lg:px-0 pb-16">
                    <Suspense fallback={
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        </div>
                    }>
                        {/* Featured Partners Section */}
                        <SponsoredCarousel companies={featuredCompanies} />

                        {/* All Partners Directory */}
                        <CompanyDirectory
                            regularCompanies={regularCompanies}
                            totalRegular={totalRegular}
                            totalPages={totalPages}
                            page={page}
                            fp={fp}
                            search={search}
                        />
                    </Suspense>
                </div>
            </main>

            <Footer />
        </div>
    );
}
