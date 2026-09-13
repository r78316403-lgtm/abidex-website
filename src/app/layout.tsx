import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://your-store.com"),
  title: {
    default: "Mercato — Considered goods for everyday life",
    template: "%s | Mercato",
  },
  description:
    "A modern general store for people who care about quality. Shop electronics, fashion, home goods, and accessories from makers who treat their craft well.",
  keywords: [
    "online store", "ecommerce", "electronics", "fashion", "home goods",
    "beauty", "accessories", "sports", "outdoor", "Mercato",
  ],
  authors: [{ name: "Mercato" }],
  openGraph: {
    title: "Mercato — Considered goods for everyday life",
    description:
      "A modern general store for people who care about quality. Shop electronics, fashion, home goods, and accessories.",
    url: "https://your-store.com",
    siteName: "Mercato",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mercato — Considered goods for everyday life",
    description: "A modern general store for people who care about quality.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
};

export const viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <Providers>{children}</Providers>
        <Toaster />
        <SonnerToaster position="bottom-right" />
      </body>
    </html>
  );
}
