"use client";

// =====================================================================
// FAQ — 8 Q&As with accordion
// =====================================================================

import { Section, Eyebrow, Heading, Lead } from "@/components/portfolio/ui-helpers";
import { faqs } from "@/lib/abidex-data";
import { Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <Section id="faq">
      <div className="text-center mb-12 md:mb-16">
        <Eyebrow>FAQ</Eyebrow>
        <Heading className="mx-auto">
          Frequently Asked <span className="text-gradient">Questions</span>
        </Heading>
        <Lead className="mx-auto text-center">
          Quick answers to the most common questions about working with me. For anything
          else, the chatbot or contact form is one tap away.
        </Lead>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, i) => {
          const open = openIdx === i;
          return (
            <div
              key={i}
              className={cn(
                "rounded-xl border border-border bg-card overflow-hidden transition-colors",
                open && "border-primary/40"
              )}
            >
              <button
                onClick={() => setOpenIdx(open ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
                aria-expanded={open}
              >
                <span className="text-sm md:text-base font-medium">{faq.question}</span>
                <Plus
                  className={cn(
                    "h-5 w-5 text-primary shrink-0 transition-transform duration-300",
                    open && "rotate-45"
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid transition-all duration-300",
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
