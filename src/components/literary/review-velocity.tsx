"use client";

// =====================================================================
// REVIEW VELOCITY — High-Signal Engagement, 150+ benchmark
// =====================================================================

import { Section, HeadingBlock } from "@/components/literary/ui-helpers";
import { reviewFeatures } from "@/lib/literary-data";

export function ReviewVelocity() {
  return (
    <Section id="velocity" alt>
      <HeadingBlock
        number="03"
        eyebrow="Review Velocity"
        title={<>High-Signal <span className="italic text-primary">Engagement</span></>}
        lead={
          <>
            Our community thrives on rigorous, authentic feedback. Through our private channels and active social salons, we generate consistent, analytical commentary that reflects the true depth of your work. This structured engagement naturally translates to a benchmark of 150+ high-quality review clusters on major reading platforms, proving that when the right minds meet the right text, impact is inevitable.
          </>
        }
      />

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 md:gap-12 items-center">
        {/* Features */}
        <div className="grid sm:grid-cols-2 gap-3">
          {reviewFeatures.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.label}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card warm-card animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-serif text-sm sm:text-base font-semibold">{f.label}</span>
              </div>
            );
          })}
        </div>

        {/* Benchmark */}
        <div className="relative">
          <div className="absolute -inset-3 bg-glow-gold rounded-3xl -z-10" />
          <div className="relative p-8 sm:p-10 rounded-2xl border border-border bg-card text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-3">
              Benchmark
            </p>
            <p className="font-serif text-7xl sm:text-8xl font-bold text-primary mb-2">
              150<span className="text-3xl align-top">+</span>
            </p>
            <p className="font-serif text-lg font-semibold mb-1">High-quality review clusters</p>
            <p className="text-sm text-muted-foreground">Across major reading platforms.</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
