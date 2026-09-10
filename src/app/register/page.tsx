import RegisterForm from "@/components/Register/RegisterForm";
import { RegisterHeader } from "@/components/Register/elements/RegisterHeader";
import { fetchCountries } from "@/lib/location";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Create your Free SkillDeck Account | Get Started In Minutes",
    description: "Plug & play platform to automate your training business operations across departments. One Operating system- Worldclass website, LMS, CMS, CRM, Events management, Class management, & 100+ Other features. All at the price of your hosting. Register now!",
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: "/register",
    },
};

export default async function RegisterPage() {
    // Fetch countries server-side
    const countries = await fetchCountries();

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-x-hidden font-inter selection:bg-brand-primary selection:text-white">
            {/* Ambient Background Decorative Gradients - Desktop */}
            <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-brand-primary/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Navigation Header */}
            <RegisterHeader />

            {/* Main Application Container - Clean Mobile Card, Centered Desktop Card */}
            <main className="flex-1 flex flex-col justify-start sm:justify-center items-center w-full px-3 sm:px-4 py-2.5 sm:py-4 relative z-10">
                <Suspense
                    fallback={
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-brand-primary"></div>
                        </div>
                    }
                >
                    <RegisterForm countries={countries} />
                </Suspense>
            </main>
        </div>
    );
}
