"use client";

// =====================================================================
// FAQ — elegant accordion with 10 questions
// =====================================================================

import { useState } from "react";
import { Section, HeadingBlock } from "@/components/booking/ui-helpers";
import { faqs } from "@/lib/booking-data";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <Section id="faq">
      <HeadingBlock
        eyebrow="FAQ"
        title={<>Questions? <span className="italic text-primary">We Have Answers.</span></>}
        lead="Everything you need to know about booking with As Reference. Can't find your answer? Our concierge is one tap away."
      />

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, i) => {
          const open = openIdx === i;
          return (
            <div
              key={i}
              className={cn(
                "rounded-xl border border-border bg-card overflow-hidden transition-colors",
                open && "border-primary/40 shadow-sm"
              )}
            >
              <button
                onClick={() => setOpenIdx(open ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
                aria-expanded={open}
              >
                <span className="font-serif text-base sm:text-lg font-medium">{faq.question}</span>
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
