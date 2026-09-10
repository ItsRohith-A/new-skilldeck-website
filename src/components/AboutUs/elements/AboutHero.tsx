import { Play, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

export default function AboutHero() {
    return (
        <section className="pt-20 lg:pt-30 pb-12 lg:pb-24 px-4 lg:px-0 container mx-auto text-center relative overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl animate-pulse" />

            <div className="max-w-7xl mx-auto text-center relative z-10">
                <div className="badge-brand mb-6">
                    <Sparkles className="w-4 h-4 mr-2" />
                    About Skilldeck
                </div>
                <h1 className="heading-hero mb-6">
                    The Ultimate Platform for
                    <span className="block mt-2 pb-1 md:pb-3 bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] bg-clip-text text-transparent">
                        Training Institutes
                    </span>
                </h1>
                <p className="body-large max-w-3xl mx-auto mb-8">
                    Built exclusively for training institutes and trainers to help automate monotonous tasks
                    implemented in various stages by different teams in the organization.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        href="/register"
                        className="inline-flex items-center justify-center bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] text-white px-8 py-3 lg:py-4 rounded-lg text-base font-semibold transition hover:opacity-95 shadow-md shadow-brand-primary/25"
                    >
                        <Zap className="w-5 h-5 mr-2" />
                        Explore Features
                    </Link>
                    <Link
                        href="/#demo"
                        className="inline-flex items-center justify-center border border-gray-300 hover:bg-gray-50 text-brand-dark px-8 py-3 lg:py-4 rounded-lg text-base font-semibold transition"
                    >
                        <Play className="w-5 h-5 mr-2" />
                        Watch Demo
                    </Link>
                </div>
            </div>
        </section>
    );
}
