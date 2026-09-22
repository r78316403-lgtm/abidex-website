"use client";

// =====================================================================
// CONTACT / FINAL CTA — high-converting closing section
// =====================================================================

import { Button } from "@/components/ui/button";
import { Section } from "@/components/portfolio/ui-helpers";
import {
  whatsappLink,
  telegramLink,
  emailLink,
  DEFAULT_WHATSAPP_MESSAGE,
  DEFAULT_EMAIL_SUBJECT,
  siteConfig,
} from "@/lib/site-config";
import { MessageCircle, Send, Mail, ArrowRight } from "lucide-react";

export function Contact() {
  return (
    <Section id="contact" className="relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] bg-glow-blue rounded-full -z-10" />
      <div className="absolute inset-0 bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] -z-10" />

      <div className="max-w-4xl mx-auto text-center">
        {/* Headline */}
        <h2 className="font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1]">
          Ready to Build <span className="text-gradient">Something Smarter?</span>
        </h2>

        <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Tell me what you want to automate, improve, or build, and let&apos;s explore the
          right solution for your business.
        </p>

        {/* Primary CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            className="group bg-emerald-600 hover:bg-emerald-500 text-white"
            asChild
          >
            <a
              href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat on WhatsApp
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </Button>

          <Button size="lg" variant="outline" asChild>
            <a href={emailLink(DEFAULT_EMAIL_SUBJECT)}>
              <Mail className="h-4 w-4 mr-2" />
              Send an Email
            </a>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-sky-500/40 hover:bg-sky-500/10 hover:text-sky-400"
            asChild
          >
            <a href={telegramLink()} target="_blank" rel="noopener noreferrer">
              <Send className="h-4 w-4 mr-2" />
              Message on Telegram
            </a>
          </Button>
        </div>

        {/* Contact info cards */}
        <div className="mt-12 grid sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
          <ContactInfoCard
            icon={MessageCircle}
            label="WhatsApp"
            value={siteConfig.contact.whatsappDisplay}
            href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
            accent="text-emerald-400"
            border="hover:border-emerald-500/50"
          />
          <ContactInfoCard
            icon={Send}
            label="Telegram"
            value={siteConfig.contact.telegramDisplay}
            href={telegramLink()}
            accent="text-sky-400"
            border="hover:border-sky-500/50"
          />
          <ContactInfoCard
            icon={Mail}
            label="Email"
            value={siteConfig.contact.email}
            href={emailLink(DEFAULT_EMAIL_SUBJECT)}
            accent="text-primary"
            border="hover:border-primary/50"
          />
        </div>
      </div>
    </Section>
  );
}

function ContactInfoCard({
  icon: Icon,
  label,
  value,
  href,
  accent,
  border,
}: {
  icon: any;
  label: string;
  value: string;
  href: string;
  accent: string;
  border: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className={`group p-4 rounded-xl border border-border bg-card ${border} transition-colors text-left`}
    >
      <Icon className={`h-5 w-5 ${accent} mb-2`} />
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
        {label}
      </p>
      <p className="text-sm font-medium break-all">{value}</p>
    </a>
  );
}
