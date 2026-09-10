import dynamic from "next/dynamic";
import { PricingPlan } from "@/lib/plans";
import FAQ from "../shared/FAQ";
import type { ServiceItem } from "@/lib/services";
import PartnerLogos from "../shared/PartnerLogos";

import HdHero from "../home-demo/HdHero";
import HdProblem from "../home-demo/HdProblem";
import HdPayingFor from "../home-demo/HdPayingFor";
import HdComparison from "../home-demo/HdComparison";
import HdBentoFeatures from "../home-demo/HdBentoFeatures";

import AllFeaturesMarquee from "./elements/AllFeaturesMarquee";
import MarketplacePromotion from "./elements/MarketplacePromotion";
import ServicesGrid from "./elements/ServicesGrid";

// Lazy-load heavy components below the fold for mobile performance (maintains SSR for SEO)
const HdDemo = dynamic(() => import("../home-demo/HdDemo"), {
    loading: () => <div className="h-96 w-full animate-pulse bg-slate-50" />,
    ssr: true,
});

const HdWhySkilldeck = dynamic(() => import("../home-demo/HdWhySkilldeck"), {
    loading: () => <div className="h-96 w-full animate-pulse bg-slate-900" />,
    ssr: true,
});

const HdAudiences = dynamic(() => import("../home-demo/HdAudiences"), {
    loading: () => <div className="h-96 w-full animate-pulse bg-white" />,
    ssr: true,
});

const HdPricing = dynamic(() => import("../home-demo/HdPricing"), {
    loading: () => <div className="h-96 w-full animate-pulse bg-white" />,
    ssr: true,
});

const HdCta = dynamic(() => import("../home-demo/HdCta"), {
    loading: () => <div className="h-96 w-full animate-pulse bg-white" />,
    ssr: true,
});

interface HomeProps {
    plans?: PricingPlan[];
    faqs?: { title: string; value: string }[];
    partnerLogos?: { src: string; alt: string }[];
    services?: ServiceItem[];
}

const Home = ({ plans = [], faqs = [], partnerLogos = [], services = [] }: HomeProps) => {
    return (
        <div className="flex flex-col overflow-hidden w-full">
            {/* 1 — Hook */}
            <HdHero />

            {/* 2 — Social proof immediately under the fold */}
            <div className="">
                <div className="container mx-auto px-4 lg:px-0">
                    <PartnerLogos showBorder={false} initialLogos={partnerLogos} />
                </div>
            </div>

            {/* 3 — Problem, then the cost breakdown it leads into */}
            <HdProblem />

            {/* 4 — Services we deliver */}
            <ServicesGrid services={services} />

            {/* 5 — Paying for */}
            <HdPayingFor />

            {/* 6 — Solution framing: without vs. with */}
            <HdComparison />

            {/* 7 — The full feature surface, then the module breakdown */}
            <AllFeaturesMarquee />

            {/* 8 — Offer */}
            <HdPricing plans={plans} />

            <HdBentoFeatures />

            {/* 9 — See it working */}
            <HdDemo />

            {/* 10 — Why us, with the track record folded in */}
            <HdWhySkilldeck />

            {/* 11 — Who it's for */}
            <HdAudiences />

            {/* 13 — Marketplace */}
            <MarketplacePromotion />

            {/* 14 — Convert */}
            <HdCta />

            {/* 15 — Objection handling */}
            {faqs.length > 0 && (
                <div className=" bg-slate-50" id="faqs">
                    <div className="container mx-auto px-4 lg:px-0">
                        <FAQ items={faqs} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
