import { fetchFromBackend } from "./apiProxy";
import { FooterData } from "@/types";

export * from "@/types/footer";

export async function getFooterData(): Promise<FooterData | null> {
    try {
        const response = await fetchFromBackend("/footer", {
            next: { tags: ["footer"] }
        });

        if (!response.ok) {
            return null;
        }

        const data: FooterData = await response.json();
        return data || null;
    } catch (error) {
        console.error("Error fetching footer data:", error);
        return null;
    }
}
