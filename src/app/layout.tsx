import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { siteConfig } from "@/lib/site-config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  email: siteConfig.contact.email,
  foundingDate: String(siteConfig.established),
  knowsAbout: ["Literary Society", "Independent Authors", "Reader Experience", "Cultural Curation"],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "Abidex | Private Literary Society & Managed Reader Experience",
  description: siteConfig.description,
  keywords: [
    "Abidex", "literary society", "independent authors", "reader experience",
    "book reviews", "managed reader experience", "private literary club",
    "selection committee", "cultural curation", "literary residency",
  ],
  authors: [{ name: "Abidex" }],
  creator: "Abidex",
  applicationName: "Abidex",
  openGraph: {
    title: "Abidex | Private Literary Society & Managed Reader Experience",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "Abidex",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abidex | Private Literary Society",
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
};

export const viewport = {
  themeColor: "#F8F4ED",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen">
        {children}
        <Toaster />
        <SonnerToaster position="bottom-right" />
      </body>
    </html>
  );
}
