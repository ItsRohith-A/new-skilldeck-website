import AboutContent from "@/components/AboutUs/elements/AboutContent";
import AboutCta from "@/components/AboutUs/elements/AboutCta";
import AboutHero from "@/components/AboutUs/elements/AboutHero";
import AboutJourney from "@/components/AboutUs/elements/AboutJourney";
import AboutMissionVision from "@/components/AboutUs/elements/AboutMissionVision";
import AboutStats from "@/components/AboutUs/elements/AboutStats";
import AboutWhyChooseUs from "@/components/AboutUs/elements/AboutWhyChooseUs";
import Footer from "@/components/shared/Footer";
import MainNav from "@/components/shared/Navbar";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "About Us | SkillDeck",
    description: "Learn about the SkillDeck journey and mission.",
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: "/about-us",
    },
};

export default function AboutUsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/10 to-white flex flex-col">
            {/* Navigation Header */}
            <MainNav />

            {/* Main Content Area */}
            <main className="flex-1">
                <AboutHero />
                <AboutStats />
                <AboutContent />
                <AboutMissionVision />
                <AboutWhyChooseUs />
                <AboutJourney />
                <AboutCta />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
