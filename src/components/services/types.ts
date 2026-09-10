export interface ServiceMedia {
    url: string;
    alt?: string;
}

export interface ServiceStatItem {
    icon?: string;
    value: string;
    description: string;
    tagline?: string;
}

export interface ServiceBannerStat {
    icon?: string;
    value: string;
}

export interface ServiceReview {
    count?: string;
    ratings?: string;
    icon?: string;
}

export interface ServiceBanner {
    h1?: string;
    tagline?: string;
    description?: string;
    media?: ServiceMedia;
    stats?: ServiceBannerStat[];
    reviews?: ServiceReview[];
}

export interface ServiceCard {
    tagline?: string;
    title?: string;
    slug?: string;
    icon?: string;
    thumbnail?: string;
    content?: string;
    ratings?: string;
    clients?: string;
    points?: string[];
}

export interface ServiceCategoryRef {
    name?: string;
    slug?: string;
}

export interface ServiceWhyPoint {
    icon?: string;
    title: string;
    description: string;
}

export interface ServiceWhyChooseUsData {
    tagline?: string;
    title?: string;
    description?: string;
    points?: ServiceWhyPoint[];
}

export interface ServiceBenefitPoint {
    icon?: string;
    title: string;
    description: string;
}

export interface ServiceBenefitsData {
    tagline?: string;
    title?: string;
    description?: string;
    points?: ServiceBenefitPoint[];
}

export interface ServiceApproachStep {
    icon?: string;
    title: string;
    description: string;
}

export interface ServiceKPIItem {
    icon?: string;
    value: string;
    description?: string;
    tagline?: string;
}

export interface ServiceKPICategory {
    name: string;
    /** Group label shipped alongside `name`; preferred for the row heading when present. */
    kpiCategory?: string;
    content: ServiceKPIItem[];
}

export interface ServiceKPIs {
    badge?: string;
    kpiCategory?: ServiceKPICategory[];
}

export interface ServiceTool {
    icon?: string;
    /** Card heading. */
    value?: string;
    description?: string;
    /** Category label repeated on every item; only a heading fallback. */
    tagline?: string;
}

export interface ServiceTools {
    badge?: string;
    description?: string;
    content?: ServiceTool[];
    cta?: {
        title: string;
        descp?: string;
    };
}

export interface ServiceApproachData {
    tagline?: string;
    title?: string;
    description?: string;
    steps?: ServiceApproachStep[];
    kpis?: ServiceKPIs;
    tools?: ServiceTools;
}

export interface ServiceAddonCard {
    icon?: string;
    title: string;
    description: string;
}

export interface ServiceHighlightPoint {
    icon?: string;
    value: string;
    descp: string;
}

export interface ServiceHighlight {
    tagline?: string;
    title?: string;
    description?: string;
    points?: ServiceHighlightPoint[];
    cta?: string;
}

export interface ServiceAddonContentPoint {
    icon?: string;
    point: string;
}

export interface ServiceAddonContent {
    tagline?: string;
    title?: string;
    description?: string;
    points?: ServiceAddonContentPoint[];
}

export interface ServiceAddonsData {
    tagline?: string;
    title?: string;
    description?: string;
    cards?: ServiceAddonCard[];
    content?: ServiceAddonContent;
    highlight?: ServiceHighlight;
    cta?: {
        title: string;
        descp?: string;
    };
}

export interface ServiceFAQItem {
    title: string;
    description: string;
}

export interface ServiceFAQs {
    tagline?: string;
    title?: string;
    description?: string;
    accordions?: ServiceFAQItem[];
}

export interface ServiceSectionHTML {
    title?: string;
    value?: string;
}

export interface ServiceData {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string | string[];
    ogImage?: string;
    metaRobots?: any;
    ogTitle?: string;
    ogDescription?: string;
    serviceCategory?: ServiceCategoryRef;
    servicecard?: ServiceCard;
    banner?: ServiceBanner;
    servicestats?: ServiceStatItem[];
    whyservice?: ServiceWhyChooseUsData;
    benefits?: ServiceBenefitsData;
    approach?: ServiceApproachData;
    addons?: ServiceAddonsData;
    faqs?: ServiceFAQs;
    bottomSection?: ServiceSectionHTML;
    internalSection?: ServiceSectionHTML;
    leadmagnet?: ServiceLeadMagnet[];
    strategy?: ServiceStrategy;
    whyopt?: ServiceStrategy;
    business?: ServiceStrategy;
}

export interface ServiceStrategyPoint {
    icon?: string;
    title: string;
    description: string;
}

export interface ServiceStrategyStat {
    icon?: string;
    value: string;
    description: string;
    tagline?: string;
}

export interface ServiceStrategy {
    tagline?: string;
    title?: string;
    description?: string;
    points?: ServiceStrategyPoint[];
    stats?: ServiceStrategyStat[];
    cta?: string;
    /** Either a bare URL string or a media object; may point at an image or a video. */
    media?: string | ServiceMedia;
    video?: string | ServiceMedia;
}

export interface ServiceLeadMagnet {
    _id: string;
    name: string;
    uid: string;
    broucher?: {
        _id: string;
        alt: string;
        url: string;
        thumbnail?: string;
    };
}
