"use client";

// =====================================================================
// FOOTER — ABIDEX brand, links, contact, copyright
// =====================================================================

import {
  siteConfig,
  whatsappLink,
  telegramLink,
  emailLink,
  DEFAULT_WHATSAPP_MESSAGE,
  DEFAULT_EMAIL_SUBJECT,
} from "@/lib/site-config";
import { MessageCircle, Send, Mail, Sparkles } from "lucide-react";

const FOOTER_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-border bg-muted">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <Sparkles className="h-4 w-4 text-white" />
              </span>
              <span className="font-bold text-xl tracking-tight">ABIDEX</span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-3">
              {siteConfig.tagline}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {siteConfig.shortBio}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Navigate
            </h4>
            <ul className="grid grid-cols-2 gap-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
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
              Get in Touch
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-emerald-400 transition-colors"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  <span>WhatsApp · {siteConfig.contact.whatsappDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={telegramLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-sky-400 transition-colors"
                >
                  <Send className="h-4 w-4 shrink-0" />
                  <span>Telegram · {siteConfig.contact.telegramDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={emailLink(DEFAULT_EMAIL_SUBJECT)}
                  className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors break-all"
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
          <p>© {siteConfig.copyrightYear} Abidex. All rights reserved.</p>
          <p className="text-[10px] uppercase tracking-widest">
            AI • AUTOMATION • DIGITAL SYSTEMS
          </p>
        </div>
      </div>
    </footer>
  );
}
