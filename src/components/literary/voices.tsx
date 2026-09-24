"use client";

// =====================================================================
// VOICES — From the Hub (testimonials)
// =====================================================================

import { Section, HeadingBlock } from "@/components/literary/ui-helpers";
import { voices } from "@/lib/literary-data";
import { Quote } from "lucide-react";

export function Voices() {
  return (
    <Section id="voices">
      <HeadingBlock
        number="06"
        eyebrow="From the Hub"
        title={<>Voices <span className="italic text-primary">From the Hub</span></>}
        lead="First-hand reflections from authors and readers inside the residency."
      />

      <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
        {voices.map((v, i) => (
          <div
            key={i}
            className="relative p-6 sm:p-8 rounded-2xl border border-border bg-card warm-card animate-fade-up"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <Quote className="h-8 w-8 text-accent/40 mb-4" />
            <p className="font-serif text-lg leading-relaxed mb-6 italic">
              &ldquo;{v.quote}&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center font-serif font-bold text-primary-foreground">
                {v.author.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold">{v.author}</p>
                <p className="text-xs text-muted-foreground">
                  {v.role} · {v.type === "author" ? "Author Perspective" : "Reader Perspective"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
