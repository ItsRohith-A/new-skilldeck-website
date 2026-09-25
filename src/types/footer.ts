export interface FooterLogo {
    alt?: string;
    url?: string;
    thumbnail?: string;
}

export interface FooterLink {
    label: string;
    url: string;
}

export interface FooterColumn {
    title: string;
    order?: number;
    links?: FooterLink[];
    content?: string;
    logo?: FooterLogo;
}

export interface PopularCategory {
    name: string;
    slug: string;
}

export interface PopularCourse {
    name: string;
    slug: string;
    categorySlug?: string;
}

export interface SocialLinkItem {
    name: string;
    link: string;
    icon?: string | null;
}

export interface PopularService {
    _id?: string;
    name?: string;
    slug?: string;
}

export interface FooterData {
    footer_columns?: FooterColumn[];
    popular?: string[];
    numbers?: string[];
    disclaimer?: string;
    bottom_ribbon?: string;
    popular_categories?: PopularCategory[];
    popular_courses?: PopularCourse[];
    /**
     * The CMS stores these as Service ids and the footer endpoint does not
     * populate them, so the site resolves them itself. Objects are accepted too,
     * in case the backend starts populating the ref.
     */
    popular_services?: Array<string | PopularService>;
    /** Service-category ids. No route renders a single service category, so
     *  these are accepted but not linked. */
    popular_service_categories?: Array<string | PopularService>;
    social?: SocialLinkItem[];
    updatedAt?: string;
}
