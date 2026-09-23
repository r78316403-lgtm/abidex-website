"use client";

// =====================================================================
// NAVBAR — sticky, compacts on scroll, animated mobile hamburger
// =====================================================================

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/60 py-2.5"
            : "bg-transparent py-4"
        )}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNav("#home")}
            className="flex items-center gap-2 group"
            aria-label="Abidex home"
          >
            <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-4 w-4 text-white" />
              <span className="absolute inset-0 rounded-lg bg-primary/30 blur-md -z-10 group-hover:bg-primary/50 transition-colors" />
            </span>
            <span className="font-bold text-lg tracking-tight">ABIDEX</span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/60"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="hidden md:inline-flex group"
              onClick={() => handleNav("#contact")}
            >
              Let&apos;s Work Together
            </Button>
            <button
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-secondary/60 transition-colors"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden animate-fade-in">
          <div
            className="absolute inset-0 bg-background/95 backdrop-blur-xl"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex flex-col h-full pt-6 px-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                  <Sparkles className="h-4 w-4 text-white" />
                </span>
                <span className="font-bold text-lg">ABIDEX</span>
              </div>
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-secondary/60"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className="px-4 py-3.5 text-left text-lg font-medium rounded-lg hover:bg-secondary/60 transition-colors animate-fade-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <Button
              className="mt-6"
              size="lg"
              onClick={() => handleNav("#contact")}
            >
              Let&apos;s Work Together
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
