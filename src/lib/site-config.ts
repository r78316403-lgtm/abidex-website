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

  // --- Contact ---
  contact: {
    email: "info@kedihealth.com",                  // ← replace with real
    phone: "+234 (0) 803 314 8333",                // ← replace with real
    whatsapp: "2348033148333",                     // ← international format, no +
    address: "KEDI Healthcare Ind. Nig. Ltd., Lagos, Nigeria",  // ← replace with full address
    hours: "Mon-Fri 9am to 5pm",
  },

  // --- Social ---
  social: {
    facebook: "https://facebook.com/kedihealthcare",
    instagram: "https://instagram.com/kedihealthcare",
    twitter: "https://twitter.com/kedihealthcare",
    youtube: "https://youtube.com/@kedihealthcare",
    linkedin: "https://linkedin.com/company/kedi-healthcare",
  },

  // --- Currency ---
  // KEDI is Nigerian — default currency is Naira. Customers can still
  // see approximate USD equivalents by enabling multi-currency later.
  currency: {
    code: "NGN",
    symbol: "₦",
    position: "before" as "before" | "after",
  },

  // --- Shipping ---
  shipping: {
    freeThreshold: 50000,   // ₦50,000 — orders above get free shipping
    standardRate: 2500,     // ₦2,500 standard nationwide
    expressRate: 5500,      // ₦5,500 express / next-day
  },

  // --- Payment ---
  // Paystack & Flutterwave are the dominant Nigerian gateways.
  // Set PAYMENT_PROVIDER in .env to "paystack" or "flutterwave".
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
    registrationYear: 2005,   // KEDI started in Nigeria around 2005/2006
    legalName: "KEDI HEALTHCARE IND. NIG. LTD.",
  },

  // --- KEDI-specific programs ---
  // surfaced in the homepage and footer for brand alignment
  programs: {
    fiveYearPlan: "2024 – 2028",
    carAwardYear: "2026",
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
    maximumFractionDigits: 0,   // Naira typically has no kobo in retail
    minimumFractionDigits: 0,
  });
  return formatter.format(amount);
}
