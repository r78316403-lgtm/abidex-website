"use client";

// =====================================================================
// OPERATING PRINCIPLE — How We Operate, what we are not
// =====================================================================

import { Section, HeadingBlock } from "@/components/literary/ui-helpers";
import { X, Check } from "lucide-react";

export function OperatingPrinciple() {
  return (
    <Section id="operate" alt>
      <HeadingBlock
        number="05"
        eyebrow="Operating Principle"
        title={<>How We <span className="italic text-primary">Operate</span></>}
        lead={
          <>
            Abidex operates strictly as an independent private literary society and curated cultural hub. We are entirely transparent about our structure: our community is built on mutual respect and intellectual rigor, not commercial &ldquo;pay-to-play&rdquo; marketing models. We fund our massive distribution, community infrastructure, and engagement programs through our private network, ensuring that our selection criteria remain purely focused on literary merit and narrative impact.
          </>
        }
      />

      <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
        {/* What we are not */}
        <div className="p-6 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/15 border border-destructive/30">
              <X className="h-4 w-4 text-destructive" />
            </span>
            <h3 className="font-serif text-lg font-semibold">What we are not</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Not a commercial &ldquo;pay-to-play&rdquo; marketing model. Selection is driven by merit alone.
          </p>
        </div>

        {/* How we are funded */}
        <div className="p-6 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-green/15 border border-sage-green/30">
              <Check className="h-4 w-4" style={{ color: "var(--sage-green)" }} />
            </span>
            <h3 className="font-serif text-lg font-semibold">How we are funded</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Through our private network — funding distribution, community infrastructure, and engagement programs.
          </p>
        </div>
      </div>
    </Section>
  );
}
