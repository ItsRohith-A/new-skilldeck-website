import Footer from "@/components/shared/Footer";
import MainNav from "@/components/shared/Navbar";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Grievance Redressal | SkillDeck",
    description: "How to raise a complaint with SkillDeck, who handles it, and the timelines we work to.",
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: "/grievance-redressal",
    },
};

/**
 * Published to satisfy Rule 3(2) of the IT (Intermediary Guidelines and Digital
 * Media Ethics Code) Rules 2021 and the Consumer Protection (E-Commerce) Rules
 * 2020, both of which require a named grievance officer and stated timelines.
 *
 * TODO: fill OFFICER_NAME and REGISTERED_ADDRESS with the real details before
 * this is treated as compliant. The officer's name is a legal requirement, not
 * a formality — the blocks below hide themselves while the values are empty
 * rather than publishing a placeholder as if it were fact.
 */
const OFFICER_NAME = "";
const OFFICER_EMAIL = "hello@skilldeck.net";
const OFFICER_PHONE = "+91 8296494941";
const REGISTERED_ADDRESS = "";

export default function GrievanceRedressalPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/10 to-white flex flex-col">
            <MainNav />

            <main className="flex-1 py-20 lg:py-32 px-4 lg:px-0">
                <div className="container mx-auto max-w-4xl">
                    {/* Hero Header */}
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                            <ShieldAlert className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="heading-section mb-4">Grievance Redressal</h1>
                        {/* <p className="body-medium text-gray-500">Last updated: January 1, 2026</p> */}
                    </div>

                    {/* Policy Card Wrapper */}
                    <div className="bg-white rounded-2xl p-6 md:p-12 shadow-xl border border-gray-100 prose prose-lg max-w-none text-slate-700 leading-relaxed space-y-8">
                        <div>
                            <h2 className="heading-section2 mb-4">1. Purpose</h2>
                            <p className="body-medium text-gray-600">
                                This page explains how to raise a complaint about SkillDeck, who handles it and how
                                long we take. It is published under Rule 3(2) of the Information Technology
                                (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and the Consumer
                                Protection (E-Commerce) Rules, 2020.
                            </p>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">2. What You Can Raise Here</h2>
                            <ul className="list-disc pl-5 space-y-2 body-medium text-gray-600">
                                <li>Content on the platform that is unlawful, misleading or infringes your rights.</li>
                                <li>Misuse of your personal data, or a request to access, correct or delete it.</li>
                                <li>Billing disputes not settled under our{' '}
                                    <Link href="/refund-policy" className="text-brand-primary font-semibold hover:underline">
                                        Refund &amp; Cancellation Policy
                                    </Link>.
                                </li>
                                <li>Conduct of a training institute listed on the SkillDeck marketplace.</li>
                                <li>Impersonation of your brand, trademark or course material.</li>
                                <li>Accessibility problems that stop you using the platform.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">3. Grievance Officer</h2>
                            <div className="not-prose rounded-xl border border-gray-100 bg-gray-50/70 p-5 space-y-2">
                                {OFFICER_NAME && (
                                    <p className="body-medium text-gray-700">
                                        <strong>Name:</strong> {OFFICER_NAME}
                                    </p>
                                )}
                                <p className="body-medium text-gray-700">
                                    <strong>Designation:</strong> Grievance Officer, SkillDeck
                                </p>
                                <p className="body-medium text-gray-700">
                                    <strong>Email:</strong>{' '}
                                    <a href={`mailto:${OFFICER_EMAIL}`} className="text-brand-primary font-semibold hover:underline">
                                        {OFFICER_EMAIL}
                                    </a>
                                </p>
                                <p className="body-medium text-gray-700">
                                    <strong>Phone:</strong>{' '}
                                    <a href={`tel:${OFFICER_PHONE.replace(/\s/g, "")}`} className="text-brand-primary font-semibold hover:underline">
                                        {OFFICER_PHONE}
                                    </a>
                                </p>
                                {REGISTERED_ADDRESS && (
                                    <p className="body-medium text-gray-700">
                                        <strong>Address:</strong> {REGISTERED_ADDRESS}
                                    </p>
                                )}
                                <p className="body-small text-gray-500">
                                    Working hours: Monday to Friday, 10:00&ndash;18:00 IST.
                                </p>
                            </div>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">4. What to Include</h2>
                            <p className="body-medium text-gray-600 mb-4">
                                A complaint moves faster when it carries enough to act on:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 body-medium text-gray-600">
                                <li>Your name and the email or phone registered with us.</li>
                                <li>The page URL, institute name or invoice number the complaint concerns.</li>
                                <li>What happened, and what you would like done about it.</li>
                                <li>Screenshots or documents that support it.</li>
                                <li>For rights or trademark claims, proof that you own the right and a statement that the complaint is made in good faith.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">5. Timelines</h2>
                            <ul className="list-disc pl-5 space-y-2 body-medium text-gray-600">
                                <li><strong>Acknowledgement:</strong> within 24 hours of receipt.</li>
                                <li><strong>Resolution:</strong> within 15 days, as required under the IT Rules 2021.</li>
                                <li><strong>Unlawful content, and non-consensual or impersonating imagery:</strong> acted on within 24 hours of a valid complaint.</li>
                                <li><strong>Court or government orders:</strong> acted on within the time the order specifies.</li>
                            </ul>
                            <p className="body-medium text-gray-600 mt-4">
                                Where a complaint needs longer &mdash; because a third party has to respond, for
                                instance &mdash; we tell you why and give a revised date before the 15 days are up.
                            </p>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">6. How We Handle It</h2>
                            <ol className="list-decimal pl-5 space-y-2 body-medium text-gray-600">
                                <li>The complaint is logged with a reference number, sent to you on acknowledgement.</li>
                                <li>We review it, and ask the institute or team concerned for their account where relevant.</li>
                                <li>We decide, act, and write to you with the outcome and the reasoning.</li>
                                <li>If you are not satisfied, reply to that email within 15 days and it is escalated internally for a fresh review.</li>
                            </ol>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">7. Complaints About a Listed Institute</h2>
                            <p className="body-medium text-gray-600">
                                Training institutes on the SkillDeck marketplace run their own admissions, teaching and
                                fees. Course refunds are theirs to settle under their own terms. Raise it with them
                                first; if they do not respond, bring it here and we will take it up with them and, where
                                warranted, act on their listing.
                            </p>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">8. Contact</h2>
                            <p className="body-medium text-gray-600">
                                Write to{' '}
                                <a href={`mailto:${OFFICER_EMAIL}`} className="text-brand-primary font-semibold hover:underline">
                                    {OFFICER_EMAIL}
                                </a>{' '}
                                with &ldquo;Grievance&rdquo; in the subject line, or use our{' '}
                                <Link href="/contact-us" className="text-brand-primary font-semibold hover:underline">
                                    contact page
                                </Link>
                                . See also our{' '}
                                <Link href="/privacy-policy" className="text-brand-primary font-semibold hover:underline">
                                    Privacy Policy
                                </Link>{' '}
                                and{' '}
                                <Link href="/terms-of-service" className="text-brand-primary font-semibold hover:underline">
                                    Terms of Service
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
