"use client";

// =====================================================================
// TESTIMONIALS — honest "What I Focus On" section (no fake quotes)
// =====================================================================

import { Section, Eyebrow, Heading } from "@/components/portfolio/ui-helpers";
import { focusStatements } from "@/lib/abidex-data";
import { Sparkles } from "lucide-react";

export function Testimonials() {
  return (
    <Section id="focus" className="bg-muted">
      <div className="text-center mb-10">
        <Eyebrow>What I Focus On</Eyebrow>
        <Heading className="mx-auto">
          The Principles Behind <span className="text-gradient">Every Project</span>
        </Heading>
        <p className="mt-4 text-sm text-muted-foreground max-w-xl mx-auto">
          Client testimonials coming soon. In the meantime, here&apos;s what guides every
          system I build.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {focusStatements.map((statement, i) => (
          <div
            key={statement}
            className="group relative p-6 rounded-2xl border border-border bg-card glow-border text-center animate-fade-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 border border-primary/30 mb-3">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm font-medium leading-snug">{statement}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
