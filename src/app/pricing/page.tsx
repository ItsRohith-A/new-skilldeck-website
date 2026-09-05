import { fetchPlans } from "@/lib/plans";
import PricingWrapper from "@/components/Pricing/PricingWrapper";
import MainNav from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Pricing Plans",
    description: "Choose the perfect plan for your training business. Start with a 14-day free trial.",
    robots: {
        index: true,
        follow: true,
    },
};

const faqs = [
    {
        question: 'Can I change my plan later?',
        answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.',
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.',
    },
    {
        question: 'Is there a setup fee?',
        answer: 'No, there are no setup fees. You only pay the monthly or annual subscription cost.',
    },
    {
        question: "What happens after my trial ends?",
        answer: "You'll be prompted to choose a plan. If you don't, your account will be paused but your data will be saved for 30 days.",
    },
];

export const revalidate = false; // Pure On-Demand ISR: cached permanently on Edge CDN until webhook purge

export default async function PricingPage() {
    // Fetch default USD plans on server for the initial SSR skeleton.
    // PricingSection will automatically re-fetch with the correct local
    // currency (e.g. INR) from the user's geoLocation session storage
    // via the useIpLocation hook, client-side.
    const plans = await fetchPlans('USD');

    return (
        <>
            <MainNav />
            <PricingWrapper 
                plans={plans} 
                faqs={faqs} 
            />
            <Footer />
        </>
    );
}
