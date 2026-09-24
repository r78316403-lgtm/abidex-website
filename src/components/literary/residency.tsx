"use client";

// =====================================================================
// RESIDENCY — The 12-Month Managed Reader Experience
// Calendar + 4 stages
// =====================================================================

import { Section, HeadingBlock } from "@/components/literary/ui-helpers";
import { residencyStages, calendarMonths } from "@/lib/literary-data";
import { cn } from "@/lib/utils";

export function Residency() {
  return (
    <Section id="experience">
      <HeadingBlock
        number="02"
        eyebrow="The Residency"
        title={<>The 12-Month <span className="italic text-primary">Managed Reader Experience</span></>}
        lead={
          <>
            <span className="block">1–2 selections monthly · 18 authors per annual cycle</span>
            <span className="block mt-3">
              Each month the Selection Committee advances one to two titles into the residency — 18 standout authors across the annual cycle. When a book is selected, it enters a structured, year-long ecosystem designed to maximize visibility and high-level engagement.
            </span>
            <span className="block mt-3 italic">
              The Residency is not a passive book club selection; it is an active, year-long immersion program. We cultivate long-tail momentum for our authors by guiding an elite reader base through structured deep-dives, ensuring sustainable review velocity and permanent intellectual recognition.
            </span>
          </>
        }
      />

      {/* Calendar */}
      <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
        {calendarMonths.map((cal, i) => (
          <div
            key={cal.month}
            className="p-5 rounded-2xl border border-border bg-card warm-card animate-fade-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
              <h3 className="font-serif text-xl font-semibold">{cal.month}</h3>
              <span className="text-xs font-medium text-accent uppercase tracking-wider">{cal.picks}</span>
            </div>
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, idx) => (
                <div key={idx} className="text-center text-[10px] uppercase tracking-widest text-muted-foreground font-semibold py-1">
                  {d}
                </div>
              ))}
            </div>
            {/* Days */}
            <div className="grid grid-cols-7 gap-1">
              {cal.days.map((day, idx) => {
                const isPick = day !== null && cal.pickDays.includes(day);
                return (
                  <div
                    key={idx}
                    className={cn(
                      "aspect-square rounded-md text-xs font-medium flex items-center justify-center transition-colors",
                      day === null && "opacity-0",
                      day !== null && !isPick && "bg-secondary/50 text-foreground/70",
                      isPick && "bg-primary text-primary-foreground font-bold"
                    )}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 text-center">
              <span className="inline-block h-2 w-2 rounded-full bg-primary mr-1 align-middle" />
              Selection day · Open reading day
            </p>
          </div>
        ))}
      </div>

      {/* Stages */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {residencyStages.map((stage, i) => (
          <div
            key={stage.number}
            className="relative p-6 rounded-2xl border border-border bg-card warm-card animate-fade-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <span className="font-serif text-5xl font-bold text-primary/20 absolute top-4 right-4">
              {stage.number}
            </span>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">
              Stage {stage.number}
            </p>
            <h3 className="font-serif text-lg font-semibold mb-2">{stage.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{stage.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
