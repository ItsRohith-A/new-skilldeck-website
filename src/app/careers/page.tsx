import MainNav from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CareersHero from "@/components/Careers/elements/CareersHero";
import CareersStats from "@/components/Careers/elements/CareersStats";
import CareersValues from "@/components/Careers/elements/CareersValues";
import CareersJourney from "@/components/Careers/elements/CareersJourney";
import CareersCta from "@/components/Careers/elements/CareersCta";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Careers | SkillDeck",
    description: "Join the SkillDeck team and help build the future of Ed-Tech.",
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: "/careers",
    },
};

export default function CareersPage() {

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/10 to-white flex flex-col">
            {/* Header Navbar */}
            <MainNav />

            {/* Main Content Area */}
            <main className="flex-1">
                <CareersHero />
                <CareersStats />
                <CareersValues />
                <CareersJourney />
                <CareersCta />

            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
