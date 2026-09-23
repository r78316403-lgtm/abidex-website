"use client";

// =====================================================================
// FOOTER — brand, nav, support, contact, newsletter, social, copyright
// =====================================================================

import { useState } from "react";
import {
  siteConfig, whatsappLink, telegramLink, emailLink,
  DEFAULT_WHATSAPP_MESSAGE, DEFAULT_EMAIL_SUBJECT,
} from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarCheck, MessageCircle, Send, Mail, Instagram, Facebook, Linkedin, Music2 } from "lucide-react";
import { toast } from "sonner";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Book Now", href: "#book" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const SUPPORT_LINKS = [
  { label: "Booking Policy", href: "#" },
  { label: "Cancellation Policy", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms", href: "#" },
];

const SOCIALS = [
  { icon: Instagram, href: siteConfig.social.instagram, label: "Instagram" },
  { icon: Facebook, href: siteConfig.social.facebook, label: "Facebook" },
  { icon: Music2, href: siteConfig.social.tiktok, label: "TikTok" },
  { icon: Linkedin, href: siteConfig.social.linkedin, label: "LinkedIn" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email.");
      return;
    }
    setSubscribing(true);
    try {
      const r = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "newsletter", firstName: "", email }),
      });
      if (r.ok) {
        toast.success("Subscribed! Updates coming your way.");
        setEmail("");
      } else {
        toast.error("Couldn't subscribe — please try again.");
      }
    } catch {
      toast.error("Network error — please try again.");
    } finally {
      setSubscribing(false);
    }
  };

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative bg-secondary/50 border-t border-border">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <CalendarCheck className="h-5 w-5 text-primary-foreground" />
              </span>
              <div>
                <span className="font-serif font-bold text-lg block leading-none">AS REFERENCE</span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">Booking</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-xs">
              {siteConfig.shortBio}
            </p>
            {/* Socials */}
            <div className="flex gap-2">
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-card border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
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

          {/* Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <a href="#" className="text-sm text-foreground/80 hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Contact shortcuts */}
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 mt-6">
              Contact
            </h4>
            <ul className="space-y-1.5 text-sm">
              <li>
                <a
                  href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                  target="_blank" rel="noopener noreferrer"
                  className="text-foreground/80 hover:text-emerald-700 transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  {siteConfig.contact.whatsappDisplay}
                </a>
              </li>
              <li>
                <a
                  href={telegramLink()}
                  target="_blank" rel="noopener noreferrer"
                  className="text-foreground/80 hover:text-sky-700 transition-colors flex items-center gap-2"
                >
                  <Send className="h-3.5 w-3.5" />
                  {siteConfig.contact.telegramDisplay}
                </a>
              </li>
              <li>
                <a
                  href={emailLink(DEFAULT_EMAIL_SUBJECT)}
                  className="text-foreground/80 hover:text-primary transition-colors flex items-center gap-2 break-all"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="text-xs">{siteConfig.contact.email}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Get updates & availability
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              Subscribe for occasional updates — no spam, unsubscribe anytime.
            </p>
            <form onSubmit={subscribe} className="space-y-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="h-10"
                required
              />
              <Button type="submit" size="sm" className="w-full" disabled={subscribing}>
                {subscribing ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {siteConfig.copyrightYear} As Reference. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with care
            <span style={{ color: "var(--terracotta)" }}>●</span>
            Book Your Experience. Your Way.
          </p>
        </div>
      </div>
    </footer>
  );
}
