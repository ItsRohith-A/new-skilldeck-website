import Footer from "@/components/shared/Footer";
import MainNav from "@/components/shared/Navbar";
import { FileText } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Terms of Service | SkillDeck",
    description: "Read our terms of service and conditions for using SkillDeck products and services.",
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: "/terms-of-service",
    },
};

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/10 to-white flex flex-col">
            <MainNav />

            <main className="flex-1 py-20 lg:py-32 px-4 lg:px-0">
                <div className="container mx-auto max-w-4xl">
                    {/* Hero Header */}
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="heading-section mb-4">Terms of Service</h1>
                        <p className="body-medium text-gray-500">Last updated: January 1, 2026</p>
                    </div>

                    {/* Policy Card Wrapper */}
                    <div className="bg-white rounded-2xl p-6 md:p-12 shadow-xl border border-gray-100 prose prose-lg max-w-none text-slate-700 leading-relaxed space-y-8">
                        <div>
                            <h2 className="heading-section2 mb-4">1. Acceptance of Terms</h2>
                            <p className="body-medium text-gray-600">
                                By accessing or using SkillDeck&apos;s services, websites, or applications (collectively, the &quot;Services&quot;),
                                you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms,
                                please do not use our Services.
                            </p>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">2. Description of Services</h2>
                            <p className="body-medium text-gray-600">
                                SkillDeck provides a suite of business tools including but not limited to Learning Management
                                Systems (LMS), Website Builder &amp; CMS, Web Chat solutions, and Customer Relationship Management
                                (CRM) software. We reserve the right to modify, suspend, or discontinue any part of the Services
                                at any time.
                            </p>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">3. User Accounts</h2>
                            <p className="body-medium text-gray-600 mb-4">To use certain features, you must create an account. You agree to:</p>
                            <ul className="list-disc pl-5 space-y-2 body-medium text-gray-600">
                                <li>Provide accurate, current, and complete information</li>
                                <li>Maintain the security of your password and account</li>
                                <li>Notify us immediately of any unauthorized access</li>
                                <li>Be responsible for all activities under your account</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">4. Acceptable Use</h2>
                            <p className="body-medium text-gray-600 mb-4">You agree not to:</p>
                            <ul className="list-disc pl-5 space-y-2 body-medium text-gray-600">
                                <li>Use the Services for any illegal or unauthorized purpose</li>
                                <li>Violate any laws in your jurisdiction</li>
                                <li>Infringe on intellectual property rights</li>
                                <li>Transmit malware, viruses, or harmful code</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                                <li>Interfere with the proper working of the Services</li>
                                <li>Harass, abuse, or threaten other users</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">5. Payment Terms</h2>
                            <p className="body-medium text-gray-600">
                                For paid Services, you agree to pay all applicable fees as described on our pricing page.
                                All fees are non-refundable except as expressly stated in our Refund Policy. We reserve
                                the right to change our prices with 30 days&apos; notice.
                            </p>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">6. Intellectual Property</h2>
                            <p className="body-medium text-gray-600">
                                All content, features, and functionality of the Services are owned by SkillDeck and are
                                protected by copyright, trademark, and other intellectual property laws. You may not copy,
                                modify, distribute, sell, or lease any part of our Services without prior written consent.
                            </p>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">7. User Content</h2>
                            <p className="body-medium text-gray-600">
                                You retain ownership of content you submit to the Services. By submitting content, you grant
                                us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display your content
                                solely for the purpose of providing the Services.
                            </p>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">8. Disclaimer of Warranties</h2>
                            <p className="body-medium text-gray-600 uppercase tracking-wide text-sm">
                                THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER
                                EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, SECURE, OR
                                ERROR-FREE.
                            </p>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">9. Contact</h2>
                            <p className="body-medium text-gray-600">
                                If you have questions about these Terms, please contact us at{' '}
                                <a href="mailto:hello@skilldeck.net" className="text-brand-primary font-semibold hover:underline">
                                    hello@skilldeck.net
                                </a>.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
