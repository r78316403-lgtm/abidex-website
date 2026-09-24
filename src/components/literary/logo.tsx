// =====================================================================
// ABIDEX LOGO — premium SVG monogram
// Serif "A" inside an elegant burgundy seal with gold accents
// =====================================================================

import { cn } from "@/lib/utils";

export function AbidexLogo({
  className,
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Abidex logo"
    >
      {/* Outer seal circle — burgundy */}
      <circle cx="32" cy="32" r="30" fill="var(--deep-burgundy, #743B3B)" />
      {/* Gold ring */}
      <circle cx="32" cy="32" r="27" stroke="var(--muted-gold, #B79A63)" strokeWidth="0.8" fill="none" opacity="0.6" />
      <circle cx="32" cy="32" r="25" stroke="var(--muted-gold, #B79A63)" strokeWidth="0.4" fill="none" opacity="0.4" />

      {/* Serif "A" monogram — gold */}
      <path
        d="M32 14 L42 50 L37 50 L34.8 41 L29.2 41 L27 50 L22 50 Z M30 37 L34 37 L32 27 Z"
        fill="var(--muted-gold, #B79A63)"
      />

      {/* Small decorative dots */}
      <circle cx="32" cy="7" r="1" fill="var(--muted-gold, #B79A63)" />
      <circle cx="32" cy="57" r="1" fill="var(--muted-gold, #B79A63)" />
      <circle cx="7" cy="32" r="1" fill="var(--muted-gold, #B79A63)" />
      <circle cx="57" cy="32" r="1" fill="var(--muted-gold, #B79A63)" />
    </svg>
  );
}

// Wordmark version — logo + "ABIDEX" text
export function AbidexWordmark({
  className,
  size = 40,
  showTagline = false,
}: {
  className?: string;
  size?: number;
  showTagline?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <AbidexLogo size={size} />
      <div className="leading-none">
        <span className="font-serif font-bold text-lg tracking-[0.15em] block">ABIDEX</span>
        {showTagline && (
          <span className="text-[8px] uppercase tracking-[0.25em] text-muted-foreground">
            Est. 2010
          </span>
        )}
      </div>
    </div>
  );
}
