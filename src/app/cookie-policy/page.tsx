import Footer from "@/components/shared/Footer";
import MainNav from "@/components/shared/Navbar";
import { Cookie } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Cookie Policy | SkillDeck",
    description: "Learn about how SkillDeck uses cookies and tracking technologies.",
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: "/cookie-policy",
    },
};

export default function CookiePolicyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/10 to-white flex flex-col">
            <MainNav />

            <main className="flex-1 py-20 lg:py-32 px-4 lg:px-0">
                <div className="container mx-auto max-w-4xl">
                    {/* Hero Header */}
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                            <Cookie className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="heading-section mb-4">Cookie Policy</h1>
                        <p className="body-medium text-gray-500">Last updated: January 1, 2026</p>
                    </div>

                    {/* Policy Card Wrapper */}
                    <div className="bg-white rounded-2xl p-6 md:p-12 shadow-xl border border-gray-100 prose prose-lg max-w-none text-slate-700 leading-relaxed space-y-8">
                        <div>
                            <h2 className="heading-section2 mb-4">1. What Are Cookies?</h2>
                            <p className="body-medium text-gray-600">
                                Cookies are small text files that are stored on your device when you visit a website.
                                They are widely used to make websites work efficiently and provide information to the
                                website owners. Cookies enable features like remembering your preferences and improving
                                your experience.
                            </p>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">2. How We Use Cookies</h2>
                            <p className="body-medium text-gray-600 mb-4">SkillDeck uses cookies for the following purposes:</p>
                            <ul className="list-disc pl-5 space-y-2 body-medium text-gray-600">
                                <li><strong>Essential Cookies:</strong> Required for the website to function properly. These cannot be disabled.</li>
                                <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website by collecting anonymous information.</li>
                                <li><strong>Functionality Cookies:</strong> Remember your preferences and personalize your experience.</li>
                                <li><strong>Marketing Cookies:</strong> Track your activity across websites to deliver relevant advertisements.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">3. Types of Cookies We Use</h2>
                            <div className="overflow-x-auto border border-gray-100 rounded-xl">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/70 border-b border-gray-100">
                                            <th className="px-4 py-3 font-semibold text-brand-dark body-small">Cookie Name</th>
                                            <th className="px-4 py-3 font-semibold text-brand-dark body-small">Type</th>
                                            <th className="px-4 py-3 font-semibold text-brand-dark body-small">Purpose</th>
                                            <th className="px-4 py-3 font-semibold text-brand-dark body-small">Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody className="body-small text-gray-600 divide-y divide-gray-100">
                                        <tr>
                                            <td className="px-4 py-3 font-mono text-xs">session_id</td>
                                            <td className="px-4 py-3">Essential</td>
                                            <td className="px-4 py-3">Maintains user session</td>
                                            <td className="px-4 py-3">Session</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-mono text-xs">auth_token</td>
                                            <td className="px-4 py-3">Essential</td>
                                            <td className="px-4 py-3">Authentication</td>
                                            <td className="px-4 py-3">30 days</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-mono text-xs">_ga</td>
                                            <td className="px-4 py-3">Performance</td>
                                            <td className="px-4 py-3">Google Analytics</td>
                                            <td className="px-4 py-3">2 years</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-mono text-xs">user_prefs</td>
                                            <td className="px-4 py-3">Functionality</td>
                                            <td className="px-4 py-3">User preferences</td>
                                            <td className="px-4 py-3">1 year</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">4. Third-Party Cookies</h2>
                            <p className="body-medium text-gray-600 mb-4">
                                We use third-party services that may set cookies on your device. These include:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 body-medium text-gray-600">
                                <li><strong>Google Analytics:</strong> For website traffic analysis</li>
                                <li><strong>Intercom:</strong> For customer support chat</li>
                                <li><strong>Stripe:</strong> For payment processing</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
