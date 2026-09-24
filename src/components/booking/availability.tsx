"use client";

// =====================================================================
// AVAILABILITY — booking calendar with month nav + time slots
// =====================================================================

import { useState, useMemo } from "react";
import { Section, HeadingBlock } from "@/components/booking/ui-helpers";
import { Button } from "@/components/ui/button";
import { timeSlots } from "@/lib/booking-data";
import { useBookingFlow } from "./booking-context";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Availability() {
  const { openBooking } = useBookingFlow();
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Build calendar grid for the viewed month
  const calendar = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const firstOfMonth = new Date(viewMonth);
    const startDay = firstOfMonth.getDay(); // 0 = Sun
    const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d);
      cells.push(date);
    }
    // pad to multiple of 7
    while (cells.length % 7 !== 0) cells.push(null);
    return cells.map((date) => {
      if (!date) return null;
      const iso = date.toISOString().split("T")[0];
      const dow = date.getDay();
      const isPast = date < today;
      const isToday = iso === today.toISOString().split("T")[0];
      const unavailable = isPast || dow === 0; // Sundays
      const fullyBooked = !isPast && dow === 6; // Saturdays demo
      return { date, iso, unavailable, fullyBooked, isToday };
    });
  }, [viewMonth]);

  const prevMonth = () => {
    const d = new Date(viewMonth);
    d.setMonth(d.getMonth() - 1);
    // Don't go before current month
    const now = new Date();
    now.setDate(1);
    if (d < now) return;
    setViewMonth(d);
  };
  const nextMonth = () => {
    const d = new Date(viewMonth);
    d.setMonth(d.getMonth() + 1);
    setViewMonth(d);
  };

  return (
    <Section id="availability">
      <HeadingBlock
        eyebrow="Availability"
        title={<>Find a Time <span className="italic text-primary">That Works for You</span></>}
        lead="Browse available dates and time slots. Pick what works, and we'll take care of the rest."
      />

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 md:gap-8 max-w-5xl mx-auto">
        {/* Calendar */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-5">
            <Button variant="ghost" size="sm" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>
            <h3 className="font-serif text-xl font-semibold">
              {viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h3>
            <Button variant="ghost" size="sm" onClick={nextMonth}>
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-[10px] uppercase tracking-widest text-muted-foreground font-semibold py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendar.map((cell, i) => {
              if (!cell) return <div key={i} />;
              const { date, iso, unavailable, fullyBooked, isToday } = cell;
              const selected = selectedDate === iso;
              return (
                <button
                  key={iso}
                  disabled={unavailable}
                  onClick={() => setSelectedDate(iso)}
                  className={cn(
                    "relative aspect-square rounded-lg text-sm font-medium transition-all",
                    unavailable && "text-muted-foreground/40 cursor-not-allowed bg-secondary/20",
                    !unavailable && !selected && "hover:border-primary/40 hover:bg-primary/5 border border-border bg-background",
                    selected && "bg-primary text-primary-foreground border-2 border-primary",
                    fullyBooked && !selected && !unavailable && "bg-secondary/40 text-muted-foreground/60",
                    isToday && !selected && "ring-1 ring-accent"
                  )}
                >
                  {date.getDate()}
                  {fullyBooked && !selected && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-destructive" />
                  )}
                  {selected && (
                    <span className="absolute top-0.5 right-0.5">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t border-border text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-primary" />
              Selected
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded border border-border bg-background" />
              Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-secondary/40" />
              Fully Booked
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-secondary/20" />
              Unavailable
            </span>
          </div>
        </div>

        {/* Time slots */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="font-serif text-xl font-semibold">Time Slots</h3>
          </div>

          {selectedDate ? (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
              <div className="grid grid-cols-2 gap-2 mb-5">
                {timeSlots.map(({ time, available }) => (
                  <div
                    key={time}
                    className={cn(
                      "py-2.5 px-2 rounded-lg border text-sm text-center font-medium",
                      available
                        ? "border-border bg-background text-foreground"
                        : "border-border bg-secondary/40 text-muted-foreground/50 line-through"
                    )}
                  >
                    {time}
                  </div>
                ))}
              </div>
              <Button
                className="w-full"
                onClick={() => openBooking()}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Book This Date
              </Button>
            </>
          ) : (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Pick a date from the calendar to see available times.
              </p>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
