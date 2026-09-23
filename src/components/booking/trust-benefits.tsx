"use client";

// =====================================================================
// TRUST / BENEFITS — "Designed Around You" with 4 benefit cards
// =====================================================================

import { Section, HeadingBlock } from "@/components/booking/ui-helpers";
import { benefits } from "@/lib/booking-data";

export function TrustBenefits() {
  return (
    <Section id="benefits" alt>
      <HeadingBlock
        eyebrow="Why As Reference"
        title={<>Designed <span className="italic text-primary">Around You</span></>}
        lead="Every part of the booking experience is built around your time, your needs, and your comfort."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {benefits.map((benefit, i) => {
          const Icon = benefit.icon;
          return (
            <div
              key={benefit.title}
              className="group p-6 rounded-2xl border border-border bg-card warm-card animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
