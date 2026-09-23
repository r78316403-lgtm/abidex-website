// =====================================================================
// AS REFERENCE — SITE CONFIG
// Premium booking platform — warm hospitality aesthetic
// =====================================================================

export const siteConfig = {
  name: "As Reference",
  legalName: "As Reference",
  tagline: "Book Your Experience. Your Way.",
  description:
    "Book your appointment or service with As Reference. Explore available services, choose a convenient time, and connect with our team.",
  url: "https://asreference.com", // ← replace with real domain when deployed
  shortBio:
    "Making it easier to discover, schedule, and enjoy exceptional experiences.",

  // --- Contact (real details) ---
  contact: {
    email: "profabiolabukclub@gmail.com",
    whatsapp: "2347037568457",                    // international format, no +
    whatsappDisplay: "+234 703 756 8457",
    telegram: "ahmedabiola",
    telegramDisplay: "@ahmedabiola",
    telegramUrl: "https://t.me/ahmedabiola",
  },

  // --- Social ---
  social: {
    instagram: "https://instagram.com/asreference",
    facebook: "https://facebook.com/asreference",
    tiktok: "https://tiktok.com/@asreference",
    linkedin: "https://linkedin.com/company/asreference",
    whatsapp: "https://wa.me/2347037568457",
    telegram: "https://t.me/ahmedabiola",
    email: "mailto:profabiolabukclub@gmail.com",
  },

  copyrightYear: 2026,
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

// Pre-built prefilled WhatsApp message used by hero & CTAs
export const DEFAULT_WHATSAPP_MESSAGE =
  "Hello As Reference, I found your website and I'd like to make an inquiry/book an appointment.";

export const DEFAULT_EMAIL_SUBJECT = "New Booking Inquiry — As Reference";

// Build a dynamic WhatsApp message for chatbot/booking lead handoff
export function buildBookingWhatsAppMessage(lead: {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
}): string {
  const lines = [
    "Hello As Reference, I'd like to make a booking.",
    "",
    `Name: ${lead.name || "-"}`,
    `Service: ${lead.service || "-"}`,
    `Preferred Date: ${lead.preferredDate || "-"}`,
    `Preferred Time: ${lead.preferredTime || "-"}`,
    `Email: ${lead.email || "-"}`,
    `Phone: ${lead.phone || "-"}`,
    "",
    "Additional Message:",
    lead.message || "-",
  ];
  return lines.join("\n");
}

export function buildBookingEmailBody(lead: {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
}): string {
  return [
    "Hello As Reference,",
    "",
    "I'd like to make a booking. Here are my details:",
    "",
    `Name: ${lead.name || "-"}`,
    `Service: ${lead.service || "-"}`,
    `Preferred Date: ${lead.preferredDate || "-"}`,
    `Preferred Time: ${lead.preferredTime || "-"}`,
    `Email: ${lead.email || "-"}`,
    `Phone: ${lead.phone || "-"}`,
    "",
    "Additional Message:",
    lead.message || "-",
    "",
    "Looking forward to your reply.",
  ].join("\n");
}

// Generate a booking reference number
export function generateBookingReference(): string {
  const ts = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `AR-${ts}-${rand}`;
}
