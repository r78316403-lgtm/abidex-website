"use client";

// =====================================================================
// SERVICES — premium cards with image, name, description, duration, price
// =====================================================================

import { Section, HeadingBlock } from "@/components/booking/ui-helpers";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/booking-data";
import { useBookingFlow } from "./booking-context";
import { Clock, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Services() {
  const { openBooking, openDetail } = useBookingFlow();

  return (
    <Section id="services">
      <HeadingBlock
        eyebrow="Our Services"
        title={<>Choose the Experience <span className="italic text-primary">That's Right for You</span></>}
        lead="From quick consultations to full-day VIP experiences — every service is delivered with the same warmth, attention to detail, and professional care."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {services.map((service, i) => (
          <article
            key={service.id}
            className="group relative rounded-2xl border border-border bg-card overflow-hidden warm-card animate-fade-up flex flex-col"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* Image */}
            <button
              onClick={() => openDetail(service)}
              className="relative aspect-[4/3] overflow-hidden bg-secondary block"
              aria-label={`View ${service.name} details`}
            >
              <img
                src={service.image}
                alt={service.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Availability badge */}
              <div className={cn(
                "absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md",
                service.availability === "Available" && "bg-sage-green/90 text-white",
                service.availability === "Limited" && "bg-terracotta/90 text-white",
                service.availability === "By Appointment" && "bg-primary/90 text-primary-foreground"
              )}>
                {service.availability}
              </div>
            </button>

            {/* Body */}
            <div className="p-5 flex flex-col flex-1">
              <p className="text-[10px] uppercase tracking-widest text-accent font-semibold mb-1">
                {service.category}
              </p>
              <button
                onClick={() => openDetail(service)}
                className="text-left group/title"
              >
                <h3 className="font-serif text-xl font-semibold leading-tight mb-2 group-hover/title:text-primary transition-colors">
                  {service.name}
                </h3>
              </button>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-3">
                {service.description}
              </p>

              {/* Meta */}
              <div className="flex items-center justify-between pt-3 border-t border-border mb-4 text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {service.duration}
                </span>
                <span className="font-serif text-lg font-bold text-primary">{service.price}</span>
              </div>

              {/* CTAs */}
              <div className="flex gap-2">
                <Button
                  className="flex-1 group"
                  onClick={() => openBooking(service)}
                >
                  Book Now
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openDetail(service)}
                  aria-label={`View ${service.name} details`}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
