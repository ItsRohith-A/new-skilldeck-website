"use client";

import { GraduationCap, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import MarketPlaceCta from "./MarketPlaceCta";

// Bidding Visual Component without framer-motion dependency
const MarketplaceBiddingVisual = () => {
    const [items, setItems] = useState([
        { id: 1, title: "Data Science Bootcamp", institute: "Tech Academy", bid: "$24.50" },
        { id: 2, title: "Python Mastery 2024", institute: "Code Masters", bid: "$18.00" },
        { id: 3, title: "AI & Machine Learning", institute: "Future Edu", bid: "$12.00" },
    ]);

    useEffect(() => {
        const timer = setInterval(() => {
            setItems(currentItems => {
                const newItems = [...currentItems];
                const movedItem = { ...newItems.pop()! };

                const highestBid = Math.max(...newItems.map(item => parseFloat(item.bid.replace("$", ""))));
                movedItem.bid = `$${(highestBid + 2.50).toFixed(2)}`;

                newItems.unshift(movedItem);
                return newItems;
            });
        }, 2000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full space-y-3 py-2">
            <div className="flex flex-col gap-3 relative">
                {items.map((item, index) => {
                    const isTop = index === 0;
                    return (
                        <div
                            key={item.id}
                            style={{ transition: "all 0.5s ease-in-out" }}
                            className={`bg-white border rounded-xl py-6 px-4 flex items-center justify-between shadow-sm relative overflow-hidden transition-all duration-500 ${isTop
                                ? "border-brand-primary/30 ring-2 ring-brand-primary/5 shadow-brand-primary/10 scale-100 opacity-100"
                                : index === 1
                                    ? "border-slate-100 scale-98 opacity-80"
                                    : "border-slate-100 scale-95 opacity-50"
                                }`}
                        >
                            {isTop && (
                                <div className="absolute top-0 right-0 px-3 py-1 bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] text-white text-[10px] font-bold rounded-bl-xl uppercase tracking-wider z-10">
                                    Top Bidder
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <div className={`h-10 md:h-12 w-10 md:w-12 rounded-lg flex items-center justify-center ${isTop ? "bg-brand-primary/10" : "bg-slate-50"}`}>
                                    <GraduationCap className={`h-4 md:h-6 w-4 md:w-6 ${isTop ? "text-brand-primary" : "text-brand-muted"}`} />
                                </div>
                                <div>
                                    <div className="body-medium font-bold text-brand-dark">{item.title}</div>
                                    <div className="body-extrasmall">{item.institute}</div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className={`text-[10px] md:body-extrasmall font-bold uppercase tracking-tight ${isTop ? "text-brand-primary" : "text-brand-muted"}`}>Current Bid</div>
                                <div className={`font-mono font-bold body-medium transition-colors duration-300 ${isTop ? "text-brand-primary" : "text-brand-muted"}`}>
                                    {item.bid}
                                </div>
                            </div>

                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${isTop ? "bg-brand-primary" : "bg-transparent"}`} />
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center justify-center gap-4 pt-4 mt-2 border-t border-slate-50">
                <div className="flex items-center gap-2">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse" />
                    <span className="body-extrasmall font-bold uppercase tracking-widest">Get Your Business Listed</span>
                </div>
            </div>
        </div>
    );
};

const MarketplacePromotion = () => {
    return (
        <section className=" bg-white" id="platform">
            <div className="container mx-auto px-4 lg:px-0">
                {/* Free Marketplace Signup CTA Banner */}
                <MarketPlaceCta />
                <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-4">
                        <div className="badge-brand gap-2 border border-blue-100 shadow-sm">
                            <span className="flex h-2 w-2 rounded-full bg-brand-primary animate-pulse" />
                            Marketplace Now Live
                        </div>

                        <h2 className="heading-section">
                            Reach More Learners with <br />
                            <span className="bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] bg-clip-text text-transparent">
                                Skilldeck Marketplace
                            </span>
                        </h2>

                        <p className="body-small">
                            Join our thriving ecosystem where training providers compete and learners discover.
                            Prominently list your course schedules and leverage our smart bidding engine to
                            reach the top of the search results.
                        </p>

                        <div className="grid grid-cols-2 gap-2 md:gap-4 pt-2">
                            <div className="flex items-center gap-2 md:gap-3 text-brand-muted">
                                <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                                    <TrendingUp className="w-5 h-5 text-brand-primary" />
                                </div>
                                <span className="body-extrasmall font-semibold text-brand-dark">Bid for Top Placement</span>
                            </div>
                            <div className="flex items-center gap-2 md:gap-3 text-brand-muted">
                                <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                                    <Target className="w-5 h-5 text-brand-secondary" />
                                </div>
                                <span className="body-extrasmall font-semibold text-brand-dark">Direct CRM Lead Sync</span>
                            </div>
                        </div>

                        <div className="flex justify-start md:justify-center lg:justify-start items-start gap-4 pt-0 lg:pt-4">
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center px-4 md:px-8 py-2 body-small font-semibold text-brand-muted transition-all duration-200 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 shadow-sm"
                            >
                                Register as Provider
                            </Link>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative bg-white/80 backdrop-blur-xl border border-slate-200 rounded-xl p-4 md:p-6 shadow-2xl overflow-hidden min-h-[400px] flex flex-col items-center justify-between">
                            <MarketplaceBiddingVisual />
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default MarketplacePromotion;
