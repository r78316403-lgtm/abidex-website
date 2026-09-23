"use client";

// =====================================================================
// PROCESS — 5-step timeline (horizontal desktop / vertical mobile)
// =====================================================================

import { Section, Eyebrow, Heading, Lead } from "@/components/portfolio/ui-helpers";
import { processSteps } from "@/lib/abidex-data";

export function Process() {
  return (
    <Section id="process">
      <div className="text-center mb-12 md:mb-16">
        <Eyebrow>How I Work</Eyebrow>
        <Heading className="mx-auto">
          A Clear <span className="text-gradient">5-Step Process</span>
        </Heading>
        <Lead className="mx-auto text-center">
          From first conversation to ongoing optimization — here&apos;s how every project
          moves from idea to working system.
        </Lead>
      </div>

      {/* Desktop horizontal timeline */}
      <div className="hidden lg:block relative">
        {/* Connecting line */}
        <div className="absolute top-12 left-12 right-12 h-px bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />

        <div className="grid grid-cols-5 gap-4">
          {processSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Numbered node */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-primary/30 blur-lg scale-150" />
                  <div className="relative h-24 w-24 rounded-full bg-card border border-primary/30 flex flex-col items-center justify-center">
                    <Icon className="h-6 w-6 text-primary mb-1" />
                    <span className="text-xs font-bold text-primary">{step.number}</span>
                  </div>
                </div>

                {/* Title + description */}
                <h3 className="mt-5 text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed max-w-[180px]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile vertical timeline */}
      <div className="lg:hidden relative">
        <div className="absolute top-0 bottom-0 left-[44px] w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />

        <ol className="space-y-6">
          {processSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <li
                key={step.number}
                className="relative flex gap-4 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Node */}
                <div className="relative shrink-0">
                  <div className="absolute inset-0 rounded-full bg-primary/30 blur-md scale-150" />
                  <div className="relative h-22 w-22 rounded-full bg-card border border-primary/30 flex flex-col items-center justify-center p-2" style={{ height: "88px", width: "88px" }}>
                    <Icon className="h-5 w-5 text-primary mb-0.5" />
                    <span className="text-[10px] font-bold text-primary">{step.number}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-3 flex-1">
                  <h3 className="text-base font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
