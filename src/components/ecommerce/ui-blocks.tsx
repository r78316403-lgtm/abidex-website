// =====================================================================
// SHARED UI BUILDING BLOCKS
// =====================================================================

import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

// --- Empty state ---
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-4">
        <Icon className="h-9 w-9 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-display font-semibold mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-md mb-6">{description}</p>
      )}
      {actionLabel && actionTo && (
        <Link to={actionTo}>
          <Button>{actionLabel}</Button>
        </Link>
      )}
      {actionLabel && onAction && !actionTo && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}

// --- Section heading ---
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  actionLabel,
  actionTo,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  actionLabel?: string;
  actionTo?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4 mb-6 sm:mb-8",
        align === "center" && "sm:flex-col sm:items-center text-center",
        className
      )}
    >
      <div className="flex-1">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-1.5">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xl">{description}</p>
        )}
      </div>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="text-sm font-medium text-accent hover:underline whitespace-nowrap">
          {actionLabel} →
        </Link>
      )}
    </div>
  );
}

// --- Trust indicator pills ---
export function TrustBadge({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="h-4 w-4 text-accent" />
      <span>{label}</span>
    </div>
  );
}
