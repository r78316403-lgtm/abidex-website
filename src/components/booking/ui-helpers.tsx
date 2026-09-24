"use client";

// =====================================================================
// SHARED BOOKING UI HELPERS
// =====================================================================

import { cn } from "@/lib/utils";

export function Section({
  id,
  children,
  className,
  alt,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  alt?: boolean; // use soft-sand background
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-16 sm:py-20 md:py-28 scroll-mt-24",
        alt && "bg-secondary/50",
        className
      )}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">{children}</div>
    </section>
  );
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-xs font-semibold uppercase tracking-[0.28em] text-accent mb-3", className)}>
      {children}
    </p>
  );
}

export function Heading({
  children,
  className,
  as: Comp = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Comp
      className={cn(
        "font-serif tracking-tight leading-[1.12]",
        Comp === "h1" && "text-4xl sm:text-5xl md:text-6xl font-bold",
        Comp === "h2" && "text-3xl md:text-4xl lg:text-5xl font-bold",
        Comp === "h3" && "text-2xl md:text-3xl font-semibold",
        className
      )}
    >
      {children}
    </Comp>
  );
}

export function Lead({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-base md:text-lg text-muted-foreground leading-relaxed mt-4 max-w-2xl", className)}>
      {children}
    </p>
  );
}

// Center-aligned heading block
export function HeadingBlock({
  eyebrow,
  title,
  lead,
  center = true,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(center && "text-center mx-auto", "max-w-3xl mb-12 md:mb-16", className)}>
      {eyebrow && <Eyebrow className={center ? "" : ""}>{eyebrow}</Eyebrow>}
      <Heading className={center ? "mx-auto" : ""}>{title}</Heading>
      {lead && <Lead className={center ? "mx-auto text-center" : ""}>{lead}</Lead>}
    </div>
  );
}
