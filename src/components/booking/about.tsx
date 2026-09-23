"use client";

// =====================================================================
// ABOUT — "More Than a Booking. It's an Experience."
// =====================================================================

import { Button } from "@/components/ui/button";
import { Section, Eyebrow, Heading, Lead } from "@/components/booking/ui-helpers";
import { useBookingFlow } from "./booking-context";
import { ArrowRight, Sparkles, Clock, HeartHandshake, Users } from "lucide-react";

const PILLARS = [
  { icon: Users, label: "Who we serve", text: "Individuals, couples, families, and small teams looking for a more personal booking experience." },
  { icon: Sparkles, label: "What's different", text: "We focus on the experience, not just the appointment. Every detail is considered." },
  { icon: Clock, label: "What to expect", text: "A simple booking process, clear communication, and a warm welcome when you arrive." },
  { icon: HeartHandshake, label: "Why book with us", text: "Personal support, flexible scheduling, and a team that genuinely cares about your time." },
];

export function About() {
  const { openBooking } = useBookingFlow();

  return (
    <Section id="about" alt>
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Image */}
        <div className="relative order-2 lg:order-1">
          <div className="absolute -inset-3 bg-glow-gold rounded-3xl -z-10" />
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border border-border">
            <img
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80"
              alt="Warm welcome at As Reference"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/15 to-transparent" />
          </div>
          {/* Floating badge */}
          <div className="absolute -bottom-4 -right-4 sm:-right-6 bg-card rounded-xl shadow-lg border border-border p-4 max-w-[200px]">
            <p className="font-serif text-3xl font-bold text-primary leading-none">100%</p>
            <p className="text-xs text-muted-foreground mt-1">Personal attention on every booking</p>
          </div>
        </div>

        {/* Copy */}
        <div className="order-1 lg:order-2">
          <Eyebrow>About As Reference</Eyebrow>
          <Heading>
            More Than a Booking. <br />
            <span className="italic text-primary">It's an Experience.</span>
          </Heading>
          <Lead>
            At As Reference, we believe that booking an appointment should be the easiest part of
            your day. No long forms, no confusion, no waiting on hold. Just a simple, warm, and
            professional experience from the moment you arrive on this page to the moment you walk
            through our doors.
          </Lead>

          <div className="mt-8 grid sm:grid-cols-2 gap-5">
            {PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.label} className="flex gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1">{p.label}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{p.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <Button
            size="lg"
            className="mt-8 group"
            onClick={() => openBooking()}
          >
            Book Your Experience
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </Section>
  );
}
