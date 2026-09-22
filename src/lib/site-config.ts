// =====================================================================
// SITE CONFIG — KEDI HEALTHCARE
// ---------------------------------------------------------------------
// Single source of truth for business info, brand, currency, shipping,
// and payment provider. Edit values here; they propagate everywhere.
// =====================================================================

export const siteConfig = {
  // --- Brand ---
  name: "KEDI Healthcare",
  legalName: "KEDI HEALTHCARE IND. NIG. LTD.",
  tagline: "Open Up To A New Life With KEDI",
  slogan: "KEDI Brings You Health, Wealth, and Happiness!",
  description:
    "KEDI Healthcare is a leading health and wellness company committed to improving lives through quality herbal products, wellness solutions, and rewarding business opportunities that support healthier communities across Nigeria and beyond.",
  url: "https://www.kedihealth.com",
  founder: "Mr. William Zhao",
  founderTitle: "Founder / Chairman",

  // --- Contact (REAL DETAILS) ---
  contact: {
    email: "isiaqmusa123456abc@gmail.com",
    phone: "+234 916 208 0741",
    whatsapp: "2349162080741",                     // international format, no +
    whatsappDisplay: "+234 916 208 0741",
    telegram: "ahmedabiola",                        // username without @
    telegramDisplay: "@ahmedabiola",
    telegramUrl: "https://t.me/ahmedabiola",
    address: "KEDI Healthcare Ind. Nig. Ltd., Lagos, Nigeria",
    hours: "Mon-Fri 9am to 5pm",
  },

  // --- Social ---
  social: {
    facebook: "https://facebook.com/kedihealthcare",
    instagram: "https://instagram.com/kedihealthcare",
    twitter: "https://twitter.com/kedihealthcare",
    youtube: "https://youtube.com/@kedihealthcare",
    linkedin: "https://linkedin.com/company/kedi-healthcare",
    telegram: "https://t.me/ahmedabiola",
    whatsapp: "https://wa.me/2349162080741",
  },

  // --- Currency ---
  currency: {
    code: "NGN",
    symbol: "₦",
    position: "before" as "before" | "after",
  },

  // --- Shipping ---
  shipping: {
    freeThreshold: 50000,
    standardRate: 2500,
    expressRate: 5500,
  },

  // --- Payment ---
  payment: {
    provider: (process.env.PAYMENT_PROVIDER ?? "paystack") as
      | "stripe"
      | "paystack"
      | "flutterwave"
      | "cod",
  },

  // --- Google Sheets ---
  googleSheets: {
    enabled: Boolean(process.env.GOOGLE_SHEETS_SPREADSHEET_ID),
  },

  // --- Legal / Footer ---
  legal: {
    registrationYear: 2005,
    legalName: "KEDI HEALTHCARE IND. NIG. LTD.",
  },

  // --- KEDI-specific programs ---
  programs: {
    fiveYearPlan: "2024 – 2028",
    carAwardYear: "2026",
  },

  // --- SEO / Analytics ---
  // Set these in .env to enable tracking
  seo: {
    googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION ?? "",
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "",
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
    gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "",
  },
} as const;

export type SiteConfig = typeof siteConfig;

// Helper to format currency consistently across the site.
export function formatPrice(amount: number, opts?: { currency?: string }): string {
  const cfg = siteConfig.currency;
  const currency = opts?.currency ?? cfg.code;
  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
  return formatter.format(amount);
}

// Pre-built WhatsApp deep link with prefilled message
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${siteConfig.contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// Pre-built Telegram deep link
export function telegramLink(): string {
  return siteConfig.contact.telegramUrl;
}

// Pre-built mailto link
export function emailLink(subject?: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const qs = params.toString();
  return `mailto:${siteConfig.contact.email}${qs ? `?${qs}` : ""}`;
}
