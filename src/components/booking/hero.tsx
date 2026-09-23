"use client";

// =====================================================================
// HERO — warm lifestyle imagery, headline, CTAs, trust, WhatsApp
// + BookingWidget below
// =====================================================================

import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, CalendarCheck, Clock, HeartHandshake } from "lucide-react";
import {
  whatsappLink,
  DEFAULT_WHATSAPP_MESSAGE,
} from "@/lib/site-config";
import { trustIndicators } from "@/lib/booking-data";
import { useBookingFlow } from "./booking-context";
import { BookingWidget } from "./booking-widget";

export function Hero() {
  const { openBooking } = useBookingFlow();
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative pt-28 pb-16 md:pt-32 md:pb-20 overflow-hidden bg-warm-texture">
      {/* Soft warm glow accents */}
      <div className="absolute top-1/4 -left-32 h-[500px] w-[500px] bg-glow-burgundy rounded-full -z-10" />
      <div className="absolute bottom-1/4 -right-32 h-[400px] w-[400px] bg-glow-gold rounded-full -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* LEFT — copy */}
          <div className="text-center lg:text-left animate-fade-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border text-xs font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-soft-pulse" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <span className="text-muted-foreground">Premium Booking Experience</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05]">
              Book Your Experience. <br className="hidden sm:block" />
              <span className="text-primary italic">Your Way.</span>
            </h1>

            {/* Supporting text */}
            <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              Simple booking, personalized service, and an experience designed around your time.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button size="lg" className="group" onClick={() => openBooking()}>
                <CalendarCheck className="h-4 w-4 mr-2" />
                Book Now
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => scrollTo("#services")}>
                Explore Services
              </Button>
            </div>

            {/* WhatsApp button */}
            <div className="mt-4 flex justify-center lg:justify-start">
              <a
                href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-emerald-700 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {trustIndicators.map((t, i) => (
                <span key={t} className="flex items-center gap-2">
                  {i === 0 && <CalendarCheck className="h-4 w-4 text-accent" />}
                  {i === 1 && <Clock className="h-4 w-4 text-accent" />}
                  {i === 2 && <HeartHandshake className="h-4 w-4 text-accent" />}
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT — lifestyle image */}
          <div className="relative animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1000&q=80"
                alt="Professional welcoming a client to their appointment"
                className="w-full h-full object-cover"
                loading="eager"
              />
              {/* Warm overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />

              {/* Floating rating card */}
              <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur-md rounded-xl p-4 shadow-lg border border-border/60">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 rounded-full bg-accent/15 items-center justify-center">
                    <HeartHandshake className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Personal Support</p>
                    <p className="text-xs text-muted-foreground">We're here to help, every step</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative corner accent */}
            <div className="absolute -top-3 -right-3 h-24 w-24 rounded-2xl bg-secondary border border-border -z-10" />
            <div className="absolute -bottom-3 -left-3 h-20 w-20 rounded-full bg-muted-gold/20 -z-10" />
          </div>
        </div>

        {/* Booking widget */}
        <div id="book" className="mt-16 md:mt-20 scroll-mt-24">
          <BookingWidget />
        </div>
      </div>
    </section>
  );
}
