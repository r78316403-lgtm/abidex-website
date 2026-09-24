"use client";

// =====================================================================
// NAVBAR — sticky, premium, mobile hamburger
// =====================================================================

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AbidexWordmark } from "./logo";
import { navLinks } from "@/lib/literary-data";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            ? "bg-background/95 backdrop-blur-md border-b border-border/60 py-2.5 shadow-sm"
            : "bg-transparent py-4"
        )}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNav("#top")}
            aria-label="Abidex home"
          >
            <AbidexWordmark size={38} showTagline />
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-md hover:bg-secondary/60"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="hidden md:inline-flex"
              onClick={() => handleNav("#contact")}
            >
              Connect With Us
            </Button>
            <button
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-secondary/60 transition-colors"
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
        <div className="fixed inset-0 z-[60] lg:hidden animate-fade-in">
          <div
            className="absolute inset-0 bg-background/95 backdrop-blur-md"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex flex-col h-full pt-6 px-6">
            <div className="flex items-center justify-between mb-8">
              <AbidexWordmark size={36} showTagline />
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-secondary/60"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className="px-4 py-3.5 text-left text-lg font-medium rounded-lg hover:bg-secondary/60 transition-colors animate-fade-up font-serif"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <Button
              size="lg"
              className="mt-6"
              onClick={() => handleNav("#contact")}
            >
              Connect With Us
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
