import { IPlan } from '@/types/interface-lib';
import { GroupedFeatures, IPlanOveragePricing } from './types';

const getLabelFromKey = (s: string) => {
    const acronyms = ['CRM', 'CMS', 'SEO', 'API', 'LMS', 'GB', 'TB', 'MB', 'B2B', 'B2C'];
    return s
        .split('-')
        .map(word => {
            const upper = word.toUpperCase();
            return acronyms.includes(upper) ? upper : word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
};

export const groupFeatures = (plans: IPlan[]): GroupedFeatures => {
    const groups: GroupedFeatures = {};
    const seen = new Set<string>();

    for (const plan of plans) {
        for (const f of plan.features || []) {
            const featureKey = f.key || '';
            const parts = featureKey.split('.');
            if (parts.length < 1) continue;

            const cat = getLabelFromKey(parts[0]);
            const sub = parts.length > 2 ? getLabelFromKey(parts[1]) : 'General';

            if (!groups[cat]) groups[cat] = {};
            if (!groups[cat][sub]) groups[cat][sub] = [];

            if (!seen.has(featureKey)) {
                let derivedLabel = '';
                if (parts.length > 2) {
                    derivedLabel = getLabelFromKey(parts.slice(2).join(' '));
                } else if (parts.length === 2) {
                    derivedLabel = getLabelFromKey(parts[1]);
                } else {
                    derivedLabel = getLabelFromKey(parts[0]);
                }

                groups[cat][sub].push({
                    key: featureKey,
                    label: f.description || derivedLabel,
                });
                seen.add(featureKey);
            }
        }
    }
    return groups;
};

export const featureStatus = (
    plan: IPlan,
    key: string
): 'enabled' | 'disabled' | 'absent' => {
    const f = (plan.features || []).find(ff => ff.key === key);
    if (!f) return 'absent';
    return f.value === 'enabled' ? 'enabled' : 'disabled';
};

export type GroupedDisplayFeatures = Record<string, string[]>;

export const PERK_FREE_SEO = "Free SEO For Courses";
export const PERK_FREE_GOOGLE_ADS = "Free Google Ads Up to 1 Lakh Budget";

export const isSpecialPerk = (text: string): boolean => {
    const lower = (text || '').toLowerCase();
    return lower.includes('seo for courses') || lower.includes('free seo') || lower.includes('google ads');
};

export const groupDisplayFeatures = (plans: any[]): GroupedDisplayFeatures => {
    const groups: GroupedDisplayFeatures = {};

    // Always ensure Marketing & Growth perks category is present
    groups["Marketing & Growth"] = [PERK_FREE_SEO, PERK_FREE_GOOGLE_ADS];

    for (const plan of plans) {
        if (!plan.displayFeatures) continue;
        for (const group of plan.displayFeatures) {
            const cat = group.category;
            if (!groups[cat]) groups[cat] = [];
            for (const item of group.items || []) {
                if (!groups[cat].includes(item)) {
                    groups[cat].push(item);
                }
            }
        }
    }
    return groups;
};

export const displayFeatureStatus = (plan: any, category: string, item: string): 'enabled' | 'disabled' => {
    const planName = (plan.name || '').toLowerCase();
    const isGrowth = planName.includes('growth');
    const isBusiness = planName.includes('business') || planName.includes('enterprise');

    if (item === PERK_FREE_SEO || item.toLowerCase().includes('free seo')) {
        return (isGrowth || isBusiness) ? 'enabled' : 'disabled';
    }
    if (item === PERK_FREE_GOOGLE_ADS || item.toLowerCase().includes('google ads')) {
        return isBusiness ? 'enabled' : 'disabled';
    }

    if (!plan.displayFeatures) return 'disabled';
    const group = plan.displayFeatures.find((g: any) => g.category === category);
    if (!group) return 'disabled';
    return (group.items || []).includes(item) ? 'enabled' : 'disabled';
};

export const formatPrice = (
    price?: number | null,
    currency: string = 'USD'
): string => {
    if (price === null || price === undefined) return '—';
    try {
        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currencyDisplay: 'narrowSymbol',
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(price);
    } catch {
        return `${currency} ${price}`;
    }
};

export const formatFeatureTitle = (input: string): string => {
    return input || '';
};

export const formatCategoryTitle = (category: string): string => {
    return category || '';
};

export type BillingInterval = 'MONTHLY' | 'YEARLY';

export const computePlanAmount = (p: IPlan, interval?: BillingInterval) => {
    const effectiveInterval = interval || (p.interval === 'YEARLY' ? 'YEARLY' : 'MONTHLY');

    const monthly = (p.discountedPrice ?? p.price) ?? 0;
    const yearly = (p.yearlyDiscountedPrice ?? p.yearlyPrice) ?? 0;

    return effectiveInterval === 'YEARLY'
        ? (yearly || monthly * 12)
        : monthly;
};

export const getPlanFeatureValue = (plan: IPlan, featureKey: string): any => {
    const feature = (plan.features || []).find(f => f.key === featureKey);
    if (!feature) return false;

    return feature.value ?? true;
};

export const formatOveragePrice = (
    plan: IPlan,
    limit: { priceKey: string; yearlyPriceKey: string },
    interval: BillingInterval
): string => {
    const isYearly = interval === 'YEARLY';
    const targetCurrency = ((plan.currency as any)?.code || plan.currency || 'USD').toUpperCase();

    let basePrice = 0;
    let yearlyPrice = 0;
    let hasYearlyPricing = false;

    const findOverageByCurrency = (code?: string) => {
        if (!code || !(plan as any).multiCurrencyOveragePricing?.length) return null;
        return (plan as any).multiCurrencyOveragePricing.find((o: any) => {
            const c = (o.currency?.code || o.currencyCode || o.currency)?.toUpperCase();
            return c === code;
        }) as any;
    };

    // 1. Try multi-currency overage array first
    if ((plan as any).multiCurrencyOveragePricing?.length) {
        const found: any = findOverageByCurrency(targetCurrency) || findOverageByCurrency('USD');
        if (found) {
            basePrice = Number(found[limit.priceKey] || 0);
            hasYearlyPricing = found[limit.yearlyPriceKey] !== undefined && found[limit.yearlyPriceKey] !== null;
            yearlyPrice = hasYearlyPricing ? Number(found[limit.yearlyPriceKey]) : basePrice * 12;
        }
    }
    // 2. Fallback to legacy overagePricing
    else {
        const pricing = plan.overagePricing as any;
        if (pricing) {
            basePrice = Number(pricing[limit.priceKey] || 0);
            hasYearlyPricing = pricing[limit.yearlyPriceKey] !== undefined && pricing[limit.yearlyPriceKey] !== null;
            yearlyPrice = hasYearlyPricing ? Number(pricing[limit.yearlyPriceKey]) : basePrice * 12;
        }
    }

    if (isYearly) {
        const monthlyEq = yearlyPrice / 12;
        if (yearlyPrice > 0) {
            return `+${formatPrice(yearlyPrice, targetCurrency)}/yr (${formatPrice(monthlyEq, targetCurrency)}/mo)`;
        }
    } else {
        if (basePrice > 0) {
            return `+${formatPrice(basePrice, targetCurrency)}/mo`;
        }
    }

    return '';
};
