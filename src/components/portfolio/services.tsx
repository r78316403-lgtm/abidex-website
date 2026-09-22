"use client";

// =====================================================================
// SERVICES — 9 premium service cards with hover animations
// =====================================================================

import { Section, Eyebrow, Heading, Lead } from "@/components/portfolio/ui-helpers";
import { services } from "@/lib/abidex-data";
import { ArrowUpRight, Check } from "lucide-react";
import { useState } from "react";

export function Services() {
  return (
    <Section id="services" className="bg-secondary/10">
      <div className="text-center mb-12 md:mb-16">
        <Eyebrow>Services</Eyebrow>
        <Heading className="mx-auto">
          What I Can Build <span className="text-gradient">For Your Business</span>
        </Heading>
        <Lead className="mx-auto text-center">
          From AI agents that talk to your customers to automation workflows that run your
          back office — every service is built around your specific business outcomes.
        </Lead>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </Section>
  );
}

function ServiceCard({ service }: { service: typeof services[number] }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = service.icon;

  return (
    <article
      className="group relative p-6 rounded-2xl border border-border bg-card glow-border flex flex-col h-full"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Top: icon + arrow */}
      <div className="flex items-start justify-between mb-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-primary/30 blur-lg scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
        <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:rotate-45 transition-all" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold mb-2">{service.title}</h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
        {service.description}
      </p>

      {/* Features — visible on hover or always on touch */}
      <div className={`grid transition-all duration-300 ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"} lg:grid-rows-[1fr] lg:opacity-100`}>
        <ul className="overflow-hidden space-y-1.5">
          {service.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
              <Check className="h-3 w-3 text-primary shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Explore link */}
      <button
        onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
        className="mt-5 pt-4 border-t border-border text-sm font-medium text-primary inline-flex items-center gap-1.5 group/link"
      >
        Explore Service
        <ArrowUpRight className="h-3.5 w-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
      </button>
    </article>
  );
}
