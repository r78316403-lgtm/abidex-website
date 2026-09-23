"use client";

// =====================================================================
// CONTACT — WhatsApp / Telegram / Email cards + form link
// =====================================================================

import { Section, HeadingBlock } from "@/components/booking/ui-helpers";
import {
  siteConfig, whatsappLink, telegramLink, emailLink,
  DEFAULT_WHATSAPP_MESSAGE, DEFAULT_EMAIL_SUBJECT,
} from "@/lib/site-config";
import { MessageCircle, Send, Mail, ArrowRight } from "lucide-react";

export function Contact() {
  return (
    <Section id="contact" alt>
      <HeadingBlock
        eyebrow="Contact"
        title={<>We're Here <span className="italic text-primary">to Help</span></>}
        lead="Pick the channel that works best for you. We typically respond within a few hours during business hours."
      />

      <div className="grid sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
        {/* WhatsApp */}
        <ContactCard
          icon={MessageCircle}
          accent="bg-emerald-50 border-emerald-200"
          iconColor="text-emerald-700"
          label="WhatsApp"
          value={siteConfig.contact.whatsappDisplay}
          cta="Chat on WhatsApp"
          href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
          external
        />
        {/* Telegram */}
        <ContactCard
          icon={Send}
          accent="bg-sky-50 border-sky-200"
          iconColor="text-sky-700"
          label="Telegram"
          value={siteConfig.contact.telegramDisplay}
          cta="Chat on Telegram"
          href={telegramLink()}
          external
        />
        {/* Email */}
        <ContactCard
          icon={Mail}
          accent="bg-primary/5 border-primary/20"
          iconColor="text-primary"
          label="Email"
          value={siteConfig.contact.email}
          cta="Send an Email"
          href={emailLink(DEFAULT_EMAIL_SUBJECT)}
        />
      </div>
    </Section>
  );
}

function ContactCard({
  icon: Icon, accent, iconColor, label, value, cta, href, external,
}: {
  icon: any;
  accent: string;
  iconColor: string;
  label: string;
  value: string;
  cta: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`group p-6 rounded-2xl border ${accent} transition-all hover:shadow-lg`}
    >
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-card border border-border/60 mb-4">
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">
        {label}
      </p>
      <p className="text-sm font-semibold mb-3 break-all">{value}</p>
      <p className={`text-sm font-medium ${iconColor} inline-flex items-center gap-1.5 group-hover:gap-2 transition-all`}>
        {cta}
        <ArrowRight className="h-3.5 w-3.5" />
      </p>
    </a>
  );
}
