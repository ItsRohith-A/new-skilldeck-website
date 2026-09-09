import React, { useEffect, useRef, useState } from 'react';
import { Award, BookOpen, Building2, Check, Crown, HardDrive, Infinity, MapPin, Rocket, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { BillingInterval, computePlanAmount, formatCategoryTitle, formatFeatureTitle, formatOveragePrice, formatPrice, GroupedDisplayFeatures, isSpecialPerk } from './utils';
import { PricingPlan } from '@/lib/plans';
import DOMPurify from "@/lib/dompurify";
import { GroupedFeatures } from './types';

type Props = {
    plan: PricingPlan;
    groups: GroupedFeatures;
    displayGroups?: GroupedDisplayFeatures;
    billingInterval?: BillingInterval;
    onPurchase?: (planId: string) => void;
    loading?: boolean;
};

const PricingCard: React.FC<Props> = ({
    plan,
    groups,
    billingInterval = 'MONTHLY',
    onPurchase,
    loading,
}) => {
    // Calculate price based on selected billing interval
    const displayPrice = computePlanAmount(plan, billingInterval) || 0;

    const { isHighlighted, icon, colorTheme } = plan.uiMetadata || { isHighlighted: false, icon: 'crown', colorTheme: 'default' };

    // Calculate yearly breakdown info
    const monthlyPrice = (plan.discountedPrice ?? plan.price) as number;
    const yearlyPrice = plan.yearlyDiscountedPrice ?? plan.yearlyPrice ?? (monthlyPrice * 12);
    const monthlyIfPaidYearly = monthlyPrice * 12;
    const monthlyEquivalent = billingInterval === 'YEARLY' ? yearlyPrice / 12 : null;
    const yearlySavings = billingInterval === 'YEARLY' && monthlyIfPaidYearly > yearlyPrice
        ? monthlyIfPaidYearly - yearlyPrice
        : 0;
    const savingsPercentage = yearlySavings > 0 ? Math.round((yearlySavings / monthlyIfPaidYearly) * 100) : 0;

    // Card Styles Logic since we are using colorTheme from metadata now
    let cardBgClass = 'bg-white text-gray-900 border border-gray-200 shadow-sm';
    let textColorClass = 'text-gray-900';
    let subTextColorClass = 'text-gray-500';
    let buttonClass = 'bg-[#5c3ffa] text-white hover:bg-[#4e32e8] hover:-translate-y-[1px] shadow-md shadow-[#5c3ffa]/25 transition-all duration-300';
    let checkIconClass = 'text-green-500';
    let iconBgClass = 'bg-brand-50 text-brand-600';

    if (colorTheme === 'blue') {
        // Growth — white card with brand gradient border (padding-box trick)
        cardBgClass = 'bg-white text-gray-900 shadow-xl';
        textColorClass = 'text-gray-900';
        subTextColorClass = 'text-gray-500';
        buttonClass = 'bg-[#5c3ffa] text-white font-bold hover:bg-[#4e32e8] hover:-translate-y-[1px] transition-all duration-300 shadow-md shadow-[#5c3ffa]/25';
        checkIconClass = 'text-[#5c3ffa]';
        iconBgClass = 'bg-[#5c3ffa]/10 text-[#5c3ffa]';
    } else if (colorTheme === 'purple') {
        cardBgClass = 'bg-white text-gray-900 border-2 border-indigo-100 shadow-xl shadow-indigo-100/60';
        textColorClass = 'text-gray-900';
        subTextColorClass = 'text-gray-500';
        buttonClass = 'bg-[#5c3ffa] text-white hover:bg-[#4e32e8] hover:-translate-y-[1px] shadow-md shadow-[#5c3ffa]/25 transition-all duration-300';
        checkIconClass = 'text-indigo-500';
        iconBgClass = 'bg-indigo-50 text-indigo-600';
    }

    const isDark = false;

    // Icon Selection
    const renderIcon = () => {
        if (icon === 'rocket') return <Rocket className="w-5 h-5 text-brand-600" />;
        if (icon === 'building') return <Building2 className="w-5 h-5 text-purple-600" />;
        return <Crown className="w-5 h-5 text-brand-600" />;
    };

    // Customize Icon BG per plan if not dark-themed
    if (!isDark) {
        if (icon === 'building') iconBgClass = 'bg-purple-50 text-purple-600';
        if (icon === 'rocket') iconBgClass = 'bg-blue-50 text-blue-600';
    }

    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollDown, setCanScrollDown] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            // Show indicator if we are not at the bottom
            setCanScrollDown(scrollHeight > clientHeight && scrollTop + clientHeight < scrollHeight - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        // Also check on mount
        setTimeout(checkScroll, 100);
        return () => window.removeEventListener('resize', checkScroll);
    }, [groups]);

    const cardInnerContent = (
        <div
            className={`
                relative flex flex-col p-4 ${colorTheme === 'blue' ? 'rounded-[18px]' : 'rounded-2xl'} h-full transition-all duration-300
                ${cardBgClass}
            `}
        >
            {isHighlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FFCB27] text-black text-[10px] font-bold px-4 py-1.5 rounded-full shadow-sm whitespace-nowrap uppercase tracking-wide z-20">
                    Most Popular
                </div>
            )}

            {savingsPercentage > 0 && billingInterval === 'YEARLY' && (
                <div className="absolute top-0 right-0.5 bg-green-500 text-white text-[10px] md:text-xs font-bold px-2 md:px-2 py-1 md:py-1.5 rounded-bl-xl rounded-tr-xl z-20">
                    Save {savingsPercentage}%
                </div>
            )}

            {/* STICKY HEADER SECTION */}
            <div className="flex-none z-10">
                {/* Header Info */}
                <div className="space-y-1 mb-2">
                    {/* Icon + Plan Name inline (flex row) */}
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${iconBgClass}`}>
                            {renderIcon()}
                        </div>
                        <h3 className={`text-base font-bold truncate leading-tight ${textColorClass}`}>
                            {plan.name}
                        </h3>
                    </div>

                    {/* Description below — smart render: split ✓ items into vertical list */}
                    {(() => {
                        const raw = DOMPurify.sanitize(plan.description || 'For growing teams');
                        // Strip HTML tags to plain text
                        const plainText = raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

                        // Decode common HTML entities (e.g. &amp; → &, &nbsp; → space)
                        const decodeEntities = (str: string) => str
                            .replace(/&amp;/g, '&')
                            .replace(/&lt;/g, '<')
                            .replace(/&gt;/g, '>')
                            .replace(/&quot;/g, '"')
                            .replace(/&#039;/g, "'")
                            .replace(/&nbsp;/g, ' ');

                        // Handle all checkmark variants: ✓ (U+2713), ✔ (U+2714), ✅
                        const checkmarkRegex = /[✓✔✅]/u;
                        const splitRegex = /[✓✔✅]/gu;

                        if (!checkmarkRegex.test(plainText)) {
                            // No checkmarks — render as plain HTML
                            return (
                                <div
                                    className={`text-[11px] 2xl:text-xs leading-relaxed h-28 overflow-hidden ${subTextColorClass}`}
                                    dangerouslySetInnerHTML={{ __html: raw }}
                                />
                            );
                        }

                        const parts = plainText.split(splitRegex).map((s: any) => decodeEntities(s.trim())).filter(Boolean);
                        const [intro, ...bullets] = parts;

                        const planNameLower = (plan.name || '').toLowerCase();
                        const isGrowth = planNameLower.includes('growth');
                        const isBusiness = planNameLower.includes('business');

                        const finalBullets = [...bullets];
                        if (isGrowth || isBusiness) {
                            if (!finalBullets.some((b: string) => b.toLowerCase().includes('seo'))) {
                                finalBullets.push('Free SEO For Courses');
                            }
                        }
                        if (isBusiness) {
                            if (!finalBullets.some((b: string) => b.toLowerCase().includes('google ads'))) {
                                finalBullets.push('Free Google Ads Up to 1 Lakh Budget');
                            }
                        }

                        return (
                            <div className={`space-y-1.5 md:h-[200px] flex flex-col justify-start ${subTextColorClass}`}>
                                {intro && (
                                    <p className="text-[10px] 2xl:text-[11px] leading-snug text-gray-500 line-clamp-2 mb-1">{intro}</p>
                                )}
                                <ul className="space-y-1.5">
                                    {finalBullets.map((item: any, i: any) => {
                                        const itemLower = String(item).toLowerCase();
                                        const isGoogleAds = itemLower.includes('google ads');
                                        const isSeo = itemLower.includes('seo');

                                        if (isGoogleAds || isSeo) {
                                            return (
                                                <li
                                                    key={i}
                                                    className="flex items-center justify-between gap-2 py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-pink-50/30 border border-indigo-100 shadow-xs"
                                                >
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#5c3ffa] to-[#cb3b95] flex items-center justify-center shrink-0 shadow-xs">
                                                            <Sparkles className="w-2.5 h-2.5 text-white" />
                                                        </div>
                                                        <span className="text-[11px] 2xl:text-xs font-bold text-slate-900 truncate">
                                                            {item}
                                                        </span>
                                                    </div>
                                                    <span className="shrink-0 text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full bg-gradient-to-r from-[#5c3ffa] to-[#cb3b95] text-white shadow-xs">
                                                        {isGoogleAds ? '₹1L Budget' : 'Free'}
                                                    </span>
                                                </li>
                                            );
                                        }

                                        return (
                                            <li key={i} className="flex items-start gap-1.5">
                                                <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${checkIconClass}`} strokeWidth={3} />
                                                <span className="text-[11px] 2xl:text-xs leading-snug">{item}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })()}

                    <div className="h-7 flex items-baseline justify-start">
                        {loading ? (
                            <div className={`animate-pulse rounded-lg h-8 w-32 ${isDark ? 'bg-white/20' : 'bg-slate-200'}`} />
                        ) : (
                            <>
                                <span className={`text-xl font-bold ${textColorClass}`}>
                                    {formatPrice(displayPrice, plan.currency || 'USD')}
                                </span>
                                <span className={`text-xs md:text-sm ml-2 ${subTextColorClass}`}>
                                    /{billingInterval === 'YEARLY' ? 'year' : 'mo'}
                                </span>
                            </>
                        )}
                    </div>
                    {billingInterval === 'YEARLY' && (
                        <div className="h-3">
                            {loading ? (
                                <div className={`animate-pulse rounded-md h-4 w-40 mt-1 ${isDark ? 'bg-white/10' : 'bg-slate-100'}`} />
                            ) : billingInterval === 'YEARLY' && monthlyEquivalent ? (
                                <p className={`text-xs 2xl:text-sm ${subTextColorClass}`}>
                                    {formatPrice(monthlyEquivalent, plan.currency || 'USD')}/mo billed annually
                                </p>
                            ) : null}
                        </div>
                    )}

                </div>

                {/* Action Button */}
                <button
                    onClick={() => onPurchase?.(plan.id)}
                    className={`w-full py-3 rounded-xl font-bold text-xs md:text-xs mb-4 transition-colors shadow-sm cursor-pointer ${buttonClass}`}
                >
                    Start Free Trial
                </button>

                {/* Divider */}
                <div className={`w-full h-px mb-4 ${isDark ? 'bg-white/20' : 'bg-gray-100'}`} />
            </div>

            {/* SCROLLABLE FEATURES SECTION */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="md:hidden w-full py-2.5 rounded-xl border border-gray-200 font-bold text-xs text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm mb-4 cursor-pointer"
            >
                {isExpanded ? 'Hide features' : 'Show features'}
            </button>

            <div className={`flex-1 min-h-0 relative group/list ${isExpanded ? 'block' : 'hidden'} md:block`}>
                <div
                    ref={scrollRef}
                    onScroll={checkScroll}
                    className="h-full overflow-y-auto pr-2 pricing-scrollbar"
                >
                    {/* Limits with Overage Pricing */}
                    <div className="space-y-4 pb-2">
                        {plan.limits && Object.keys(plan.limits).length > 0 && (
                            <div className="mb-5">
                                <h4 className={`text-[10px] font-bold uppercase tracking-wider mb-2.5 ${isDark ? 'text-white/80' : 'text-slate-400'}`}>
                                    Platform Resources
                                </h4>
                                <div className="grid grid-cols-1 gap-1.5 mb-5">
                                    {['seats', 'storage', 'locations', 'courses'].map(key => {
                                        const val = (plan.limits as any)[key] ?? (plan.limits as any)[key === 'storage' ? 'storageGB' : ''];
                                        const config = getResourceConfig(key);
                                        const isUnlimited = val === undefined || val === null || Number(val) === -1 || (key === 'storage' && Number(val) === 0);

                                        let priceKey = `${key.replace(/s$/, '')}UnitPrice`;
                                        let yearlyPriceKey = `yearly${key.replace(/s$/, '').charAt(0).toUpperCase() + key.replace(/s$/, '').slice(1)}UnitPrice`;

                                        if (key === 'seats') { priceKey = 'seatUnitPrice'; yearlyPriceKey = 'yearlySeatUnitPrice'; }
                                        else if (key === 'storage') { priceKey = 'storageUnitPrice'; yearlyPriceKey = 'yearlyStorageUnitPrice'; }
                                        else if (key === 'locations') { priceKey = 'locationUnitPrice'; yearlyPriceKey = 'yearlyLocationUnitPrice'; }
                                        else if (key === 'courses') { priceKey = 'courseUnitPrice'; yearlyPriceKey = 'yearlyCourseUnitPrice'; }

                                        let overageText = '';
                                        if (!isUnlimited) {
                                            const priceText = formatOveragePrice(plan, { priceKey, yearlyPriceKey }, billingInterval);
                                            if (priceText) overageText = priceText;
                                        }

                                        const displayValue = isUnlimited ? 'Unlimited' : (key === 'storage' ? `${val} GB` : val);

                                        return (
                                            <div key={key} className={`h-[38px] w-full flex items-center justify-between rounded-lg px-2.5 border transition-colors ${isDark ? 'bg-white/10 border-white/20' : 'bg-slate-50/70 border-slate-200/60 hover:bg-slate-50'}`}>
                                                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                                    <div className={`shrink-0 p-1 rounded-md shadow-2xs ${isDark ? 'bg-white/20 text-white' : 'bg-white border border-slate-200/70 text-slate-500'}`}>
                                                        {config.icon}
                                                    </div>
                                                    <span className={`text-xs font-semibold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                                        {displayValue} <span className={`font-medium ${isDark ? 'text-white/70' : 'text-slate-500'}`}>{config.label}</span>
                                                    </span>
                                                </div>
                                                {overageText && (
                                                    <div className={`shrink-0 text-[10px] font-semibold tracking-tight px-2 py-0.5 rounded border ${isDark ? 'text-white/90 bg-white/10 border-white/20' : 'text-[#5c3ffa] bg-[#5c3ffa]/5 border-[#5c3ffa]/15'}`}>
                                                        {overageText}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div>
                            <h4 className={`text-[10px] font-bold uppercase tracking-wider mb-2.5 ${plan.isLmsEnabled === false
                                ? 'text-slate-400 opacity-60'
                                : isDark ? 'text-white/80' : 'text-slate-400'
                                }`}>
                                LMS / Training Resources
                            </h4>
                            <div className="mb-5 grid grid-cols-1 gap-1.5">
                                {['lmsCourses', 'students', 'instructors', 'certificates'].map(key => {
                                    const config = getResourceConfig(key);
                                    const val = plan.isLmsEnabled !== false ? (plan.limits as any)[key] : undefined;
                                    const isLmsDisabled = plan.isLmsEnabled === false;

                                    let priceKey = `${key.replace(/s$/, '')}UnitPrice`;
                                    let yearlyPriceKey = `yearly${key.replace(/s$/, '').charAt(0).toUpperCase() + key.replace(/s$/, '').slice(1)}UnitPrice`;

                                    if (key === 'lmsCourses') { priceKey = 'lmsCourseUnitPrice'; yearlyPriceKey = 'yearlyLmsCourseUnitPrice'; }
                                    else if (key === 'students') { priceKey = 'studentUnitPrice'; yearlyPriceKey = 'yearlyStudentUnitPrice'; }
                                    else if (key === 'instructors') { priceKey = 'instructorUnitPrice'; yearlyPriceKey = 'yearlyInstructorUnitPrice'; }
                                    else if (key === 'certificates') { priceKey = 'certificateUnitPrice'; yearlyPriceKey = 'yearlyCertificateUnitPrice'; }

                                    const isUnlimited = val === null || Number(val) === -1;
                                    let overageText = '';
                                    if (!isLmsDisabled && !isUnlimited) {
                                        const priceText = formatOveragePrice(plan, { priceKey, yearlyPriceKey }, billingInterval);
                                        if (priceText) overageText = priceText;
                                    }

                                    const displayValue = isLmsDisabled ? 'Not Included' : (isUnlimited ? 'Unlimited' : val);

                                    return (
                                        <div key={key} className={`h-[38px] w-full flex items-center justify-between rounded-lg px-2.5 border transition-colors ${isLmsDisabled
                                            ? 'bg-slate-50/30 border-dashed border-slate-200 opacity-60'
                                            : isDark ? 'bg-white/10 border-white/20' : 'bg-slate-50/70 border-slate-200/60 hover:bg-slate-50'
                                            }`}>
                                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                                <div className={`shrink-0 p-1 rounded-md shadow-2xs ${isLmsDisabled
                                                    ? 'bg-white border border-slate-200/70 text-slate-400'
                                                    : isDark ? 'bg-white/20 text-white' : 'bg-white border border-slate-200/70 text-slate-500'
                                                    }`}>
                                                    {config.icon}
                                                </div>
                                                <span className={`text-xs font-semibold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                                    {isLmsDisabled ? (
                                                        <span className="text-slate-400 font-medium">Not Included</span>
                                                    ) : (
                                                        <>{displayValue}</>
                                                    )} <span className={`font-medium ${isDark ? 'text-white/70' : 'text-slate-500'}`}>{config.label}</span>
                                                </span>
                                            </div>
                                            {overageText && (
                                                <div className={`shrink-0 text-[10px] font-semibold tracking-tight px-2 py-0.5 rounded border ${isDark ? 'text-white/90 bg-white/10 border-white/20' : 'text-[#5c3ffa] bg-[#5c3ffa]/5 border-[#5c3ffa]/15'}`}>
                                                    {overageText}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {(() => {
                            const filteredGroups = (plan.displayFeatures || [])
                                .filter((group: any) => {
                                    const cat = (group.category || '').toLowerCase();
                                    return !cat.includes('marketing') && !cat.includes('growth');
                                })
                                .map((group: any) => ({
                                    ...group,
                                    items: (group.items || []).filter((item: string) => !isSpecialPerk(item))
                                }))
                                .filter((group: any) => group.items.length > 0);

                            if (filteredGroups.length === 0) {
                                return (
                                    <div className="flex items-center justify-center h-full text-slate-400 text-xs italic py-4">
                                        All core features included
                                    </div>
                                );
                            }

                            return filteredGroups.map((group: any, idx: number) => (
                                <div key={idx} className="mt-5 first:mt-3">
                                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                                        {group.category}
                                    </h4>
                                    <div className="space-y-2">
                                        {group.items.map((item: string, itemIdx: number) => (
                                            <div key={itemIdx} className="flex items-center gap-2">
                                                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" strokeWidth={2.5} />
                                                <span className="text-xs font-semibold text-slate-800 leading-tight">
                                                    {item}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ));
                        })()}
                    </div>
                </div>
            </div>

            <div className="hidden md:block mt-auto pt-4 flex-none z-10">
                <button
                    onClick={() => onPurchase?.(plan.id)}
                    className={`w-full py-3 rounded-xl font-bold text-xs md:text-xs mb-4 transition-colors shadow-sm cursor-pointer ${buttonClass}`}
                >
                    Start Free Trial
                </button>
            </div>
        </div>
    );

    return (
        <div className="relative h-full flex flex-col group/card-container transition-all duration-300 hover:-translate-y-1">
            {colorTheme === 'blue' ? (
                <div className="p-[2px] rounded-2xl bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] shadow-xl shadow-[#5c3ffa]/15 h-full">
                    {cardInnerContent}
                </div>
            ) : (
                cardInnerContent
            )}
        </div>
    );
};

const getResourceConfig = (key: string) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey === 'seats') return { label: 'Seats', icon: <Users size={14} />, colorClass: 'text-blue-500', resourceKey: 'seat' as const };
    if (lowerKey === 'storagegb' || lowerKey === 'storage') return { label: 'Storage', icon: <HardDrive size={14} />, colorClass: 'text-purple-500', resourceKey: 'storage' as const };
    if (lowerKey === 'locations') return { label: 'Locations', icon: <MapPin size={14} />, colorClass: 'text-indigo-500', resourceKey: 'location' as const };
    if (lowerKey === 'courses') return { label: 'CMS/Website Courses', icon: <BookOpen size={14} />, colorClass: 'text-emerald-500', resourceKey: 'course' as const };
    if (lowerKey === 'lmscourses') return { label: 'LMS Courses', icon: <BookOpen size={14} />, colorClass: 'text-blue-500', resourceKey: 'lmsCourse' as const };
    if (lowerKey === 'students') return { label: 'Active Students', icon: <Users size={14} />, colorClass: 'text-orange-500', resourceKey: 'student' as const };
    if (lowerKey === 'instructors') return { label: 'Instructors', icon: <ShieldCheck size={14} />, colorClass: 'text-brand-500', resourceKey: 'instructor' as const };
    if (lowerKey === 'certificates') return { label: 'Certificates', icon: <Award size={14} />, colorClass: 'text-purple-600', resourceKey: 'certificate' as const };
    return { label: key, icon: <Sparkles size={14} />, colorClass: 'text-gray-500', resourceKey: 'seat' as const };
};

export default PricingCard;

