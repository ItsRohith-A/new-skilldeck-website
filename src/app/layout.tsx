import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  // Every page-level canonical and OG image below is written relative to this;
  // without it Next resolves them against localhost.
  metadataBase: new URL("https://skilldeck.net"),
  title: "Skilldeck — All-in-One Platform for Training Institutes",
  description: "Automate your marketing, sales, and operations. Skilldeck replaces 10+ tools with one powerful platform for training Institutes.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/logos/mainlogo.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
  manifest: "/site.webmanifest",
};

import { FormProvider } from "@/components/Forms/FormContext";
import LeadModal from "@/components/Forms/LeadModal";
import { LeadModalProvider } from "@/components/Forms/LeadModalContext";
import GeoLocationInitializer from "@/components/logic/GeoLocationInitializer";
import RouteProgressBar from "@/components/shared/RouteProgressBar";
import ScrollToTopOnRefresh from "@/components/shared/ScrollToTopOnRefresh";
import { Suspense } from "react";
import DynamicScripts from "@/lib/DynamicScripts";
import UtmTracker from "@/components/shared/UtmTracker";
import Script from "next/script";
import WebVitals from "@/components/shared/WebVitals";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://skilldeck.net/#website",
    "name": "SkillDeck",
    "alternateName": ["Skilldeck", "SkillDeck SaaS", "skilldeck.net"],
    "url": "https://skilldeck.net/",
    "publisher": {
      "@id": "https://skilldeck.net/#organization"
    }
  };

  // The previous site published contact and location details here; the rebuild
  // dropped them down to a name, a logo and one profile link, which is the
  // thinnest an Organization entity can be. Restored so the knowledge-panel
  // fields (address, phone, support channels) have something to read again.
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://skilldeck.net/#organization",
    "name": "SkillDeck",
    "url": "https://skilldeck.net",
    "description":
      "World's 1st Fully Automated Plug & Play Platform For Training Institutes. Automate marketing, sales, operations, LMS, CRM and websites from a single platform.",
    "logo": {
      "@type": "ImageObject",
      "url": "https://skilldeck.net/logos/mainlogo.svg"
    },
    "image": "https://skilldeck.net/logos/mainlogo.svg",
    "email": "hello@skilldeck.net",
    "telephone": "+91-8296494941",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "HSR Layout",
      "addressLocality": "Bengaluru",
      "addressRegion": "Karnataka",
      "postalCode": "560102",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "telephone": "+91-8296494941",
      "email": "hello@skilldeck.net",
      "areaServed": "Global",
      "availableLanguage": ["English", "Hindi", "Kannada", "Telugu"]
    },
    "sameAs": [
      "https://www.linkedin.com/company/skilldeck-software/",
      "https://www.facebook.com/skilldeck",
      "https://twitter.com/skilldeck"
    ]
    // No aggregateRating: a rating a business states about itself is never
    // eligible for stars, and because this node is also referenced by @id from
    // the home page's Review, Google merged it into an Organization with two
    // aggregate ratings — a critical Rich Results error that invalidated it.
  };

  return (
    <html
      lang="en"
      className={`${roboto.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="dns-prefetch" href="https://api.skilldeck.net" />
        <link rel="dns-prefetch" href="https://api64.ipify.org" />
        <link rel="preconnect" href={RICH_TEXT_CDN_ORIGIN} crossOrigin="" />
        <noscript>
          <link rel="stylesheet" href={RICH_TEXT_CSS} />
        </noscript>
        <Script
          id="skilldeck-rich-text-css"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              if (!document.getElementById('skilldeck-rich-text-style')) {
                var l = document.createElement('link');
                l.id = 'skilldeck-rich-text-style';
                l.rel = 'stylesheet';
                l.href = '${RICH_TEXT_CSS}';
                document.head.appendChild(l);
              }
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <WebVitals />
        {/* Disable native scroll restoration before hydration so back/forward
            navigation does not fight ScrollToTopOnRefresh. */}
        <Script id="scroll-restoration" strategy="beforeInteractive">
          {`if('scrollRestoration' in history){history.scrollRestoration='manual';}`}
        </Script>
        <ScrollToTopOnRefresh />
        <DynamicScripts />
        <Suspense fallback={null}>
          <UtmTracker />
          <RouteProgressBar />
        </Suspense>
        <GeoLocationInitializer />
        <FormProvider>
          <LeadModalProvider>
            {children}
            <LeadModal />
          </LeadModalProvider>
        </FormProvider>
      </body>
    </html>
  );
}
