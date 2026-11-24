import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import GlassBackground from "@/components/GlassBackground";
import { ToastProvider } from "@/components/ui/generic/ToastContext";
import { LeadModalProvider } from "@/../context/LeadModalContext";
import { fetchFromBackend } from "@/lib/apiProxy";
import DynamicScripts from "@/lib/DynamicScripts";
import GeoLocationInitializer from "@/../context/GeoLocationInitializer";
import Ribbons, { type RibbonResponse } from "@/components/ui/others/Ribbons";
import { AssetProtectionProvider } from "@/components/security/AssetProtectionProvider";
import type { ServiceCategory } from "@/components/ui/navigation-types";

// const LeadPopup = dynamic(() => import("@/components/LeadPopup"));
const LeadModal = dynamic(() => import("@/components/forms/LeadModal"));
const ExitIntentPopup = dynamic(() => import("@/components/forms/ExitIntentPopup"));

async function getRibbons(): Promise<RibbonResponse | null> {
  try {
    const res = await fetchFromBackend('/ribbons?active=true', { next: { revalidate: false, tags: ['ribbons'] } });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error fetching ribbons:', error);
    return null;
  }
}

async function getNavCategories(): Promise<ServiceCategory[]> {
  try {
    const res = await fetchFromBackend('/service-categories?select=_id,name,slug,services,order,orderId', {
      next: { revalidate: false, tags: ['service-categories'] },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.data || []);
  } catch (error) {
    console.error('Error fetching nav categories:', error);
    return [];
  }
}
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bristofurniture.com";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  "name": "Bristo Furniture",
  "url": siteUrl,
  "logo": `${siteUrl}/logolight.png`,
  "image": `${siteUrl}/og-image.jpg`,
  "email": "sales@bristofurniture.com",
  "telephone": "+91-97369-61414",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Siddha Reddy Layout, Kudlu Main Road, Hosur Road, Singasandra",
    "addressLocality": "Bengaluru",
    "addressRegion": "Karnataka",
    "postalCode": "560068",
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-97369-61414",
    "contactType": "sales",
    "areaServed": "IN",
    "availableLanguage": ["English", "Kannada", "Telugu", "Tamil", "Hindi", "Malayalam"]
  }
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  "@id": `${siteUrl}/#store`,
  "name": "Bristo Furniture",
  "url": siteUrl,
  "logo": `${siteUrl}/logolight.png`,
  "image": `${siteUrl}/og-image.jpg`,
  "telephone": "+91-97369-61414",
  "email": "sales@bristofurniture.com",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Siddha Reddy Layout, Kudlu Main Road, Hosur Road, Singasandra",
    "addressLocality": "Bengaluru",
    "postalCode": "560068",
    "addressCountry": "IN",
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "691",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Rajesh Kumar" },
      "datePublished": "2024-11-15",
      "reviewBody": "Outstanding quality modular office workstations and timely delivery across Bangalore.",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      }
    },
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Priya Sharma" },
      "datePublished": "2024-12-01",
      "reviewBody": "Ergonomic seating and custom desk configurations built to perfection for our corporate space.",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      }
    }
  ]
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Bristo Furniture | Premium Corporate & Commercial Furniture Solutions",
    template: "%s | Bristo Furniture",
  },
  description: "Custom workstations, ergonomic seating, and enterprise office fit-outs engineered for modern commercial spaces. Precision craftsmanship, space planning, and turnkey installation for corporate clients.",
  robots: 'index, follow',
  openGraph: {
    type: "website",
    siteName: "Bristo Furniture",
    title: "Bristo Furniture | Premium Corporate & Commercial Furniture Solutions",
    description: "Custom workstations, ergonomic seating, and enterprise office fit-outs engineered for modern commercial spaces.",
    url: siteUrl,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Bristo Furniture" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bristo Furniture | Premium Corporate & Commercial Furniture Solutions",
    description: "Custom workstations, ergonomic seating, and enterprise office fit-outs engineered for modern commercial spaces.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
  manifest: "/site.webmanifest",
};

const RICH_TEXT_CSS =
  process.env.NEXT_PUBLIC_RICH_TEXT_CSS ||
  "https://cloud-storage.skilldeck.net/static/editor/skilldeck-rich-text.min.css";

const RICH_TEXT_CDN_ORIGIN = (() => {
  try {
    return new URL(RICH_TEXT_CSS).origin;
  } catch {
    return "https://cloud-storage.skilldeck.net";
  }
})();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [response, navCategories] = await Promise.all([
    getRibbons(),
    getNavCategories(),
  ]);

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <meta name="msvalidate.01" content="DFD0A5AB4C2B5378644098490BA49998" />
        <link rel="preconnect" href={RICH_TEXT_CDN_ORIGIN} crossOrigin="" />
        <link rel="stylesheet" href={RICH_TEXT_CSS} />
      </head>
      <body className="min-h-full flex flex-col font-sans selection:bg-[#C5A880] selection:text-white relative">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationSchema, localBusinessSchema]) }}
        />
        <DynamicScripts />
        <ToastProvider>
          <LeadModalProvider>
            <AssetProtectionProvider>
              <GeoLocationInitializer />
              <GlassBackground />
              <div className="bg-primary-600">
                <Ribbons type="header" response={response} />
              </div>
              <div className="relative z-10 flex flex-col min-h-full">
                <Header categories={navCategories} />
                {children}
                <Footer />
              </div>

              <div className={`bg-[#0c2015] border-t border-white/5 py-3.5 text-center z-10
               ${response?.data?.find(r => r.Type === 'footer' && r.isActive) ? 'mb-5' : 'mb-0'}`}>
                <p className="text-xs text-white/50 font-medium tracking-wide">
                  Built on{' '}
                  <a
                    href="https://skilldeck.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-light font-semibold hover:underline"
                  >
                    SkillDeck
                  </a>{' '}
                  and Marketing by{' '}
                  <a
                    href="https://kandradigital.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-light font-semibold hover:underline"
                  >
                    KandraDigital
                  </a>
                </p>
              </div>

              <WhatsAppWidget raised={!!response?.data?.find(r => r.Type === 'footer' && r.isActive)} />
              <LeadModal />
              <ExitIntentPopup />
              {/* <LeadPopup /> */}
            </AssetProtectionProvider>
          </LeadModalProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
