"use client";

// =====================================================================
// PHILOSOPHY — Our Foundation, literary focus, stats counters
// =====================================================================

import { Section, HeadingBlock } from "@/components/literary/ui-helpers";
import { stats } from "@/lib/literary-data";
import { BookOpen } from "lucide-react";

export function Philosophy() {
  return (
    <Section id="about" alt>
      <HeadingBlock
        number="01"
        eyebrow="Our Foundation"
        title={<>Our <span className="italic text-primary">Philosophy</span></>}
        lead={
          <>
            Literature as a permanent cultural contribution — not a temporary commodity.
            <br className="hidden md:block" />
            <span className="block mt-4 italic font-serif text-lg text-foreground/80">
              &ldquo;Abidex is built on an interdisciplinary focus that bridges the gap between literature, human progress, and community. We dedicate ourselves to scouting exceptional, independently published works that deserve a legacy spotlight. By introducing selected authors to a sophisticated network of deeply engaged thinkers, we foster high-signal discourse that treats literature not as a temporary commodity, but as a permanent cultural contribution.&rdquo;
            </span>
          </>
        }
      />

      {/* Pillars */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-12 md:mb-16">
        {["Literature", "Human Progress", "Community", "Legacy Spotlight"].map((pillar, i) => (
          <div
            key={pillar}
            className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card warm-card animate-fade-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <span className="font-serif text-sm sm:text-base font-semibold">{pillar}</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="text-center p-6 rounded-2xl border border-border bg-card warm-card animate-fade-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <p className="font-serif text-4xl sm:text-5xl font-bold text-primary mb-2">
              {stat.value}{stat.suffix}
            </p>
            <p className="text-sm font-semibold mb-1">{stat.label}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{stat.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
