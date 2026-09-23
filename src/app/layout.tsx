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
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  email: siteConfig.contact.email,
  telephone: siteConfig.contact.whatsappDisplay,
  areaServed: "NG",
  availableChannel: {
    "@type": "OnlineChannel",
    url: siteConfig.url,
    serviceUrl: `${siteConfig.url}/#book`,
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "reservations",
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.whatsappDisplay,
    availableLanguage: ["English"],
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "As Reference | Book Your Appointment Online",
  description:
    "Book your appointment or service with As Reference. Explore available services, choose a convenient time, and connect with our team.",
  keywords: [
    "As Reference", "book appointment", "online booking", "schedule appointment",
    "reservation", "booking platform", "appointment booking Nigeria",
    "professional services booking", "easy scheduling",
  ],
  authors: [{ name: "As Reference" }],
  creator: "As Reference",
  applicationName: "As Reference",
  openGraph: {
    title: "As Reference | Book Your Appointment Online",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "As Reference",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "As Reference | Book Your Appointment Online",
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
