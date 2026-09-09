import React, { useMemo } from 'react';
// import { IPlan } from './types';
import { BillingInterval } from './utils';
import PlansComparisonTableMobile from './PlansComparisonTableMobile';
import PlansComparisonTableDesktop from './PlansComparisonTableDesktop';
import { PricingPlan } from '@/lib/plans';

type Props = {
    plans: PricingPlan[];
    loading?: boolean;
    billingInterval?: BillingInterval;
    onOpenPurchase?: (planId: string) => void;
};

const PlansComparisonTable: React.FC<Props> = ({
    plans,
    loading,
    billingInterval = 'MONTHLY',
    onOpenPurchase,
}) => {
    // Filter out lifetime plan so tables show standard plans (Starter, Growth, Business)
    const filteredPlans = useMemo(() => {
        return (plans || [])
            .filter(plan =>
                plan.id !== 'lifetime-plan' &&
                plan.code !== 'LIFETIME' &&
                !plan.name?.toLowerCase().includes('lifetime')
            )
            .map((plan, index) => {
                const planName = (plan.name || '').toLowerCase();
                const isGrowth = planName.includes('growth') || index === 1;
                const isBusiness = planName.includes('business') || planName.includes('enterprise') || index === 2;

                const displayFeatures = [...(plan.displayFeatures || [])];
                const marketingPerks: string[] = [];
                if (isGrowth) {
                    marketingPerks.push('Free SEO For Courses');
                } else if (isBusiness) {
                    marketingPerks.push('Free SEO For Courses');
                    marketingPerks.push('Free Google Ads Up to 1 Lakh Budget');
                }

                const existingMarketingIndex = displayFeatures.findIndex(
                    (g: any) => g.category?.toLowerCase().includes('marketing') || g.category?.toLowerCase().includes('growth')
                );

                if (existingMarketingIndex >= 0) {
                    const existing = displayFeatures[existingMarketingIndex];
                    const mergedItems = Array.from(new Set([...(existing.items || []), ...marketingPerks]));
                    displayFeatures[existingMarketingIndex] = {
                        ...existing,
                        items: mergedItems
                    };
                } else if (marketingPerks.length > 0) {
                    displayFeatures.push({
                        category: 'Marketing & Growth',
                        items: marketingPerks
                    });
                }

                return {
                    ...plan,
                    displayFeatures
                };
            });
    }, [plans]);

    if (!filteredPlans || filteredPlans.length === 0) {
        return (
            <div className="py-12 px-6 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-500 text-base">
                No plans available.
            </div>
        );
    }

    return (
        <div className="w-full mx-auto max-w-[1536px]">
            <PlansComparisonTableMobile
                plans={filteredPlans}
                billingInterval={billingInterval}
                onOpenPurchase={onOpenPurchase}
                loading={loading}
            />
            <PlansComparisonTableDesktop
                plans={filteredPlans}
                billingInterval={billingInterval}
                onOpenPurchase={onOpenPurchase}
                loading={loading}
            />
        </div>
    );
};

export default PlansComparisonTable;