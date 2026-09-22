"use client";

import { Link } from "@/lib/router";
import { siteConfig, whatsappLink, telegramLink } from "@/lib/site-config";
import { useQuery } from "@tanstack/react-query";
import { Mail, Phone, MapPin, Clock, Instagram, Facebook, Youtube, Linkedin, Sprout, MessageCircle, Send } from "lucide-react";

export function Footer() {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const r = await fetch("/api/categories");
      return (await r.json()) as { id: string; name: string; slug: string }[];
    },
    staleTime: 5 * 60_000,
  });

  return (
    <footer className="mt-auto border-t border-border bg-primary text-primary-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Sprout className="h-6 w-6 text-accent" />
              <h3 className="font-display text-xl font-bold">{siteConfig.name}</h3>
            </div>
            <p className="text-xs text-primary-foreground/70 mb-3 max-w-xs italic">
              "{siteConfig.slogan}"
            </p>
            <p className="text-xs text-primary-foreground/70 mb-4 max-w-xs">
              {siteConfig.tagline}. A leading health and wellness company in Nigeria.
            </p>
            <div className="flex flex-wrap gap-2">
              <a href={siteConfig.social.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="h-8 w-8 rounded-full bg-primary-foreground/10 hover:bg-[#25D366] hover:text-white transition-colors flex items-center justify-center">
                <MessageCircle className="h-4 w-4" />
              </a>
              <a href={siteConfig.social.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="h-8 w-8 rounded-full bg-primary-foreground/10 hover:bg-[#0088cc] hover:text-white transition-colors flex items-center justify-center">
                <Send className="h-4 w-4" />
              </a>
              <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="h-8 w-8 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center">
                <Facebook className="h-4 w-4" />
              </a>
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="h-8 w-8 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center">
                <Instagram className="h-4 w-4" />
              </a>
              <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="h-8 w-8 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center">
                <Youtube className="h-4 w-4" />
              </a>
              <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="h-8 w-8 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/shop" className="hover:text-accent transition-colors">All Products</Link></li>
              {categories?.map((c) => (
                <li key={c.id}>
                  <Link to={`/category/${c.slug}`} className="hover:text-accent transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/about" className="hover:text-accent transition-colors">About KEDI</Link></li>
              <li><Link to="/distributor" className="hover:text-accent transition-colors">Become a Distributor</Link></li>
              <li><Link to="/five-year-plan" className="hover:text-accent transition-colors">Five-Year Plan</Link></li>
              <li><Link to="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Help</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-accent transition-colors">Shipping</Link></li>
              <li><Link to="/returns" className="hover:text-accent transition-colors">Returns</Link></li>
              <li><Link to="/orders" className="hover:text-accent transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <a href={`mailto:${siteConfig.contact.email}`} className="flex items-start gap-2 hover:text-accent transition-colors">
                  <Mail className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
                  <span className="break-all">{siteConfig.contact.email}</span>
                </a>
              </li>
              <li>
                <a href={whatsappLink("Hello KEDI Healthcare!")} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 hover:text-accent transition-colors">
                  <MessageCircle className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
                  <span>WhatsApp: {siteConfig.contact.whatsappDisplay}</span>
                </a>
              </li>
              <li>
                <a href={telegramLink()} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 hover:text-accent transition-colors">
                  <Send className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
                  <span>Telegram: {siteConfig.contact.telegramDisplay}</span>
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
                <span>{siteConfig.contact.phone}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
                <span>{siteConfig.contact.address}</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
                <span>{siteConfig.contact.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/15 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/60">
          <p>
            © {new Date().getFullYear()} {siteConfig.legal.legalName}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-accent transition-colors">Terms & Conditions</Link>
            <Link to="/returns" className="hover:text-accent transition-colors">Return Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
