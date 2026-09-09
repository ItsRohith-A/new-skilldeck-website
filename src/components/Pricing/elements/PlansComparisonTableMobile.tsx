import React, { useState, useMemo } from 'react';
import { groupFeatures, formatPrice, BillingInterval, computePlanAmount, getPlanFeatureValue, formatOveragePrice, groupDisplayFeatures, displayFeatureStatus, isSpecialPerk } from './utils';
import { IPlanLimits } from './types';
import { RenderValue } from './TableCommon';
import { IPlan } from '@/types/interface-lib';
import { Sparkles, Check, X } from 'lucide-react';

type Props = {
    plans: IPlan[];
    billingInterval?: BillingInterval;
    onOpenPurchase?: (planId: string) => void;
    loading?: boolean;
};

const PlansComparisonTableMobile: React.FC<Props> = ({
    plans,
    billingInterval = 'MONTHLY',
    onOpenPurchase,
    loading,
}) => {
    const displayGroups = useMemo(() => groupDisplayFeatures(plans || []), [plans]);

    // Safely initialize with available indices
    const initialIndexes = [];
    if (plans && plans.length > 0) initialIndexes.push(0);
    if (plans && plans.length > 1) initialIndexes.push(1);

    const [activePlanIndexes, setActivePlanIndexes] = useState<number[]>(initialIndexes);

    const togglePlan = (index: number) => {
        if (activePlanIndexes.includes(index)) {
            if (activePlanIndexes.length > 1) {
                setActivePlanIndexes(activePlanIndexes.filter(i => i !== index));
            }
        } else {
            if (activePlanIndexes.length < 2) {
                setActivePlanIndexes([...activePlanIndexes, index]);
            } else {
                setActivePlanIndexes([activePlanIndexes[1], index]);
            }
        }
    };

    const activePlans = activePlanIndexes.map(idx => plans[idx]);

    return (
        <div className="xl:hidden">
            <div className="mb-4">
                <div className="text-xs font-semibold text-gray-600 mb-2 md:pl-2 uppercase tracking-wider">
                    Compare Plans (Select up to 2)
                </div>
                <div className="flex flex-wrap gap-2 ">
                    {plans.map((plan, index) => (
                        <button
                            key={plan.id}
                            onClick={() => togglePlan(index)}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activePlanIndexes.includes(index)
                                ? 'bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {plan.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="">
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50 sticky top-12 z-20 shadow-sm">
                            <tr>
                                <th scope="col" className="w-1/3 px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-r border-gray-200 align-center pb-4">
                                    Features
                                </th>
                                {activePlans.map(plan => {
                                    const price = computePlanAmount(plan, billingInterval) || 0;

                                    return (
                                        <th key={plan.id} scope="col" className="w-1/3 px-3 py-3 text-center bg-white relative align-top pb-10">
                                            <div className="text-xs font-bold text-indigo-600 mb-1">{plan.name}</div>
                                            {loading ? (
                                                <div className="animate-pulse bg-slate-200 rounded h-5 w-16 mx-auto mb-2" />
                                            ) : (
                                                <>
                                                    <div className="text-sm md:text-base font-bold text-gray-900 mb-0.5">
                                                        {formatPrice(price, plan.currency || 'USD')}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mb-2">
                                                        /{billingInterval === 'YEARLY' ? 'yr' : 'mo'}
                                                    </div>
                                                </>
                                            )}
                                            <button
                                                onClick={() => onOpenPurchase?.(plan.id)}
                                                className="absolute bottom-2 left-2 right-2 py-1.5 rounded-md text-xs font-bold bg-[#5c3ffa] hover:bg-[#4e32e8] text-white transition-colors hover:-translate-y-[1px]"
                                            >
                                                Get Started
                                            </button>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <React.Fragment key="platform-limits-section-mobile">
                                <tr className="bg-gray-50 sticky top-[118px] z-10 ">
                                    <td colSpan={3} className="px-3 py-2 text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-50 flex items-center gap-2">
                                        Platform Resources
                                    </td>
                                </tr>
                                {[
                                    { key: 'seats', label: 'Seats', unit: 'seat', priceKey: 'seatUnitPrice', yearlyPriceKey: 'yearlySeatUnitPrice' },
                                    { key: 'storageGB', label: 'Storage', unit: 'GB', priceKey: 'storageUnitPrice', yearlyPriceKey: 'yearlyStorageUnitPrice' },
                                    { key: 'locations', label: 'Locations', unit: 'location', priceKey: 'locationUnitPrice', yearlyPriceKey: 'yearlyLocationUnitPrice' },
                                    { key: 'courses', label: 'CMS/Website Courses', unit: 'course', priceKey: 'courseUnitPrice', yearlyPriceKey: 'yearlyCourseUnitPrice' }
                                ].map((limit, idx) => (
                                    <tr key={limit.key} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-3 py-3 text-xs font-semibold text-gray-700 border-r border-gray-200">
                                            {limit.label}
                                        </td>
                                        {activePlans.map((plan, planIdx) => {
                                            const limitValue = (plan.limits as unknown as IPlanLimits)?.[limit.key as keyof IPlanLimits];
                                            const isUnlimited = limitValue === undefined || limitValue === null || Number(limitValue) === -1;
                                            const uniqueKey = `${plan.id || plan._id || planIdx}-${limit.key}`;

                                            let overageText = '';
                                            if (!isUnlimited) {
                                                overageText = formatOveragePrice(plan, limit, billingInterval);
                                            }

                                            return (
                                                <td key={uniqueKey} className="px-3 py-3 text-center text-xs">
                                                    <div className="font-bold text-gray-900">
                                                        {isUnlimited ? 'Unlimited' : (limit.key === 'storageGB' ? `${limitValue} GB` : limitValue)}
                                                    </div>
                                                    {overageText && (
                                                        <div className="text-[10px] text-gray-500 mt-0.5">
                                                            {overageText}
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </React.Fragment>

                            {/* LMS Resources */}
                            {['lmsCourses', 'students', 'instructors', 'certificates'].some(key =>
                                activePlans.some(plan => {
                                    const val = (plan.limits as any)?.[key];
                                    return plan.isLmsEnabled !== false && (val === null || val === -1 || Number(val || 0) > 0);
                                })
                            ) && (
                                    <React.Fragment key="lms-limits-section-mobile">
                                        <tr className="bg-indigo-50/20 sticky top-[118px] z-10 ">
                                            <td colSpan={3} className="px-3 py-2 text-xs font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50/40 flex items-center gap-2">
                                                LMS / Training Resources
                                            </td>
                                        </tr>
                                        {[
                                            { key: 'lmsCourses', label: 'LMS Courses', unit: 'course', priceKey: 'lmsCourseUnitPrice', yearlyPriceKey: 'yearlyLmsCourseUnitPrice' },
                                            { key: 'students', label: 'Active Students', unit: 'student', priceKey: 'studentUnitPrice', yearlyPriceKey: 'yearlyStudentUnitPrice' },
                                            { key: 'instructors', label: 'Instructors', unit: 'instructor', priceKey: 'instructorUnitPrice', yearlyPriceKey: 'yearlyInstructorUnitPrice' },
                                            { key: 'certificates', label: 'Certificates', unit: 'certificate', priceKey: 'certificateUnitPrice', yearlyPriceKey: 'yearlyCertificateUnitPrice' }
                                        ].filter(limit => activePlans.some(plan => {
                                            const val = (plan.limits as any)?.[limit.key];
                                            return plan.isLmsEnabled !== false && (val === null || val === -1 || Number(val || 0) > 0);
                                        })).map((limit, idx) => (
                                            <tr key={limit.key} className={idx % 2 === 0 ? 'bg-white' : 'bg-indigo-50/10'}>
                                                <td className="px-3 py-3 text-xs font-semibold text-gray-700 border-r border-gray-200">
                                                    {limit.label}
                                                </td>
                                                {activePlans.map((plan, planIdx) => {
                                                    const limitValue = plan.isLmsEnabled !== false ? (plan.limits as unknown as IPlanLimits)?.[limit.key as keyof IPlanLimits] : undefined;
                                                    const uniqueKey = `${plan.id || plan._id || planIdx}-${limit.key}`;

                                                    if (limitValue === undefined) {
                                                        return <td key={uniqueKey} className="px-3 py-3 text-center text-xs font-bold text-gray-400 dark:text-gray-500">Not Included</td>;
                                                    }

                                                    const isUnlimited = limitValue === null || Number(limitValue) === -1;

                                                    let overageText = '';
                                                    if (!isUnlimited) {
                                                        overageText = formatOveragePrice(plan, limit, billingInterval);
                                                    }

                                                    return (
                                                        <td key={uniqueKey} className="px-3 py-3 text-center text-xs">
                                                            <div className="font-bold text-gray-900">
                                                                {isUnlimited ? 'Unlimited' : limitValue}
                                                            </div>
                                                            {overageText && (
                                                                <div className="text-[10px] text-gray-500 mt-0.5">
                                                                    {overageText}
                                                                </div>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                )}

                            {Object.entries(displayGroups)
                                .map(([category, items]) => {
                                    const isMarketing = category.toLowerCase().includes('marketing') || category.toLowerCase().includes('growth');
                                    return (
                                        <React.Fragment key={category}>
                                            <tr className={`sticky top-[118px] z-10 shadow-sm ${isMarketing
                                                ? 'bg-gradient-to-r from-indigo-50/90 via-purple-50/80 to-pink-50/70 border-y border-indigo-100'
                                                : 'bg-gray-50'
                                                }`}>
                                                <td colSpan={3} className={`px-3 py-2 text-xs font-bold uppercase tracking-wider ${isMarketing ? 'text-indigo-950 flex items-center gap-1.5' : 'text-gray-700 bg-gray-50'
                                                    }`}>
                                                    {isMarketing && <Sparkles className="w-3.5 h-3.5 text-[#5c3ffa]" />}
                                                    <span>{category}</span>
                                                    {isMarketing && (
                                                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#5c3ffa] to-[#cb3b95] text-white normal-case">
                                                            Special
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                            {items.map((item, idx) => {
                                                const isPerk = isSpecialPerk(item);
                                                const isGoogleAds = item.toLowerCase().includes('google ads');

                                                return (
                                                    <tr key={item} className={
                                                        isPerk
                                                            ? 'bg-indigo-50/20'
                                                            : (idx % 2 === 0 ? 'bg-white' : 'bg-gray-50')
                                                    }>
                                                        <td className="px-3 py-3 text-xs font-medium text-gray-700 border-r border-gray-200">
                                                            {isPerk ? (
                                                                <div className="flex flex-col gap-1">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <Sparkles className={`w-3.5 h-3.5 shrink-0 ${isGoogleAds ? 'text-amber-500' : 'text-[#5c3ffa]'}`} />
                                                                        <span className="font-bold text-gray-900 leading-tight">{item}</span>
                                                                    </div>
                                                                    <span className={`w-fit text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full shadow-xs ${isGoogleAds ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                                                                        }`}>
                                                                        {isGoogleAds ? '₹1 Lakh Ads' : 'Free Included'}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                item
                                                            )}
                                                        </td>
                                                        {activePlans.map((plan, planIdx) => {
                                                            const status = displayFeatureStatus(plan, category, item);
                                                            const uniqueKey = (plan.id || plan._id || planIdx) + '-' + item;

                                                            if (isPerk) {
                                                                if (status === 'enabled') {
                                                                    return (
                                                                        <td key={uniqueKey} className="px-2 py-3 text-center">
                                                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold shadow-xs ${isGoogleAds
                                                                                ? 'bg-amber-50 text-amber-950 border border-amber-300'
                                                                                : 'bg-indigo-50 text-indigo-900 border border-indigo-200'
                                                                                }`}>
                                                                                <Check className={`w-3 h-3 ${isGoogleAds ? 'text-amber-600' : 'text-indigo-600'} stroke-[3]`} />
                                                                                <span>{isGoogleAds ? '₹1L Free' : 'Included'}</span>
                                                                            </span>
                                                                        </td>
                                                                    );
                                                                }
                                                                return (
                                                                    <td key={uniqueKey} className="px-2 py-3 text-center">
                                                                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                                                                            <X className="w-3 h-3 text-gray-400" />
                                                                        </div>
                                                                    </td>
                                                                );
                                                            }

                                                            return (
                                                                <td key={uniqueKey} className="px-3 py-3 text-center">
                                                                    <RenderValue value={status} />
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                );
                                            })}
                                        </React.Fragment>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PlansComparisonTableMobile;
