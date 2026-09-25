import Footer from "@/components/shared/Footer";
import MainNav from "@/components/shared/Navbar";
import { ReceiptText } from "lucide-react";
import Link from "next/link";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Refund & Cancellation Policy | SkillDeck",
    description: "How SkillDeck subscriptions are cancelled, when refunds apply, and how to request one.",
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: "/refund-policy",
    },
};

/**
 * The Terms of Service already point at "our Refund Policy" and the page did
 * not exist. Payment gateways also require a published refund and cancellation
 * policy before a subscription product can go live.
 */
export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/10 to-white flex flex-col">
            <MainNav />

            <main className="flex-1 py-20 lg:py-32 px-4 lg:px-0">
                <div className="container mx-auto max-w-4xl">
                    {/* Hero Header */}
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                            <ReceiptText className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="heading-section mb-4">Refund &amp; Cancellation Policy</h1>
                        {/* <p className="body-medium text-gray-500">Last updated: January 1, 2026</p> */}
                    </div>

                    {/* Policy Card Wrapper */}
                    <div className="bg-white rounded-2xl p-6 md:p-12 shadow-xl border border-gray-100 prose prose-lg max-w-none text-slate-700 leading-relaxed space-y-8">
                        <div>
                            <h2 className="heading-section2 mb-4">1. Scope</h2>
                            <p className="body-medium text-gray-600">
                                This policy covers subscriptions to the SkillDeck platform bought directly from us. It
                                sits alongside our{' '}
                                <Link href="/terms-of-service" className="text-brand-primary font-semibold hover:underline">
                                    Terms of Service
                                </Link>
                                . Courses and training programmes sold by institutes listed on the SkillDeck
                                marketplace are governed by that institute&apos;s own refund terms, not this policy.
                            </p>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">2. Free Trial</h2>
                            <p className="body-medium text-gray-600">
                                Paid plans begin with a free trial. No payment is taken during the trial, and you can
                                cancel before it ends without being charged. If you do not choose a plan when the trial
                                ends, your account is paused rather than billed.
                            </p>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">3. Cancelling a Subscription</h2>
                            <ul className="list-disc pl-5 space-y-2 body-medium text-gray-600">
                                <li>You can cancel at any time from your dashboard billing settings, or by writing to us.</li>
                                <li>Cancellation stops the next renewal. Your plan stays active until the end of the billing period you have already paid for.</li>
                                <li>No cancellation fee applies.</li>
                                <li>Your data remains available for 30 days after the period ends, so you can export it.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">4. When Refunds Apply</h2>
                            <p className="body-medium text-gray-600 mb-4">
                                Subscription fees are charged in advance and are generally non-refundable, because the
                                trial exists for evaluating the platform. We do issue refunds in these cases:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 body-medium text-gray-600">
                                <li><strong>Duplicate or incorrect charge:</strong> refunded in full.</li>
                                <li><strong>Charge after a cancellation:</strong> refunded in full.</li>
                                <li><strong>Sustained outage we could not resolve:</strong> a pro-rata credit or refund for the affected period.</li>
                                <li><strong>Annual plans:</strong> a request within 14 days of the first annual charge is refunded, less any month already used.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">5. What Is Not Refundable</h2>
                            <ul className="list-disc pl-5 space-y-2 body-medium text-gray-600">
                                <li>Periods already served on a monthly plan.</li>
                                <li>Setup, migration, custom development and design work that has been delivered.</li>
                                <li>Marketplace listing and placement spend that has already been served to learners.</li>
                                <li>Third-party costs bought on your behalf, such as domains and payment gateway fees.</li>
                                <li>Accounts suspended for breaching the Terms of Service.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">6. Requesting a Refund</h2>
                            <p className="body-medium text-gray-600">
                                Email{' '}
                                <a href="mailto:hello@skilldeck.net" className="text-brand-primary font-semibold hover:underline">
                                    hello@skilldeck.net
                                </a>{' '}
                                from the address on the account, with the invoice number and the reason. We respond
                                within 3 working days. Approved refunds are returned to the original payment method
                                within 7&ndash;10 working days; how quickly it appears then depends on your bank or card
                                issuer.
                            </p>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">7. Changes to This Policy</h2>
                            <p className="body-medium text-gray-600">
                                We may update this policy. Changes apply to charges made after the updated version is
                                published, and the date at the top of this page tells you when it last changed.
                            </p>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">8. Contact</h2>
                            <p className="body-medium text-gray-600">
                                Questions about billing or this policy? Reach us at{' '}
                                <a href="mailto:hello@skilldeck.net" className="text-brand-primary font-semibold hover:underline">
                                    hello@skilldeck.net
                                </a>{' '}
                                or through our{' '}
                                <Link href="/contact-us" className="text-brand-primary font-semibold hover:underline">
                                    contact page
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
