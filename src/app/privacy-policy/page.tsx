import Footer from "@/components/shared/Footer";
import MainNav from "@/components/shared/Navbar";
import { Shield } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Privacy Policy | SkillDeck",
    description: "Read our privacy policy to understand how we collect, use, and protect your personal data.",
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: "/privacy-policy",
    },
};

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-linear-to-b from-white via-blue-50/10 to-white flex flex-col">
            <MainNav />

            <main className="flex-1 py-20 lg:py-32 px-4 lg:px-0">
                <div className="container mx-auto max-w-4xl">
                    {/* Hero Header */}
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="heading-section mb-4">Privacy Policy</h1>
                        <p className="body-medium text-gray-500">Last updated: January 1, 2026</p>
                    </div>

                    {/* Policy Card Wrapper */}
                    <div className="bg-white rounded-2xl p-6 md:p-12 shadow-xl border border-gray-100 prose prose-lg max-w-none text-slate-700 leading-relaxed space-y-8">
                        <div>
                            <h2 className="heading-section2 mb-4">1. Introduction</h2>
                            <p className="body-medium text-gray-600">
                                At SkillDeck (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we are committed to protecting your privacy and personal data.
                                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you
                                use our services, websites, and applications.
                            </p>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">2. Information We Collect</h2>
                            <p className="body-medium text-gray-600 mb-4">We collect information in the following ways:</p>
                            <ul className="list-disc pl-5 space-y-2 body-medium text-gray-600">
                                <li><strong>Personal Information:</strong> Name, email address, phone number, company name, and billing information when you register or make a purchase.</li>
                                <li><strong>Usage Data:</strong> Information about how you interact with our services, including pages visited, features used, and time spent.</li>
                                <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers.</li>
                                <li><strong>Cookies and Tracking:</strong> We use cookies and similar technologies to enhance your experience.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">3. How We Use Your Information</h2>
                            <p className="body-medium text-gray-600 mb-4">We use the collected information to:</p>
                            <ul className="list-disc pl-5 space-y-2 body-medium text-gray-600">
                                <li>Provide, maintain, and improve our services</li>
                                <li>Process transactions and send related information</li>
                                <li>Send promotional communications (with your consent)</li>
                                <li>Respond to customer service requests</li>
                                <li>Monitor and analyze usage patterns</li>
                                <li>Detect and prevent fraud or abuse</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">4. Data Sharing</h2>
                            <p className="body-medium text-gray-600">
                                We do not sell your personal information. We may share your data with trusted third-party service
                                providers who assist us in operating our services, subject to confidentiality agreements. We may
                                also disclose information when required by law or to protect our rights.
                            </p>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">5. Data Security</h2>
                            <p className="body-medium text-gray-600">
                                We implement industry-standard security measures including encryption, firewalls, and secure data
                                centers to protect your information. However, no method of transmission over the Internet is 100%
                                secure, and we cannot guarantee absolute security.
                            </p>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">6. Your Rights</h2>
                            <p className="body-medium text-gray-600 mb-4">Depending on your location, you may have the right to:</p>
                            <ul className="list-disc pl-5 space-y-2 body-medium text-gray-600">
                                <li>Access and receive a copy of your personal data</li>
                                <li>Request correction of inaccurate data</li>
                                <li>Request deletion of your data</li>
                                <li>Object to or restrict processing</li>
                                <li>Data portability</li>
                                <li>Withdraw consent at any time</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">7. Data Retention</h2>
                            <p className="body-medium text-gray-600">
                                We retain your personal information for as long as necessary to provide our services and fulfill
                                the purposes outlined in this policy, unless a longer retention period is required by law.
                            </p>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">8. Children&apos;s Privacy</h2>
                            <p className="body-medium text-gray-600">
                                Our services are not intended for children under 13 years of age. We do not knowingly collect
                                personal information from children under 13. If we learn we have collected such information,
                                we will take steps to delete it.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
