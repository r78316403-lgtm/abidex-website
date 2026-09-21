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
  metadataBase: new URL("https://www.kedihealth.com"),
  title: {
    default: "KEDI Healthcare — Open Up To A New Life",
    template: "%s | KEDI Healthcare",
  },
  description:
    "KEDI Healthcare is a leading Nigerian health and wellness company offering quality herbal products, vitamins & supplements, and wellness equipment. Open up to a new life with KEDI.",
  keywords: [
    "KEDI Healthcare", "herbal medicine", "Chinese herbs", "vitamins", "supplements",
    "wellness", "Nigeria", "Reishi", "Cordyceps", "Vigor Essential", "herbal products",
    "NAFDAC registered", "distributor opportunity",
  ],
  authors: [{ name: "KEDI Healthcare Ind. Nig. Ltd." }],
  openGraph: {
    title: "KEDI Healthcare — Open Up To A New Life",
    description:
      "Quality herbal products, wellness solutions, and rewarding business opportunities. KEDI Brings You Health, Wealth, and Happiness!",
    url: "https://www.kedihealth.com",
    siteName: "KEDI Healthcare",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KEDI Healthcare — Open Up To A New Life",
    description: "Quality herbal products, wellness solutions, and rewarding business opportunities.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
};

export const viewport = {
  themeColor: "#1f5a3e",
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
