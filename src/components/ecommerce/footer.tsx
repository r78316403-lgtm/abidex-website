"use client";

import { Link } from "@/lib/router";
import { siteConfig } from "@/lib/site-config";
import { useQuery } from "@tanstack/react-query";
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, Youtube } from "lucide-react";

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
    <footer className="mt-auto border-t border-border bg-secondary/50">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-display text-xl font-bold mb-3">{siteConfig.name}</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              {siteConfig.tagline}. A modern store for people who care about quality.
            </p>
            <div className="flex gap-2">
              <a href={siteConfig.social.instagram} aria-label="Instagram" className="text-muted-foreground hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={siteConfig.social.twitter} aria-label="Twitter" className="text-muted-foreground hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href={siteConfig.social.facebook} aria-label="Facebook" className="text-muted-foreground hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={siteConfig.social.youtube} aria-label="YouTube" className="text-muted-foreground hover:text-accent transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/shop" className="hover:text-accent transition-colors">All Products</Link></li>
              {categories?.slice(0, 4).map((c) => (
                <li key={c.id}>
                  <Link to={`/category/${c.slug}`} className="hover:text-accent transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Help</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="hover:text-accent transition-colors">Shipping</Link></li>
              <li><Link to="/returns" className="hover:text-accent transition-colors">Returns</Link></li>
              <li><Link to="/orders" className="hover:text-accent transition-colors">Track Order</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-accent transition-colors">
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{siteConfig.contact.phone}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{siteConfig.contact.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {siteConfig.legal.legalName}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-accent transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
