import React, { useMemo } from 'react';
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

const PlansComparisonTableDesktop: React.FC<Props> = ({
    plans,
    billingInterval = 'MONTHLY',
    onOpenPurchase,
    loading,
}) => {
    const displayGroups = useMemo(() => groupDisplayFeatures(plans || []), [plans]);

    return (
        <div className="hidden xl:block rounded-xl border border-gray-200 bg-white shadow-sm overflow-x-auto xl:overflow-visible">
            <table className="w-full border-collapse relative">
                <thead className="sticky top-16 z-20 bg-white shadow-sm">
                    <tr>
                        <th scope="col" className="p-4 text-left bg-gray-50 border-b border-gray-200 min-w-[200px] align-middle pb-5">
                            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Features</span>
                        </th>
                        {plans.map(plan => {
                            const price = computePlanAmount(plan, billingInterval) || 0;
                            return (
                                <th key={plan.id} scope="col" className="p-4 text-center border-b border-gray-200 min-w-[200px] relative align-top bg-white pb-10">
                                    <h3 className="text-sm font-bold text-indigo-600 mb-1">{plan.name}</h3>
                                    <div className="mb-4">
                                        <div className="flex items-center justify-center gap-1">
                                            {loading ? (
                                                <div className="animate-pulse bg-slate-200 rounded h-6 w-20" />
                                            ) : (
                                                <>
                                                    <span className="text-lg font-bold text-gray-900">
                                                        {formatPrice(price, plan.currency || 'USD')}
                                                    </span>
                                                    <span className="text-sm text-gray-500">/{billingInterval === 'YEARLY' ? 'yr' : 'mo'}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {/* Action Button */}
                                    <button
                                        onClick={() => onOpenPurchase?.(plan.id)}
                                        className="absolute bottom-4 left-4 right-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 bg-[#5c3ffa] hover:bg-[#4e32e8] text-white shadow-sm hover:shadow-md hover:-translate-y-[1px] cursor-pointer"
                                    >
                                        Start Free Trial
                                    </button>
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    <React.Fragment key="platform-limits-section">
                        <tr className="bg-gray-50 sticky top-[120px] z-10 ">
                            <td colSpan={plans.length + 1} className="px-4 py-2 text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-50 flex items-center gap-2">
                                Platform Resources
                            </td>
                        </tr>
                        {[
                            { key: 'seats', label: 'Seats', unit: 'seat', priceKey: 'seatUnitPrice', yearlyPriceKey: 'yearlySeatUnitPrice' },
                            { key: 'storageGB', label: 'Storage', unit: 'GB', priceKey: 'storageUnitPrice', yearlyPriceKey: 'yearlyStorageUnitPrice' },
                            { key: 'locations', label: 'Locations', unit: 'location', priceKey: 'locationUnitPrice', yearlyPriceKey: 'yearlyLocationUnitPrice' },
                            { key: 'courses', label: 'CMS/Website Courses', unit: 'course', priceKey: 'courseUnitPrice', yearlyPriceKey: 'yearlyCourseUnitPrice' }
                        ].map((limit) => (
                            <tr key={limit.key} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 text-sm font-medium text-gray-700">{limit.label}</td>
                                {plans.map(plan => {
                                    const limitValue = (plan.limits as unknown as IPlanLimits)?.[limit.key as keyof IPlanLimits];
                                    const isUnlimited = limitValue === undefined || limitValue === null || Number(limitValue) === -1 || (limit.key === 'storageGB' && Number(limitValue) === 0);

                                    let overageText = '';
                                    if (!isUnlimited) {
                                        overageText = formatOveragePrice(plan, limit, billingInterval);
                                    }

                                    return (
                                        <td key={`${plan.id}-${limit.key}`} className="px-4 py-3 text-center text-sm text-gray-900 font-medium">
                                            <div>{isUnlimited ? 'Unlimited' : (limit.key === 'storageGB' ? `${limitValue} GB` : limitValue)}</div>
                                            {overageText && (
                                                <div className="text-xs text-gray-500 font-normal mt-0.5">
                                                    {overageText}/extra
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
                        plans.some(plan => {
                            const val = (plan.limits as any)?.[key];
                            return plan.isLmsEnabled !== false && (val === null || val === -1 || Number(val || 0) > 0);
                        })
                    ) && (
                            <React.Fragment key="lms-limits-section">
                                <tr className="bg-indigo-50/20 sticky top-[120px] z-10 ">
                                    <td colSpan={plans.length + 1} className="px-4 py-2 text-xs font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50/40 flex items-center gap-2">
                                        LMS / Training Resources
                                    </td>
                                </tr>
                                {[
                                    { key: 'lmsCourses', label: 'LMS Courses', unit: 'course', priceKey: 'lmsCourseUnitPrice', yearlyPriceKey: 'yearlyLmsCourseUnitPrice' },
                                    { key: 'students', label: 'Active Students', unit: 'student', priceKey: 'studentUnitPrice', yearlyPriceKey: 'yearlyStudentUnitPrice' },
                                    { key: 'instructors', label: 'Instructors', unit: 'instructor', priceKey: 'instructorUnitPrice', yearlyPriceKey: 'yearlyInstructorUnitPrice' },
                                    { key: 'certificates', label: 'Certificates', unit: 'certificate', priceKey: 'certificateUnitPrice', yearlyPriceKey: 'yearlyCertificateUnitPrice' }
                                ].filter(limit => plans.some(plan => {
                                    const val = (plan.limits as any)?.[limit.key];
                                    return plan.isLmsEnabled !== false && (val === null || val === -1 || Number(val || 0) > 0);
                                })).map((limit) => (
                                    <tr key={limit.key} className="hover:bg-indigo-50/10 transition-colors">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-700">{limit.label}</td>
                                        {plans.map(plan => {
                                            const limitValue = plan.isLmsEnabled !== false ? (plan.limits as unknown as IPlanLimits)?.[limit.key as keyof IPlanLimits] : undefined;

                                            if (limitValue === undefined) {
                                                return <td key={`${plan.id}-${limit.key}`} className="px-4 py-3 text-center text-sm font-bold text-gray-400 dark:text-gray-500">Not Included</td>;
                                            }

                                            const isUnlimited = limitValue === null || Number(limitValue) === -1;

                                            let overageText = '';
                                            if (!isUnlimited) {
                                                overageText = formatOveragePrice(plan, limit, billingInterval);
                                            }

                                            return (
                                                <td key={`${plan.id}-${limit.key}`} className="px-4 py-3 text-center text-sm text-gray-900 font-medium">
                                                    <div>{isUnlimited ? 'Unlimited' : limitValue}</div>
                                                    {overageText && (
                                                        <div className="text-xs text-gray-500 font-normal mt-0.5">
                                                            {overageText}/extra
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
                                    <tr className={`sticky top-[120px] z-10 shadow-sm ${isMarketing
                                        ? 'bg-gradient-to-r from-indigo-50/90 via-purple-50/70 to-pink-50/50 border-y border-indigo-100'
                                        : 'bg-gray-50'
                                        }`}>
                                        <td colSpan={plans.length + 1} className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider ${isMarketing ? 'text-indigo-950 flex items-center gap-2' : 'text-gray-700 bg-gray-50'
                                            }`}>
                                            {isMarketing && <Sparkles className="w-3.5 h-3.5 text-[#5c3ffa]" />}
                                            <span>{category}</span>
                                            {isMarketing && (
                                                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-[#5c3ffa] to-[#cb3b95] text-white normal-case tracking-normal">
                                                    Special Offer
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                    {items.map(item => {
                                        const isPerk = isSpecialPerk(item);
                                        const isGoogleAds = item.toLowerCase().includes('google ads');

                                        return (
                                            <tr key={item} className={`transition-colors ${isPerk ? 'bg-indigo-50/15 hover:bg-indigo-50/30' : 'hover:bg-gray-50'
                                                }`}>
                                                <td className="px-4 py-3.5 text-sm font-medium text-gray-700">
                                                    {isPerk ? (
                                                        <div className="flex items-center gap-2">
                                                            <Sparkles className={`w-4 h-4 shrink-0 ${isGoogleAds ? 'text-amber-500' : 'text-[#5c3ffa]'}`} />
                                                            <span className="font-semibold text-gray-900">{item}</span>
                                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs ${isGoogleAds
                                                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                                                                : 'bg-gradient-to-r from-[#5c3ffa] to-[#cb3b95] text-white'
                                                                }`}>
                                                                {isGoogleAds ? '₹1 Lakh' : 'Bonus'}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        item
                                                    )}
                                                </td>
                                                {plans.map(plan => {
                                                    const status = displayFeatureStatus(plan, category, item);

                                                    if (isPerk) {
                                                        if (status === 'enabled') {
                                                            return (
                                                                <td key={`${plan.id}-${item}`} className="px-4 py-3.5 text-center text-sm">
                                                                    <div className="flex justify-center">
                                                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-xs ${isGoogleAds
                                                                            ? 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 text-amber-900'
                                                                            : 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 text-indigo-700'
                                                                            }`}>
                                                                            <Check className={`w-3.5 h-3.5 ${isGoogleAds ? 'text-amber-600' : 'text-indigo-600'} stroke-[3]`} />
                                                                            <span>{isGoogleAds ? '₹1 Lakh Free' : 'Free Included'}</span>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            );
                                                        }
                                                        return (
                                                            <td key={`${plan.id}-${item}`} className="px-4 py-3.5 text-center text-sm">
                                                                <div className="flex justify-center">
                                                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                                                        <X className="w-3.5 h-3.5 text-gray-400" />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        );
                                                    }

                                                    return (
                                                        <td key={`${plan.id}-${item}`} className="px-4 py-3 text-center text-sm">
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
        </div >
    );
};

export default PlansComparisonTableDesktop;
