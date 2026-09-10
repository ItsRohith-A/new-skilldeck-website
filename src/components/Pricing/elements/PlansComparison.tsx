import React, { useMemo } from 'react';
import PricingCard from './PricingCard';
import { BillingInterval, groupDisplayFeatures, groupFeatures } from './utils';
import { PricingPlan } from '@/lib/plans';

type Props = {
    plans: PricingPlan[];
    loading?: boolean;
    billingInterval?: BillingInterval;
    onOpenPurchase?: (planId: string) => void;
};

const PlansComparison: React.FC<Props> = ({
    plans,
    loading,
    billingInterval = 'MONTHLY',
    onOpenPurchase,
}) => {
    // Filter out lifetime plan so cards view shows standard 3-column plans (Starter, Growth, Business)
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

    const groups = useMemo(() => groupFeatures(filteredPlans || []), [filteredPlans]);
    const displayGroups = useMemo(() => groupDisplayFeatures(filteredPlans || []), [filteredPlans]);

    if (!filteredPlans || filteredPlans.length === 0) {
        return (
            <div className="py-12 px-6 text-center bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-base">
                No plans available.
            </div>
        );
    }

    return (
        <div className="flex flex-wrap justify-center gap-6 lg:pt-5 items-stretch max-w-[1280px] mx-auto">
            {filteredPlans.map((plan: any, index: number) => (
                <div
                    key={plan.id || plan._id || `plan-${index}`}
                    className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-[390px] flex flex-col"
                >
                    <PricingCard
                        plan={plan}
                        groups={groups}
                        displayGroups={displayGroups}
                        billingInterval={billingInterval}
                        onPurchase={onOpenPurchase}
                        loading={loading}
                    />
                </div>
            ))}
        </div>
    );
};

export default PlansComparison;
