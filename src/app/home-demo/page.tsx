import { Metadata } from "next";
import MainNav from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import HdRoot from "@/components/home-demo/HdRoot";
import { HOME_DEMO_FAQS } from "@/components/home-demo/faqs";
import { fetchPlans } from "@/lib/plans";

export const metadata: Metadata = {
    title: "Homepage Redesign — Design Reference",
    description: "Internal design reference for a revamped Skilldeck homepage. Not a public page.",
    robots: {
        index: false,
        follow: false,
    },
};

export const revalidate = false;

// Internal-only design reference — a redesign of the homepage against the real
// content set. Does not touch or replace the production "/" route.
export default async function HomeDemoPage() {
    const plans = await fetchPlans("INR");

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <MainNav />
            <main className="flex-1">
                <HdRoot plans={plans} faqs={HOME_DEMO_FAQS} />
            </main>
            <Footer />
        </div>
    );
}
