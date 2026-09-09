import MainNav from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ContactHero from "@/components/ContactUs/elements/ContactHero";
import ContactMethods from "@/components/ContactUs/elements/ContactMethods";
import ContactFormSection from "@/components/ContactUs/elements/ContactFormSection";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Contact Us | SkillDeck",
    description: "Get in touch with SkillDeck team. Sales, support, and office locations.",
    robots: {
        index: true,
        follow: true,
    },
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/10 to-white flex flex-col">
            {/* Navigation Header */}
            <MainNav />

            {/* Main Content Area */}
            <main className="flex-1">
                <ContactHero />
                <ContactMethods />
                <ContactFormSection />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
