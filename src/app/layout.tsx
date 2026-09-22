import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { siteConfig } from "@/lib/site-config";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Abidex",
  jobTitle: "AI & Automation Specialist",
  url: siteConfig.url,
  email: siteConfig.contact.email,
  knowsAbout: [
    "AI Agents", "Business Automation", "WhatsApp Automation", "CRM Automation",
    "GoHighLevel", "AI Chatbots", "Website Design", "AI Voice Agents", "AI Video",
  ],
  description: siteConfig.description,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "Abidex | AI & Automation Specialist",
  description:
    "Abidex builds AI agents, business automation systems, CRM workflows, WhatsApp automation, websites, and AI-powered digital solutions for businesses.",
  keywords: [
    "Abidex", "AI Automation Specialist", "AI agents", "business automation",
    "WhatsApp automation", "CRM automation", "GoHighLevel", "AI chatbots",
    "AI voice agents", "AI video", "website design", "workflow automation",
    "lead generation", "sales automation", "AI consultant Nigeria",
  ],
  authors: [{ name: "Abidex" }],
  creator: "Abidex",
  applicationName: "Abidex",
  openGraph: {
    title: "Abidex | AI & Automation Specialist",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "Abidex",
    type: "profile",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abidex | AI & Automation Specialist",
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
  themeColor: "#27282b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={nunito.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${nunito.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
      >
        {children}
        <Toaster />
        <SonnerToaster position="bottom-right" />
      </body>
    </html>
  );
}
