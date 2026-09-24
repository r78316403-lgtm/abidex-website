"use client";

// =====================================================================
// NAVBAR — sticky, warm, mobile hamburger
// =====================================================================

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookingFlow } from "./booking-context";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Book Now", href: "#book", action: "book" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openBooking } = useBookingFlow();

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

  const handleNav = (href: string, action?: string) => {
    setMobileOpen(false);
    if (action === "book") {
      openBooking();
      return;
    }
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
            onClick={() => handleNav("#home")}
            className="flex items-center gap-2.5 group"
            aria-label="As Reference home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <CalendarCheck className="h-5 w-5 text-primary-foreground" />
            </span>
            <div className="text-left leading-none">
              <span className="font-serif font-bold text-lg tracking-tight block">AS REFERENCE</span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">Booking</span>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href, link.action)}
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-colors rounded-md",
                  link.action === "book"
                    ? "text-primary font-semibold hover:bg-primary/10"
                    : "text-foreground/80 hover:text-foreground hover:bg-secondary/60"
                )}
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
              onClick={() => openBooking()}
            >
              Book Now
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="hidden md:inline-flex"
              onClick={() => handleNav("#contact")}
            >
              Contact Us
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
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                  <CalendarCheck className="h-5 w-5 text-primary-foreground" />
                </span>
                <span className="font-serif font-bold text-lg">AS REFERENCE</span>
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
                  onClick={() => handleNav(link.href, link.action)}
                  className="px-4 py-3.5 text-left text-lg font-medium rounded-lg hover:bg-secondary/60 transition-colors animate-fade-up font-serif"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="mt-6 flex flex-col gap-2">
              <Button size="lg" onClick={() => { setMobileOpen(false); openBooking(); }}>
                Book Now
              </Button>
              <Button size="lg" variant="outline" onClick={() => handleNav("#contact")}>
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
