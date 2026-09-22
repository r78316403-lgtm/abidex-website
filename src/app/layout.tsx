import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { siteConfig } from "@/lib/site-config";
import {
  organizationSchema,
  websiteSchema,
  storeSchema,
} from "@/lib/structured-data";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = siteConfig.url;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "KEDI Healthcare — Herbal Medicine, Vitamins & Wellness Equipment in Nigeria",
    template: "%s | KEDI Healthcare Nigeria",
  },
  description:
    "Shop quality KEDI Healthcare herbal medicines, vitamins & supplements, and wellness equipment in Nigeria. NAFDAC-registered products, Paystack payment, nationwide delivery. Open up to a new life with KEDI.",
  keywords: [
    "KEDI Healthcare", "KEDI Nigeria", "herbal medicine Nigeria", "Chinese herbal medicine",
    "Reishi capsules", "Cordyceps", "Vigor Essential", "Eve's Care", "Golden Six",
    "herbal products Lagos", "vitamins Nigeria", "supplements Nigeria",
    "NAFDAC registered products", "blood circulation massager", "wellness equipment Nigeria",
    "distributor opportunity Nigeria", "KEDI distributor", "herbal store Nigeria",
    "buy herbal medicine online Nigeria", "natural health products Nigeria",
  ],
  authors: [{ name: "KEDI Healthcare Ind. Nig. Ltd." }],
  creator: "KEDI Healthcare Ind. Nig. Ltd.",
  publisher: "KEDI Healthcare Ind. Nig. Ltd.",
  category: "Health",
  applicationName: "KEDI Healthcare",
  formatDetection: { telephone: true, email: true, address: true },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.png"],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "KEDI Healthcare — Open Up To A New Life",
    description:
      "Quality herbal products, wellness solutions, and rewarding business opportunities. KEDI Brings You Health, Wealth, and Happiness! NAFDAC-registered, nationwide delivery in Nigeria.",
    url: siteUrl,
    siteName: "KEDI Healthcare",
    type: "website",
    locale: "en_NG",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KEDI Healthcare — Open Up To A New Life",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KEDI Healthcare — Open Up To A New Life",
    description:
      "Quality herbal products, wellness solutions, and rewarding business opportunities. NAFDAC-registered, nationwide delivery in Nigeria.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: { "en-NG": "/", en: "/" },
  },
  verification: siteConfig.seo.googleSiteVerification
    ? { google: siteConfig.seo.googleSiteVerification }
    : undefined,
  other: {
    "msvalidate.01": siteConfig.seo.googleSiteVerification || undefined,
  },
};

export const viewport = {
  themeColor: "#1f5a3e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// JSON-LD structured data for the whole site
const jsonLd = [
  organizationSchema(),
  websiteSchema(),
  storeSchema(),
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" suppressHydrationWarning>
      <head>
        {/* JSON-LD structured data for Google rich results */}
        {jsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}

        {/* Google Search Console verification (if configured) */}
        {siteConfig.seo.googleSiteVerification && (
          <meta
            name="google-site-verification"
            content={siteConfig.seo.googleSiteVerification}
          />
        )}

        {/* Google Analytics 4 (if configured) */}
        {siteConfig.seo.googleAnalyticsId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.seo.googleAnalyticsId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${siteConfig.seo.googleAnalyticsId}', {
                    page_location: window.location.href,
                    page_title: document.title,
                  });
                `,
              }}
            />
          </>
        )}

        {/* Google Tag Manager (if configured) */}
        {siteConfig.seo.gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${siteConfig.seo.gtmId}');
              `,
            }}
          />
        )}

        {/* Meta Pixel (if configured) */}
        {siteConfig.seo.metaPixelId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${siteConfig.seo.metaPixelId}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        {/* Google Tag Manager noscript fallback */}
        {siteConfig.seo.gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${siteConfig.seo.gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <Providers>{children}</Providers>
        <Toaster />
        <SonnerToaster position="bottom-right" />
      </body>
    </html>
  );
}
