"use client";

import { ArrowUpRight, Check, Globe, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDemoBooking } from "@/components/Booking/useDemoBooking";

const formats = [
    { icon: Phone, title: "Virtual Walkthrough", description: "30-minute interactive session with our experts." },
    { icon: Globe, title: "On-Premise Presentation", description: "Available for established training institutes." },
];

const whatYouGet = [
    "One-time session password (24-hour access)",
    "Full platform walkthrough",
    "Personalized use case discussion",
    "Pricing and implementation guidance",
    "Q&A with product experts",
];

export default function HdCta() {
    const bookDemo = useDemoBooking();

    return (
        <section className="section-y bg-white">
            <div className="container mx-auto px-4 lg:px-0">
                <div className="relative overflow-hidden rounded-[32px] bg-[#05060f] px-6 py-14 md:px-16 md:py-20">
                    <div aria-hidden="true" className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-brand-primary/25 blur-[110px]" />
                    <div aria-hidden="true" className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-brand-secondary/20 blur-[110px]" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-7">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 mb-6">
                                <Sparkles className="w-3.5 h-3.5 text-brand-secondary" />
                                Book a Demo
                            </span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight mb-4">
                                Experience the power of Skilldeck yourself
                            </h2>
                            <p className="text-slate-400 leading-relaxed max-w-lg mb-8">
                                Get a personalized walkthrough of the platform and see how we can transform your
                                training business.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 mb-8">
                                {formats.map((f) => (
                                    <div key={f.title} className="flex items-start gap-3">
                                        <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                            <f.icon className="w-4 h-4 text-brand-secondary" />
                                        </span>
                                        <div>
                                            <h3 className="text-sm font-bold text-white">{f.title}</h3>
                                            <p className="text-xs text-slate-400">{f.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button
                                onClick={bookDemo}
                                variant="primary"
                                size="lg"
                                className="rounded-full font-bold"
                            >
                                Book My Free Demo
                                <ArrowUpRight className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="lg:col-span-5">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6">
                                <h3 className="text-base font-bold text-white mb-4">What You&apos;ll Get</h3>
                                <ul className="space-y-3">
                                    {whatYouGet.map((item) => (
                                        <li key={item} className="flex items-start gap-2.5">
                                            <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)]">
                                                <Check className="w-3 h-3 text-white" strokeWidth={3} aria-hidden="true" />
                                            </span>
                                            <span className="text-sm text-slate-300">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
