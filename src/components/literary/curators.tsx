"use client";

// =====================================================================
// CURATORS — The Selection Committee
// =====================================================================

import { Section, HeadingBlock } from "@/components/literary/ui-helpers";
import { curators } from "@/lib/literary-data";
import { BookOpen } from "lucide-react";

export function Curators() {
  return (
    <Section id="committee">
      <HeadingBlock
        number="04"
        eyebrow="The Curators"
        title={<>The <span className="italic text-primary">Selection Committee</span></>}
        lead={
          <>
            A dedicated team of literary specialists, academic minds, and cultural curators reviewing hundreds of independent titles annually.
            <span className="block mt-3">
              Our curation process is steered by a Selection Committee Chair, alongside a dedicated team of literary specialists, academic minds, and cultural curators. With deep roots in narrative structure and community building, the committee reviews hundreds of independent titles annually to discover the rare few that match our community&apos;s standard for intellectual depth.
            </span>
          </>
        }
      />

      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        {curators.map((c, i) => (
          <div
            key={c.role}
            className="p-6 rounded-2xl border border-border bg-card warm-card text-center animate-fade-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="inline-flex h-16 w-16 rounded-full bg-primary/10 border border-primary/20 items-center justify-center mb-4">
              <BookOpen className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-serif text-lg font-semibold mb-2">{c.role}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{c.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
