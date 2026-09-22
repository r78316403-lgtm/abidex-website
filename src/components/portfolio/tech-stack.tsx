"use client";

// =====================================================================
// TECH STACK — categorized technology badges
// =====================================================================

import { Section, Eyebrow, Heading, Lead } from "@/components/portfolio/ui-helpers";
import { techStack } from "@/lib/abidex-data";

export function TechStack() {
  return (
    <Section id="tech">
      <div className="text-center mb-12 md:mb-16">
        <Eyebrow>Technology Stack</Eyebrow>
        <Heading className="mx-auto">
          Tools I Use To <span className="text-gradient">Build Systems</span>
        </Heading>
        <Lead className="mx-auto text-center">
          A modern, proven stack covering AI, automation, CRM, communication, and web — so
          every part of your business can be connected.
        </Lead>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {techStack.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.category}
              className="group p-6 rounded-2xl border border-border bg-card glow-border animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold">{cat.category}</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-secondary border border-border text-muted-foreground group-hover:border-primary/40 group-hover:text-foreground transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
