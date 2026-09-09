"use client";

import { Grid, List } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import PlansComparison from './elements/PlansComparison';
import PlansComparisonTable from './elements/PlansComparisonTable';
import MarketPlaceCta from '@/components/Home/elements/MarketPlaceCta';
import { useIpLocation } from '@/hooks/useIpLocation';
import { PricingPlan } from '@/lib/plans';
import { BillingInterval } from './elements/utils';
import LifetimeModal from './elements/LifetimeModal';

interface Props {
    onToggleNavbar?: (hidden: boolean) => void;
    plans: PricingPlan[];
    showHeading?: boolean;
}

export default function PricingSection({ onToggleNavbar, plans: initialPlans, showHeading = true }: Props) {
    const [loading, setLoading] = useState(true);
    const [billingInterval, setBillingInterval] = useState<BillingInterval>('MONTHLY');
    const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
    const [plans, setPlans] = useState<PricingPlan[]>(initialPlans);
    const [isLifetimeModalOpen, setIsLifetimeModalOpen] = useState(false);
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const { data: locationData, loading: ipLoading } = useIpLocation();



    // Client-side pricing localization
    useEffect(() => {
        const localizePlans = async () => {
            if (ipLoading) return;

            try {
                const detectedCurrency = locationData?.currency;

                if (detectedCurrency && detectedCurrency !== initialPlans[0]?.currency) {
                    const plansRes = await fetch(`/api/plans?currency=${detectedCurrency}`);
                    if (plansRes.ok) {
                        const localizedPlans = await plansRes.json();
                        setPlans(localizedPlans);
                    }
                } else if (detectedCurrency === initialPlans[0]?.currency) {
                    setPlans(initialPlans);
                }
            } catch (error) {
                console.error("Error localizing plans in PricingSection:", error);
            } finally {
                setLoading(false);
            }
        };

        localizePlans();
    }, [locationData, ipLoading, initialPlans]);

    // Calculate max savings percentage across all plans
    const maxSavingsPercentage = useMemo(() => {
        if (!plans?.length) return 0;
        const percentages = plans.map(plan => {
            const monthly = plan.discountedPrice ?? plan.price ?? 0;
            const yearly = plan.yearlyDiscountedPrice ?? plan.yearlyPrice ?? (monthly * 12);
            if (monthly === 0) return 0;
            const totalMonthly = monthly * 12;
            const diff = totalMonthly - yearly;
            return diff > 0 ? Math.round((diff / totalMonthly) * 100) : 0;
        });
        return percentages.length > 0 ? Math.max(...percentages, 0) : 0;
    }, [plans]);

    // Navbar Hiding Logic for Table View
    useEffect(() => {
        if (viewMode !== 'table' || !onToggleNavbar) {
            onToggleNavbar?.(false);
            return;
        }

        const handleScroll = () => {
            if (tableContainerRef.current) {
                const rect = tableContainerRef.current.getBoundingClientRect();
                const shouldHide = rect.top <= 100 && rect.bottom > 100;
                onToggleNavbar(shouldHide);
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            onToggleNavbar(false); // Reset on unmount/change
        };
    }, [viewMode, onToggleNavbar]);


    const handlePurchase = (planId: string) => {
        // Find the plan to get its details if needed
        const plan = plans.find(p => p.id === planId);


        // Redirect to registration page with selection
        // window.location.href = `/register?plan=${planId}&interval=${billingInterval}`;
        window.location.href = `/register`;

    };

    return (
        <section className="section-y bg-white" id="plans">
            <div className="container mx-auto px-2 lg:px-0">
                {showHeading && (
                    <>
                        <div className="text-center max-w-3xl mx-auto mb-8 2xl:mb-12">
                            <h2 className="text-xl md:text-3xl 2xl:text-4xl font-bold text-gray-900 mb-3">
                                Flexible Pricing for{" "}
                                <span className="bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] bg-clip-text text-transparent">
                                    Every Business
                                </span>
                            </h2>
                            <p className="text-sm 2xl:text-base text-gray-500 max-w-2xl mx-auto">
                                Skilldeck is made affordable for everyone. No matter the size or stage of your business, Skilldeck fits.
                            </p>
                        </div>
                    </>
                )}

                {/* Controls Row - Centered Billing, Right View Mode */}
                <div className="relative flex flex-col md:flex-row justify-center items-center mb-6 2xl:mb-10 gap-3 md:gap-6">
                    {/* Billing Interval Toggle */}
                    <div className="bg-gray-100 p-1.5 rounded-full inline-flex items-center relative flex-wrap sm:flex-nowrap justify-center gap-1">
                        <button
                            onClick={() => setBillingInterval('MONTHLY')}
                            className={`
                                relative z-10 px-6 sm:px-8 py-2.5 2xl:px-10 text-sm font-semibold rounded-full transition-all duration-300 cursor-pointer
                                ${billingInterval === 'MONTHLY'
                                    ? 'bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] text-white shadow-md'
                                    : 'text-gray-500 hover:text-gray-900'
                                }
                            `}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingInterval('YEARLY')}
                            className={`
                                relative z-10 px-6 sm:px-8 py-2.5 2xl:px-10 text-sm font-semibold rounded-full transition-all duration-300 flex items-center gap-1.5 sm:gap-2 cursor-pointer
                                ${billingInterval === 'YEARLY'
                                    ? 'bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] text-white shadow-md'
                                    : 'text-gray-500 hover:text-gray-900'
                                }
                            `}
                        >
                            <span>Annual</span>
                            {maxSavingsPercentage > 0 && (
                                <span className={`
                                    text-[10px] 2xl:text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide
                                    ${billingInterval === 'YEARLY'
                                        ? 'bg-white/25 text-white'
                                        : 'bg-green-50 text-green-600'
                                    }
                                `}>
                                    Save ~{maxSavingsPercentage}%
                                </span>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsLifetimeModalOpen(true)}
                            className="relative z-10 px-5 sm:px-7 py-2.5 2xl:px-9 text-sm font-semibold rounded-full transition-all duration-300 flex items-center gap-1.5 text-slate-700 hover:text-purple-600 cursor-pointer group"
                        >
                            <span>Lifetime</span>
                            <span className="text-[9px] 2xl:text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider bg-purple-100 text-purple-700 group-hover:bg-purple-200 transition-colors">
                                ⚡ Deal
                            </span>
                        </button>
                    </div>

                    {/* View Mode Toggle - Absolute Right on Desktop */}
                    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 md:absolute md:right-0">
                        <button
                            onClick={() => setViewMode('cards')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'cards'
                                ? 'bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] text-white'
                                : 'text-gray-500 hover:text-gray-700'}`}
                            title="Cards View"
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'table'
                                ? 'bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] text-white'
                                : 'text-gray-500 hover:text-gray-700'}`}
                            title="Table View"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {viewMode === 'cards' ? (
                    <PlansComparison
                        loading={loading}
                        plans={plans}
                        billingInterval={billingInterval}
                        onOpenPurchase={handlePurchase}
                    />
                ) : (
                    <div ref={tableContainerRef}>
                        <PlansComparisonTable
                            loading={loading}
                            plans={plans}
                            billingInterval={billingInterval}
                            onOpenPurchase={handlePurchase}
                        />
                    </div>
                )}
            </div>

            {/* Lifetime Access Deal Modal */}
            <LifetimeModal
                isOpen={isLifetimeModalOpen}
                onClose={() => setIsLifetimeModalOpen(false)}
            />
        </section>
    );
}
