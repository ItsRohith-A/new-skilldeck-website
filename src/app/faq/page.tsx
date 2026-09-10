import MainNav from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import FaqClient from "@/components/Faq/FaqClient";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Frequently Asked Questions | SkillDeck",
    description: "Get answers to your questions about SkillDeck products and services.",
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: "/faq",
    },
};

export default function FaqPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/10 to-white flex flex-col">
            <MainNav />
            <main className="flex-1">
                <FaqClient />
            </main>
            <Footer />
        </div>
    );
}
