"use client";

// =====================================================================
// TESTIMONIALS — honest placeholder, easy to replace
// =====================================================================

import { Section, HeadingBlock } from "@/components/booking/ui-helpers";
import { Star, MessageSquareQuote } from "lucide-react";

export function Testimonials() {
  return (
    <Section id="reviews" alt>
      <HeadingBlock
        eyebrow="Testimonials"
        title={<>What Our Customers <span className="italic text-primary">Say</span></>}
      />

      <div className="max-w-2xl mx-auto">
        <div className="text-center p-10 sm:p-14 rounded-2xl border border-dashed border-border bg-card">
          {/* Stars */}
          <div className="flex justify-center gap-1 mb-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className="h-6 w-6"
                style={{ color: "var(--muted-gold)" }}
                fill="currentColor"
              />
            ))}
          </div>

          <MessageSquareQuote className="h-10 w-10 text-accent/50 mx-auto mb-4" />

          <p className="font-serif text-xl sm:text-2xl font-medium leading-snug mb-3">
            Customer reviews will appear here.
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            We're building something special at As Reference. Real reviews from real customers will
            be added here as our community grows — check back soon.
          </p>
        </div>

        {/* Helper note for the team */}
        <p className="text-center text-xs text-muted-foreground/70 mt-4">
          This section is designed to be easily replaced with authentic testimonials.
        </p>
      </div>
    </Section>
  );
}
