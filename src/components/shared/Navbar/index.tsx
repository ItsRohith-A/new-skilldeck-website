import MainNavClient from "./elements/MainNavClient";
import { getServicesCategories } from "@/lib/services";

interface NavbarProps {
    isHidden?: boolean;
}

export default async function MainNav({ isHidden }: NavbarProps) {
    // Course categories load client-side from /api/nav-categories (see
    // useNavCategories) — as props they put ~50 KB into every page's HTML.
    const servicesCategories = await getServicesCategories();

    // Only what the services menus read. Every prop of a client component is
    // serialised into the page, and the full service objects carry banners.
    const navServicesCategories = servicesCategories.map((cat) => ({
        _id: cat._id,
        name: cat.name,
        slug: cat.slug,
        order: cat.order,
        services: (cat.services || []).map((service) => ({
            slug: service.slug,
            name: service.name,
            service_name: service.service_name,
            order: service.order,
            servicecard: {
                icon: service.servicecard?.icon,
                thumbnail: service.servicecard?.thumbnail,
            },
        })),
    }));

    return <MainNavClient isHidden={isHidden} servicesCategories={navServicesCategories} />;
}
