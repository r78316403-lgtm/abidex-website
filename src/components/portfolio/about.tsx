"use client";

// =====================================================================
// ABOUT — Turning Technology Into Practical Business Systems
// =====================================================================

import { Button } from "@/components/ui/button";
import { Section, Eyebrow, Heading, Lead } from "@/components/portfolio/ui-helpers";
import { ArrowRight, Check } from "lucide-react";

const IMPACT = [
  "Capture leads",
  "Respond faster",
  "Automate follow-ups",
  "Reduce repetitive work",
  "Organize customer data",
  "Improve customer communication",
  "Build scalable workflows",
  "Create better digital experiences",
];

export function About() {
  return (
    <Section id="about">
      <div className="grid lg:grid-cols-[1fr_0.85fr] gap-12 lg:gap-16 items-center">
        {/* LEFT — copy */}
        <div>
          <Eyebrow>About Abidex</Eyebrow>
          <Heading>
            Turning Technology Into <span className="text-gradient">Practical Business Systems</span>
          </Heading>
          <Lead>
            I don&apos;t add technology for the sake of technology. I focus on solving real
            business problems — slow response times, manual follow-ups, disconnected tools,
            missed opportunities — by building AI and automation systems that fit the way your
            business already works.
          </Lead>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-2xl">
            Whether it&apos;s an AI agent that handles customer questions 24/7, a WhatsApp flow
            that captures and qualifies leads automatically, or a CRM workflow that nurtures
            every prospect — the goal is always the same: less manual work, faster response,
            more revenue.
          </p>

          {/* Impact list */}
          <ul className="mt-8 grid sm:grid-cols-2 gap-2.5">
            {IMPACT.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 border border-primary/30">
                  <Check className="h-3 w-3 text-primary" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <Button
            size="lg"
            className="mt-8 group"
            onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            Let&apos;s Build Something Smart
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>

        {/* RIGHT — profile visual */}
        <div className="relative">
          {/* Glow behind */}
          <div className="absolute -inset-4 bg-glow-blue rounded-3xl blur-2xl opacity-60" />

          <div className="relative aspect-square rounded-3xl border border-border bg-card overflow-hidden">
            {/* Decorative grid */}
            <div className="absolute inset-0 bg-grid opacity-30" />

            {/* Avatar monogram */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent blur-3xl opacity-50 scale-150" />
                <div className="relative h-40 w-40 sm:h-48 sm:w-48 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl">
                  <span className="font-bold text-6xl sm:text-7xl text-white">A</span>
                </div>
              </div>
            </div>

            {/* Role badge */}
            <div className="absolute bottom-6 left-6 right-6 glass rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
                Abidex
              </p>
              <p className="text-sm font-medium">AI &amp; Automation Specialist</p>
              <p className="text-xs text-muted-foreground mt-1">
                AI Agents • Automation • CRM • WhatsApp • Web
              </p>
            </div>

            {/* Floating tech chips */}
            <div className="absolute top-6 left-6 glass rounded-full px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 animate-float">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Available
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
