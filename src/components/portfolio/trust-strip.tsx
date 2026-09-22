"use client";

// =====================================================================
// TRUST STRIP — horizontal marquee of capabilities
// =====================================================================

import { capabilities } from "@/lib/abidex-data";

export function TrustStrip() {
  // Duplicate the list so the marquee loops seamlessly
  const items = [...capabilities, ...capabilities];

  return (
    <section className="relative py-10 border-y border-border/40 bg-secondary/10 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 mb-4">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Tools, systems &amp; capabilities
        </p>
      </div>
      <div className="relative overflow-hidden w-full">
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee whitespace-nowrap">
          {items.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-6 py-2 text-sm font-medium text-muted-foreground"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
              {c}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
