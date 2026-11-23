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
                        {/* <p className="body-medium text-gray-500">Last updated: January 1, 2026</p> */}
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

                        <div>
                            <h2 className="heading-section2 mb-4">9. Connected Social Media Accounts (Facebook, Instagram, LinkedIn)</h2>
                            <p className="body-medium text-gray-600 mb-4">
                                SkillDeck&apos;s Social Media module lets a business connect the Facebook Pages, Instagram professional
                                accounts and LinkedIn Pages it manages, so it can publish posts, reply to comments and messages, and view
                                performance from the SkillDeck dashboard. You connect an account yourself through the network&apos;s own login
                                (Facebook Login for Business or LinkedIn sign-in) and choose which permissions and accounts to share.
                            </p>
                            <p className="body-medium text-gray-600 mb-4"><strong>What we access:</strong></p>
                            <ul className="list-disc pl-5 space-y-2 body-medium text-gray-600 mb-4">
                                <li>The list of Pages and accounts you manage, and the name, username, profile picture and follower count of the ones you connect.</li>
                                <li>Posts on the connected account and their reactions, comments and shares.</li>
                                <li>Comments, reviews, mentions and direct messages sent to the connected account, with the public name and picture of the sender.</li>
                                <li>Performance metrics (insights) such as reach, engagement, followers and profile views.</li>
                                <li>An access token issued by the network, which lets SkillDeck act on the account you connected.</li>
                            </ul>
                            <p className="body-medium text-gray-600 mb-4"><strong>How we use it:</strong> only to provide the features you use in
                                SkillDeck: publishing and scheduling posts you write, editing or deleting them, showing your posts and
                                metrics, and letting you reply to and moderate comments and messages. Every post, reply and moderation
                                action is taken by a person in your business. We do not send automated or promotional messages, we do
                                not use this data for advertising or profiling, we do not combine it across customers, and we do not sell
                                or share it with third parties, except service providers that host our systems.
                            </p>
                            <p className="body-medium text-gray-600 mb-4"><strong>How we store it:</strong> access tokens are encrypted
                                (AES-256-GCM) and kept in your organisation&apos;s own database. Comments, reviews, messages and insights are
                                fetched from the network when you open the relevant screen and are not stored in our database. We store
                                the posts you create in SkillDeck and the connected account&apos;s name and profile picture.
                            </p>
                            <p className="body-medium text-gray-600 mb-4"><strong>How long we keep it:</strong> while the account stays
                                connected. When you disconnect an account in SkillDeck, remove SkillDeck from your Facebook, Instagram or
                                LinkedIn settings, or ask for deletion, we delete its access token and stored profile data and stop all
                                access.
                            </p>
                            <p className="body-medium text-gray-600 mb-4"><strong>How to delete your data:</strong></p>
                            <ul className="list-disc pl-5 space-y-2 body-medium text-gray-600 mb-4">
                                <li>In SkillDeck, go to Marketing &gt; Social Media &gt; Accounts and click Disconnect on the account; or</li>
                                <li>On Facebook, go to Settings &amp; privacy &gt; Settings &gt; Business integrations, remove SkillDeck and
                                    choose to delete data. Facebook sends us a deletion request and gives you a confirmation code to check its status; or</li>
                                <li>Email <a href="mailto:hello@skilldeck.net" className="text-brand-primary font-semibold hover:underline">hello@skilldeck.net</a> with the
                                    account name, and we will delete the data within 30 days.</li>
                            </ul>
                            <p className="body-medium text-gray-600">
                                Our use of data received from Meta platforms follows the Meta Platform Terms and Developer Policies, and our use of
                                LinkedIn data follows the LinkedIn API Terms of Use.
                            </p>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">10. Google Account Data (Google Sign-In and Google Calendar)</h2>
                            <p className="body-medium text-gray-600 mb-4">
                                SkillDeck uses Google APIs in two places. Each one asks for your permission on Google&apos;s own consent
                                screen, and asks only for what that feature needs.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 body-medium text-gray-600 mb-4">
                                <li><strong>Sign in with Google:</strong> learners and users can sign in with their Google account. We receive
                                    your name, email address and profile picture, and use them only to create and identify your account.</li>
                                <li><strong>Google Calendar for meeting bookings:</strong> a member of a business using SkillDeck can connect their
                                    Google Calendar so that visitors can book meetings with them. We use this access to (a) read the times when
                                    the member is busy, so we only offer free times to visitors (we see start and end times only, not the titles,
                                    descriptions or guests of other events), and (b) create, update or cancel the calendar event, with a Google
                                    Meet link, for each meeting booked through SkillDeck. We do not read, change or delete any other events.</li>
                            </ul>
                            <p className="body-medium text-gray-600 mb-4"><strong>How we store it:</strong> Google access and refresh tokens
                                are encrypted (AES-256-GCM) and kept in the business&apos;s own database. For each booked meeting we store the
                                booking details, the Google event ID and the Meet link. Busy times are fetched when visitors look for a time
                                and are not stored.
                            </p>
                            <p className="body-medium text-gray-600 mb-4"><strong>Sharing and limits:</strong> we do not sell Google user
                                data, use it for advertising, or let people read it except where needed to provide the feature, for security,
                                or to comply with law. We do not use Google user data to develop, improve or train generalised artificial
                                intelligence or machine learning models.
                            </p>
                            <p className="body-medium text-gray-600 mb-4"><strong>How to remove access and delete data:</strong> disconnect
                                Google Calendar in SkillDeck, or remove SkillDeck at{' '}
                                <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-brand-primary font-semibold hover:underline">myaccount.google.com/permissions</a>.
                                We then delete the stored tokens and stop all access. To delete other data, email{' '}
                                <a href="mailto:hello@skilldeck.net" className="text-brand-primary font-semibold hover:underline">hello@skilldeck.net</a>;
                                we act within 30 days.
                            </p>
                            <p className="body-medium text-gray-600">
                                SkillDeck&apos;s use and transfer to any other app of information received from Google APIs will adhere to the{' '}
                                <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-brand-primary font-semibold hover:underline">Google API Services User Data Policy</a>,
                                including the Limited Use requirements.
                            </p>
                        </div>

                        <div>
                            <h2 className="heading-section2 mb-4">11. Contact Us</h2>
                            <p className="body-medium text-gray-600">
                                For questions about this Privacy Policy or to exercise your rights, email{" "}
                                <a href="mailto:hello@skilldeck.net" className="text-brand-primary font-semibold hover:underline">hello@skilldeck.net</a>.
                                See also our <a href="/grievance-redressal" className="text-brand-primary font-semibold hover:underline">Grievance Redressal</a> page.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
