"use client";

// =====================================================================
// AUTOMATION SHOWCASE — "Imagine Your Business Running on Autopilot"
// Visual workflow with animated connections.
// =====================================================================

import { Button } from "@/components/ui/button";
import { Section, Eyebrow, Heading } from "@/components/portfolio/ui-helpers";
import { workflowSteps } from "@/lib/abidex-data";
import { ArrowRight, ArrowDown } from "lucide-react";

export function AutomationShowcase() {
  return (
    <Section id="automation">
      {/* Glow background */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] bg-glow-violet rounded-full -z-10" />

      <div className="text-center mb-12 md:mb-16">
        <Eyebrow>AI Automation Showcase</Eyebrow>
        <Heading className="mx-auto">
          Imagine Your Business <span className="text-gradient">Running on Autopilot</span>
        </Heading>
      </div>

      {/* Workflow — horizontal on desktop, vertical on mobile */}
      <div className="relative">
        {/* Desktop horizontal flow */}
        <div className="hidden lg:flex items-center justify-between gap-2 overflow-x-auto pb-4">
          {workflowSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex items-center gap-2 shrink-0">
                <div
                  className="relative group flex flex-col items-center gap-3 w-32 animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {/* Glow */}
                  <div className="absolute -inset-2 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Node */}
                  <div className="relative h-16 w-16 rounded-2xl border border-border bg-card flex items-center justify-center group-hover:border-primary/60 transition-colors">
                    <Icon className="h-7 w-7 text-primary" />
                    {/* Pulsing dot */}
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary">
                      <span className="absolute inset-0 rounded-full bg-primary animate-soft-pulse" />
                    </span>
                  </div>

                  {/* Label */}
                  <span className="text-xs font-medium text-center leading-tight">
                    {step.label}
                  </span>
                </div>

                {/* Arrow connector */}
                {i < workflowSteps.length - 1 && (
                  <div className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-primary/60 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile vertical flow */}
        <div className="lg:hidden flex flex-col items-center gap-1">
          {workflowSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex flex-col items-center gap-2 w-full max-w-xs">
                <div className="flex items-center gap-3 w-full p-4 rounded-xl border border-border bg-card">
                  <div className="h-12 w-12 rounded-xl border border-border bg-secondary/40 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{step.label}</span>
                </div>
                {i < workflowSteps.length - 1 && (
                  <ArrowDown className="h-4 w-4 text-primary/60 my-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Description + CTA */}
      <div className="mt-12 md:mt-16 text-center max-w-2xl mx-auto">
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          From the first conversation to follow-up and conversion, I design connected systems
          that reduce manual work and keep opportunities moving.
        </p>
        <Button
          size="lg"
          className="mt-8 group"
          onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
        >
          Build My Automation
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
    </Section>
  );
}
