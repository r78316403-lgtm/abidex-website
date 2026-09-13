// =====================================================================
// SITE CONFIG — single source of truth for business info & brand
// ---------------------------------------------------------------------
// Replace placeholders below with real values. Everything in the
// UI that references business info reads from this file so changes
// here propagate everywhere automatically.
// =====================================================================

export const siteConfig = {
  // --- Brand ---
  name: "Mercato",
  tagline: "Considered goods for everyday life",
  description:
    "Mercato is a modern general store for people who care about quality. We curate electronics, fashion, home goods, and accessories from makers who treat their craft well.",
  url: "https://your-store.com", // ← replace with your domain

  // --- Contact ---
  contact: {
    email: "hello@your-store.com", // ← replace
    phone: "+1 (555) 012-3456", // ← replace
    whatsapp: "+15550123456", // ← replace (international format, no +)
    address: "123 Market Street, Suite 200, Your City, YC 12345", // ← replace
    hours: "Mon-Fri 9am-6pm, Sat 10am-4pm",
  },

  // --- Social ---
  social: {
    instagram: "https://instagram.com/yourstore",
    twitter: "https://twitter.com/yourstore",
    facebook: "https://facebook.com/yourstore",
    youtube: "https://youtube.com/@yourstore",
    pinterest: "https://pinterest.com/yourstore",
  },

  // --- Currency ---
  currency: {
    code: "USD",
    symbol: "$",
    position: "before" as "before" | "after",
  },

  // --- Shipping ---
  shipping: {
    freeThreshold: 50, // orders above this get free standard shipping
    standardRate: 5.99,
    expressRate: 19.99,
  },

  // --- Payment ---
  // Reads from env. Provider is auto-selected from PAYMENT_PROVIDER env var.
  payment: {
    provider: (process.env.PAYMENT_PROVIDER ?? "stripe") as
      | "stripe"
      | "paystack"
      | "flutterwave"
      | "cod",
    // Public keys (safe to expose in frontend). Set in .env:
    //   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    //   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
    //   NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY
  },

  // --- Google Sheets ---
  // Set in .env: GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY,
  // GOOGLE_SHEETS_SPREADSHEET_ID, GOOGLE_SHEETS_RANGE (default: "Orders!A:T")
  googleSheets: {
    enabled: Boolean(process.env.GOOGLE_SHEETS_SPREADSHEET_ID),
  },

  // --- Legal / Footer ---
  legal: {
    registrationYear: 2024,
    legalName: "Mercato Retail Ltd.",
  },
} as const;

export type SiteConfig = typeof siteConfig;

// Helper to format currency consistently across the site.
export function formatPrice(amount: number, opts?: { currency?: string }): string {
  const cfg = siteConfig.currency;
  const currency = opts?.currency ?? cfg.code;
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  });
  const formatted = formatter.format(amount);
  if (cfg.position === "before") return formatted;
  return formatted.replace(currency, "").trim() + " " + currency;
}
