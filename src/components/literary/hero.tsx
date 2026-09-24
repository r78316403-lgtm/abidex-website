"use client";

// =====================================================================
// HERO — headline, supporting text, CTAs, scroll indicator, Est. 2010
// =====================================================================

import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export function Hero() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="top" className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-warm-texture">
      {/* Glow accents */}
      <div className="absolute top-1/4 -left-32 h-[500px] w-[500px] bg-glow-burgundy rounded-full -z-10" />
      <div className="absolute bottom-1/4 -right-32 h-[400px] w-[400px] bg-glow-gold rounded-full -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border text-xs font-medium mb-6 animate-fade-up">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-soft-pulse" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="text-muted-foreground uppercase tracking-widest">Private · Literary · Society</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] animate-fade-up" style={{ animationDelay: "100ms" }}>
            Where Intellectual Curiosity <br className="hidden sm:block" />
            Meets <span className="italic text-primary">Companionable Consideration.</span>
          </h1>

          {/* Supporting text */}
          <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "200ms" }}>
            {siteConfig.shortBio}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center animate-fade-up" style={{ animationDelay: "300ms" }}>
            <Button size="lg" className="group" onClick={() => scrollTo("#contact")}>
              <Sparkles className="h-4 w-4 mr-2" />
              Connect With the Selection Committee
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollTo("#experience")}>
              <BookOpen className="h-4 w-4 mr-2" />
              Explore the Experience
            </Button>
          </div>

          {/* Established */}
          <p className="mt-10 text-xs uppercase tracking-[0.3em] text-muted-foreground animate-fade-up" style={{ animationDelay: "400ms" }}>
            Established {siteConfig.established}
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <div className="h-10 w-6 rounded-full border-2 border-current flex items-start justify-center p-1">
            <span className="h-2 w-1 rounded-full bg-current animate-scroll-down" />
          </div>
        </div>
      </div>
    </section>
  );
}
