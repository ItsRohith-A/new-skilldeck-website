import { IPlan } from "@/types/interface-lib";
export interface PricingPlan extends IPlan {
    uiMetadata: {
        isHighlighted: boolean;
        colorTheme: "blue" | "purple" | "slate" | "default";
        icon: "rocket" | "crown" | "infinity" | "building";
        badge?: string;
        savingsBadge?: boolean;
    };
}

const enrichPlan = (plan: IPlan, index?: number): PricingPlan => {
    const name = plan.name.toLowerCase();
    const isEnterprise = name.includes("enterprise");
    const isStarter = name.includes("starter");

    let colorTheme: PricingPlan["uiMetadata"]["colorTheme"] = "default";
    let icon: PricingPlan["uiMetadata"]["icon"] = "crown";
    let isHighlighted = false;
    let badge: string | undefined = undefined;

    const isGrowth = name.includes("growth");
    const isBusiness = name.includes("business");

    if (index === 1 || isGrowth) {
        isHighlighted = true;
        badge = "Most Popular";
        colorTheme = "blue"; // brand gradient — only Growth gets this
        icon = "building";
    } else if (index === 2 || isBusiness) {
        // Business / 3rd plan — plain white, same as Starter
        colorTheme = "default";
        icon = "building";
    }

    if (isEnterprise) {
        icon = "building";
        if (!isHighlighted) {
            colorTheme = "blue";
        }
    } else if (isStarter && !isGrowth && !isBusiness) {
        if (!isHighlighted) {
            colorTheme = "default";
            icon = "rocket";
        }
    }

    // Ensure displayFeatures has Marketing & Growth perks
    const displayFeatures = [...(plan.displayFeatures || [])];
    const marketingPerks: string[] = [];
    if (isGrowth || index === 1) {
        marketingPerks.push("Free SEO For Courses");
    } else if (isBusiness || isEnterprise || index === 2) {
        marketingPerks.push("Free SEO For Courses");
        marketingPerks.push("Free Google Ads Up to 1 Lakh Budget");
    }

    const existingMarketingIndex = displayFeatures.findIndex(
        (g: any) => g.category?.toLowerCase().includes("marketing") || g.category?.toLowerCase().includes("growth")
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
            category: "Marketing & Growth",
            items: marketingPerks
        });
    }

    return {
        ...plan,
        displayFeatures,
        uiMetadata: {
            isHighlighted,
            colorTheme,
            icon,
            badge,
            savingsBadge: true
        }
    };
};

export const fetchPlans = async (currency?: string): Promise<PricingPlan[]> => {
    try {
        const apiUrl = process.env.SERVER_URL || "https://api.skilldeck.net";
        const queryParams = new URLSearchParams();
        if (currency) {
            queryParams.append("currency", currency);
        }
        const queryString = queryParams.toString();
        const url = `${apiUrl}/api/v1/admin/plans${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
            next: { tags: ['plans'] }
        });

        if (!response.ok) {
            console.error(`Failed to fetch plans: ${response.statusText}`);
            return [];
        }
        const data = await response.json();
        const plansData = Array.isArray(data) ? data : (data.data || []);

        const sanitizedPlans = plansData.map((p: any, index: number) => ({
            ...p,
            id: p.id || p._id || `plan-${index}`
        }));

        const enrichedPlans = sanitizedPlans.map((p: any, i: number) => enrichPlan(p, i));

        return enrichedPlans;
    } catch (error: any) {
        console.error("Error fetching plans:", error);
        return [];
    }
};
