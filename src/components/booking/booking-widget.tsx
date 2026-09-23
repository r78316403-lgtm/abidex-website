"use client";

// =====================================================================
// BOOKING WIDGET — "Reserve Your Spot" quick availability checker
// Fields: Service, Date, Time, Number of people → Check Availability
// Opens the full multi-step booking flow with the selections prefilled
// =====================================================================

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { services, timeSlots } from "@/lib/booking-data";
import { useBookingFlow } from "./booking-context";
import { CalendarCheck, Users, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function BookingWidget() {
  const { openBooking } = useBookingFlow();
  return (
    <div className="relative max-w-5xl mx-auto">
      {/* Glow behind */}
      <div className="absolute -inset-2 bg-glow-burgundy rounded-3xl -z-10" />

      <div className="relative bg-card rounded-2xl border border-border shadow-xl p-6 md:p-8">
        <div className="flex items-center gap-2 mb-5">
          <CalendarCheck className="h-5 w-5 text-primary" />
          <h2 className="font-serif text-2xl md:text-3xl font-bold">Reserve Your Spot</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6 -mt-4 ml-7">
          Tell us what you're looking for and we'll show you available times.
        </p>

        <form
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            openBooking();
          }}
        >
          {/* Service */}
          <Field label="Service" icon={Sparkles}>
            <select className="asr-input h-11 w-full px-3 rounded-md bg-background border border-border text-sm">
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </Field>

          {/* Date */}
          <Field label="Date" icon={CalendarCheck}>
            <Input type="date" className="h-11" />
          </Field>

          {/* Time */}
          <Field label="Time" icon={Clock}>
            <select className="asr-input h-11 w-full px-3 rounded-md bg-background border border-border text-sm">
              {timeSlots.map((t) => (
                <option key={t.time} value={t.time} disabled={!t.available}>
                  {t.time}{!t.available ? " — Full" : ""}
                </option>
              ))}
            </select>
          </Field>

          {/* People */}
          <Field label="Number of people" icon={Users}>
            <select className="asr-input h-11 w-full px-3 rounded-md bg-background border border-border text-sm">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? "person" : "people"}</option>
              ))}
            </select>
          </Field>

          {/* CTA — full width */}
          <div className="sm:col-span-2 lg:col-span-4 mt-2">
            <Button type="submit" size="lg" className="w-full sm:w-auto">
              <CalendarCheck className="h-4 w-4 mr-2" />
              Check Availability
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              No payment required to check. You'll only pay once your booking is confirmed.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        <Icon className="h-3.5 w-3.5 text-accent" />
        {label}
      </Label>
      {children}
    </div>
  );
}
