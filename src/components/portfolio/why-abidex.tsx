"use client";

// =====================================================================
// WHY ABIDEX — 4-6 benefits grid
// =====================================================================

import { Section, Eyebrow, Heading, Lead } from "@/components/portfolio/ui-helpers";
import { benefits } from "@/lib/abidex-data";

export function WhyAbidex() {
  return (
    <Section id="why" className="bg-muted">
      <div className="text-center mb-12 md:mb-16">
        <Eyebrow>Why Abidex</Eyebrow>
        <Heading className="mx-auto">
          Why Businesses <span className="text-gradient">Work With Me</span>
        </Heading>
        <Lead className="mx-auto text-center">
          Most freelancers build technology. I build outcomes — systems designed around how
          your business actually operates.
        </Lead>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {benefits.map((benefit, i) => {
          const Icon = benefit.icon;
          return (
            <div
              key={benefit.title}
              className="group p-6 rounded-2xl border border-border bg-card glow-border animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 rounded-lg bg-primary/30 blur-md scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative h-11 w-11 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <h3 className="text-base font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
