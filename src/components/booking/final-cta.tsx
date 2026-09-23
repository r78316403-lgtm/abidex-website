"use client";

// =====================================================================
// FINAL CTA — deep burgundy bg, warm ivory text
// =====================================================================

import { Button } from "@/components/ui/button";
import { Section } from "@/components/booking/ui-helpers";
import { useBookingFlow } from "./booking-context";
import {
  whatsappLink, DEFAULT_WHATSAPP_MESSAGE,
} from "@/lib/site-config";
import { CalendarCheck, ArrowRight, MessageCircle } from "lucide-react";

export function FinalCta() {
  const { openBooking } = useBookingFlow();
  const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <Section id="final-cta" className="!py-20 md:!py-28">
      <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden">
        {/* Deep burgundy background */}
        <div className="absolute inset-0 bg-primary" />
        {/* Decorative warm overlay */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, var(--muted-gold) 0, transparent 50%), radial-gradient(circle at 80% 70%, var(--terracotta) 0, transparent 50%)",
        }} />

        <div className="relative px-6 py-14 sm:px-12 sm:py-20 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-foreground/70 mb-4">
            Ready When You Are
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-primary-foreground leading-[1.05] mb-5">
            Ready to Book?
          </h2>
          <p className="text-base md:text-lg text-primary-foreground/85 max-w-xl mx-auto leading-relaxed mb-9">
            Choose your service, select a convenient time, and let us take care of the rest.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="group bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              onClick={() => openBooking()}
            >
              <CalendarCheck className="h-4 w-4 mr-2" />
              Book Now
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              onClick={() => scrollTo("#contact")}
            >
              Talk to Us
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-emerald-300/40 text-emerald-100 hover:bg-emerald-500/20 hover:text-white"
              asChild
            >
              <a href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
