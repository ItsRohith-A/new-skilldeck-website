import { Suspense } from "react";
import { Metadata } from "next";
import MainNav from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CompareRoot from "@/components/compare/CompareRoot";
import CompareSkeleton from "@/components/compare/CompareSkeleton";

export const metadata: Metadata = {
    title: "Compare Programmes | SkillDeck",
    description:
        "Put up to four training programmes side by side — fees, cost per week of instruction, curriculum depth, commitment and delivery.",
    robots: {
        index: false,
        follow: true,
    },
    alternates: {
        canonical: "/compare",
    },
};

export default function ComparePage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <MainNav />
            <main className="flex-1 pt-20 md:pt-24">
                {/* CompareRoot reads ?type / ?course / ?ids via useSearchParams. */}
                <Suspense fallback={<CompareSkeleton />}>
                    <CompareRoot />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
