// =====================================================================
// ABIDEX — SITE CONFIG
// AI & Automation Specialist personal portfolio
// =====================================================================

export const siteConfig = {
  name: "Abidex",
  legalName: "Abidex",
  tagline: "AI • AUTOMATION • DIGITAL SYSTEMS",
  role: "AI & Automation Specialist",
  description:
    "Abidex builds AI agents, business automation systems, CRM workflows, WhatsApp automation, websites, and AI-powered digital solutions for businesses.",
  url: "https://abidex.ai", // ← replace with real domain when deployed
  shortBio:
    "Building smarter digital systems with AI, automation, and modern web experiences.",

  // --- Contact (real details) ---
  contact: {
    email: "ahmedabiola2025@gmail.com",
    whatsapp: "2349162080741",                    // international format, no +
    whatsappDisplay: "+234 916 208 0741",
    telegram: "ahmedabiola",
    telegramDisplay: "@ahmedabiola",
    telegramUrl: "https://t.me/ahmedabiola",
  },

  // --- Social (same handles, surfaced as brand presence) ---
  social: {
    whatsapp: "https://wa.me/2349162080741",
    telegram: "https://t.me/ahmedabiola",
    email: "mailto:ahmedabiola2025@gmail.com",
  },

  // --- Year ---
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
  "Hi Abidex, I found your portfolio website and I'd like to discuss a project.";

export const DEFAULT_EMAIL_SUBJECT = "New Project Inquiry — Abidex";

// Build a dynamic WhatsApp message for chatbot lead handoff
export function buildLeadWhatsAppMessage(lead: {
  name?: string;
  business?: string;
  email?: string;
  whatsapp?: string;
  service?: string;
  project?: string;
  budget?: string;
  contactMethod?: string;
}): string {
  const lines = [
    "Hi Abidex, I'd like to discuss a project.",
    "",
    `Name: ${lead.name || "-"}`,
    `Business: ${lead.business || "-"}`,
    `Service: ${lead.service || "-"}`,
    `Project: ${lead.project || "-"}`,
    `Email: ${lead.email || "-"}`,
    `WhatsApp: ${lead.whatsapp || "-"}`,
    `Budget: ${lead.budget || "-"}`,
    `Preferred Contact: ${lead.contactMethod || "-"}`,
  ];
  return lines.join("\n");
}

export function buildLeadEmailBody(lead: {
  name?: string;
  business?: string;
  email?: string;
  whatsapp?: string;
  service?: string;
  project?: string;
  budget?: string;
  contactMethod?: string;
}): string {
  return [
    "Hi Abidex,",
    "",
    "I'd like to discuss a project. Here are my details:",
    "",
    `Name: ${lead.name || "-"}`,
    `Business: ${lead.business || "-"}`,
    `Service needed: ${lead.service || "-"}`,
    `Project description: ${lead.project || "-"}`,
    `Email: ${lead.email || "-"}`,
    `WhatsApp: ${lead.whatsapp || "-"}`,
    `Budget range: ${lead.budget || "-"}`,
    `Preferred contact method: ${lead.contactMethod || "-"}`,
    "",
    "Looking forward to your reply.",
  ].join("\n");
}
