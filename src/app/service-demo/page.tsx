import { Metadata } from "next";
import DemoNav from "@/components/service-demo/DemoNav";
import DemoHero from "@/components/service-demo/DemoHero";
import DemoTrust from "@/components/service-demo/DemoTrust";
import DemoServices from "@/components/service-demo/DemoServices";
import DemoWorkflow from "@/components/service-demo/DemoWorkflow";
import DemoUseCases from "@/components/service-demo/DemoUseCases";
import DemoTestimonials from "@/components/service-demo/DemoTestimonials";
import DemoIntelligence from "@/components/service-demo/DemoIntelligence";
import DemoSecurity from "@/components/service-demo/DemoSecurity";
import DemoIntegrations from "@/components/service-demo/DemoIntegrations";
import DemoFaq from "@/components/service-demo/DemoFaq";
import DemoFooter from "@/components/service-demo/DemoFooter";
import { demoTheme } from "@/components/service-demo/theme";
import { getServicesCategories } from "@/lib/services";

export const metadata: Metadata = {
    title: "Training Operations Platform — Concept",
    description:
        "Concept service page: admissions, delivery, learner outcomes and revenue for training academies in one workspace.",
    // Design concept, not a live offer — keep it out of the index.
    robots: { index: false, follow: false },
};

/**
 * /service-demo — a self-contained design concept.
 *
 * Everything it needs lives under `components/service-demo`, and its palette is
 * declared as CSS variables on the wrapper below rather than in `globals.css`,
 * so the live pages are untouched by it. Even the header and footer are its own —
 * only the lead modal is shared with the rest of the site.
 */
export default async function ServiceDemoPage() {
    // Real services from the CMS, flattened and deduped for the nav dropdown.
    const categories = await getServicesCategories().catch(() => []);
    const services = Array.from(
        new Map(
            categories
                .flatMap((category) => category.services || [])
                .filter((service) => service?.slug)
                .map((service) => [
                    service.slug,
                    {
                        slug: service.slug,
                        name: service.name || service.service_name,
                        icon: service.servicecard?.icon,
                        thumbnail: service.servicecard?.thumbnail,
                    },
                ])
        ).values()
    );

    return (
        <div className="flex flex-col min-h-screen bg-white" style={demoTheme}>
            <DemoNav services={services} />

            <main className="flex-1">
                <DemoHero />
                <DemoTrust />
                <DemoServices />
                <DemoWorkflow />
                <DemoUseCases />
                <DemoTestimonials />
                <DemoIntelligence />
                <DemoSecurity />
                <DemoIntegrations />
                <DemoFaq />
            </main>

            <DemoFooter />
        </div>
    );
}
