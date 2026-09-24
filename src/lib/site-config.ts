// =====================================================================
// ABIDEX — SITE CONFIG
// Private Literary Society & Managed Reader Experience
// =====================================================================

export const siteConfig = {
  name: "Abidex",
  legalName: "Abidex",
  tagline: "A Private Literary Society & Managed Reader Experience",
  subtitle: "Where Intellectual Curiosity Meets Companionable Consideration.",
  description:
    "Abidex is a private literary society connecting independent authors with an engaged global reading community through a structured, year-long literary experience. Established 2010.",
  url: "https://abidex.com", // ← replace with real domain when deployed
  shortBio:
    "Uncovering meaningful ingredients in overlooked places. We connect brilliant independent authors with an elite global reading community for a structured, year-long journey of deep literary engagement.",
  established: 2010,

  // --- Contact (real details) ---
  contact: {
    email: "profabiolabukclub@gmail.com",
    whatsapp: "2347037568457",
    whatsappDisplay: "+234 703 756 8457",
    telegram: "ahmedabiola",
    telegramDisplay: "@ahmedabiola",
    telegramUrl: "https://t.me/ahmedabiola",
  },

  // --- Social ---
  social: {
    whatsapp: "https://wa.me/2347037568457",
    telegram: "https://t.me/ahmedabiola",
    email: "mailto:profabiolabukclub@gmail.com",
  },

  copyrightYear: 2001,
} as const;

export type SiteConfig = typeof siteConfig;

// --- Deep-link helpers ---
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${siteConfig.contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function telegramLink(): string {
  return siteConfig.contact.telegramUrl;
}

export function emailLink(subject?: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const qs = params.toString();
  return `mailto:${siteConfig.contact.email}${qs ? `?${qs}` : ""}`;
}

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hello Abidex, I found your website and I'd like to connect with the Selection Committee.";

export const DEFAULT_EMAIL_SUBJECT = "Committee Consideration — Abidex";
