import Link from 'next/link';
import { MessageCircle, Mail, Phone } from 'lucide-react';
import { DEMO_BOOKING_PATH } from "@/lib/booking";

export default function FaqCta() {
    return (
        <section className="px-4 lg:px-0 pb-20">
            <div className="container mx-auto">
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />

                    <div className="relative z-10">
                        <MessageCircle className="w-12 h-12 text-white/80 mx-auto mb-4" />
                        <h2 className="heading-section text-white mb-4">Still have questions?</h2>
                        <p className="body-large text-slate-300 mb-8 max-w-md mx-auto">
                            Our support team is here to help you with anything you need.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/contact-us"
                                rel="nofollow"
                                className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold hover:bg-slate-100 transition-colors"
                            >
                                <Mail className="w-5 h-5" />
                                Contact Us
                            </Link>
                            <a
                                href={DEMO_BOOKING_PATH}
                                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors"
                            >
                                <Phone className="w-5 h-5" />
                                Schedule a Call
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
