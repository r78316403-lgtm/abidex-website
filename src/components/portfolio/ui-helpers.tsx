"use client";

// =====================================================================
// SHARED PORTFOLIO UI HELPERS
// =====================================================================

import { cn } from "@/lib/utils";

// Section wrapper for consistent horizontal padding + max width
export function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("relative py-16 sm:py-20 md:py-28 scroll-mt-20", className)}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">{children}</div>
    </section>
  );
}

// Eyebrow text (small label above headings)
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-3">
      {children}
    </p>
  );
}

// Section heading
export function Heading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "font-sans text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]",
        className
      )}
    >
      {children}
    </h2>
  );
}

// Lead paragraph below heading
export function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base md:text-lg text-muted-foreground leading-relaxed mt-4 max-w-2xl">
      {children}
    </p>
  );
}

// Decorative grid background wrapper
export function GridBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}
