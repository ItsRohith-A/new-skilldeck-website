import type { PricingPlan } from "@/lib/plans";
import FAQ from "@/components/shared/FAQ";
import PartnerLogos from "@/components/shared/PartnerLogos";

import HdHero from "./HdHero";
import HdBentoFeatures from "./HdBentoFeatures";
import HdComparison from "./HdComparison";
import HdWhySkilldeck from "./HdWhySkilldeck";
import HdAudiences from "./HdAudiences";
import HdShowcase from "./HdShowcase";
import HdPricing from "./HdPricing";
import HdCta from "./HdCta";
import HdProblem from "./HdProblem";
import HdPayingFor from "./HdPayingFor";
import HdDemo from "./HdDemo";

// Reused, content-rich sections from the production homepage. These carry real
// copy and assets, so the redesign restyles around them rather than dropping them.
import AllFeaturesMarquee from "@/components/Home/elements/AllFeaturesMarquee";
import MarketplacePromotion from "@/components/Home/elements/MarketplacePromotion";

interface HdRootProps {
    plans: PricingPlan[];
    faqs: { title: string; value: string }[];
}

export default function HdRoot({ plans, faqs }: HdRootProps) {
    return (
        <div className="flex flex-col overflow-hidden w-full">
            {/* 1 — Hook */}
            <HdHero />

            {/* 2 — Social proof immediately under the fold */}
            <div className="bg-white section-y-sm pt-0">
                <div className="container mx-auto px-4 lg:px-0">
                    <PartnerLogos showBorder={false} />
                </div>
            </div>

            {/* 3 — Problem, then the cost breakdown it leads into */}
            <HdProblem />
            <HdPayingFor />

            {/* 4 — Solution framing: without vs. with */}
            <HdComparison />

            {/* 5 — The full feature surface, then the module breakdown */}
            <AllFeaturesMarquee />
            <HdBentoFeatures />

            {/* 6 — See it working */}
            <HdDemo />

            {/* 7 — Why us / proof */}
            <HdWhySkilldeck />

            {/* 8 — Who it's for */}
            <HdAudiences />

            {/* 9 — What you can build */}
            <HdShowcase />

            {/* 10 — Marketplace */}
            <section className="section-y bg-white">
                <div className="container mx-auto px-4 lg:px-0">
                    <MarketplacePromotion />
                </div>
            </section>

            {/* 11 — Offer */}
            <HdPricing plans={plans} />

            {/* 12 — Convert */}
            <HdCta />

            {/* 13 — Objection handling */}
            {faqs.length > 0 && (
                <div className="section-y bg-slate-50" id="faqs">
                    <div className="container mx-auto px-4 lg:px-0">
                        <FAQ items={faqs} />
                    </div>
                </div>
            )}
        </div>
    );
}
