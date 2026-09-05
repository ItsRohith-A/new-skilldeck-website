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

    if (index === 1) {
        isHighlighted = true;
        badge = "Most Popular";
        colorTheme = "blue"; // brand gradient — only Growth gets this
        icon = "building";
    } else if (index === 2) {
        // Business / 3rd plan — plain white, same as Starter
        colorTheme = "default";
        icon = "building";
    }

    if (isEnterprise) {
        icon = "building";
        if (!isHighlighted) {
            colorTheme = "blue";
        }
    } else if (isStarter) {
        if (!isHighlighted) {
            colorTheme = "default";
            icon = "rocket";
        }
    }

    return {
        ...plan,
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
