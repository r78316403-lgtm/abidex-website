"use client";

// =====================================================================
// FOOTER — brand, nav, contact, copyright, Est. 2010
// =====================================================================

import {
  siteConfig, whatsappLink, emailLink,
  DEFAULT_WHATSAPP_MESSAGE, DEFAULT_EMAIL_SUBJECT,
} from "@/lib/site-config";
import { AbidexWordmark } from "./logo";
import { navLinks } from "@/lib/literary-data";
import { MessageCircle, Send, Mail } from "lucide-react";

export function Footer() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative bg-secondary/50 border-t border-border">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <AbidexWordmark size={40} showTagline />
            <p className="text-sm text-muted-foreground leading-relaxed mt-4 mb-2 max-w-xs">
              {siteConfig.tagline}.
            </p>
            <p className="text-xs text-muted-foreground italic">
              {siteConfig.subtitle}
            </p>
            <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold mt-4">
              Established {siteConfig.established}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-sm text-foreground/80 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Connect With Us
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-foreground/80 hover:text-emerald-700 transition-colors"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  <span>WhatsApp · {siteConfig.contact.whatsappDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.contact.telegramUrl}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-foreground/80 hover:text-sky-700 transition-colors"
                >
                  <Send className="h-4 w-4 shrink-0" />
                  <span>Telegram · {siteConfig.contact.telegramDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={emailLink(DEFAULT_EMAIL_SUBJECT)}
                  className="flex items-center gap-2.5 text-sm text-foreground/80 hover:text-primary transition-colors break-all"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>{siteConfig.contact.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {siteConfig.copyrightYear} {siteConfig.name}. All Rights Reserved.</p>
          <p className="italic">{siteConfig.tagline}.</p>
        </div>
      </div>
    </footer>
  );
}
