"use client";

// =====================================================================
// HOW IT WORKS — 4-step process
// =====================================================================

import { Section, HeadingBlock } from "@/components/booking/ui-helpers";
import { processSteps } from "@/lib/booking-data";

export function HowItWorks() {
  return (
    <Section id="how-it-works" alt>
      <HeadingBlock
        eyebrow="How It Works"
        title={<>Booking in <span className="italic text-primary">Four Simple Steps</span></>}
        lead="No long forms, no back-and-forth. Just a clear, simple path from interest to confirmed appointment."
      />

      {/* Desktop horizontal */}
      <div className="hidden lg:grid grid-cols-4 gap-4 relative">
        {/* Connecting line */}
        <div className="absolute top-10 left-[12.5%] right-[12.5%] h-px bg-border" />

        {processSteps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="relative flex flex-col items-center text-center animate-fade-up"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="relative z-10 mb-5">
                <div className="h-20 w-20 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center shadow-sm">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center font-mono">
                  {step.number}
                </span>
              </div>
              <h3 className="font-serif text-lg font-semibold mb-1.5">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mobile vertical */}
      <div className="lg:hidden relative">
        <div className="absolute top-0 bottom-0 left-10 w-px bg-border" />
        <ol className="space-y-6">
          {processSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <li
                key={step.number}
                className="relative flex gap-4 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="relative shrink-0 z-10">
                  <div className="h-20 w-20 rounded-full bg-card border-2 border-primary/30 flex flex-col items-center justify-center shadow-sm">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="pt-4 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-primary">{step.number}</span>
                    <h3 className="font-serif text-lg font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
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
