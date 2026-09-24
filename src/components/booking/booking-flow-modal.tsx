"use client";

// =====================================================================
// BOOKING FLOW MODAL — 6-step booking experience
// 1. Choose Service → 2. Choose Date → 3. Choose Time
// → 4. Customer Details → 5. Review → 6. Confirm
// =====================================================================

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBookingFlow } from "./booking-context";
import { services, timeSlots, type Service } from "@/lib/booking-data";
import {
  generateBookingReference, whatsappLink, buildBookingWhatsAppMessage,
  emailLink, buildBookingEmailBody, DEFAULT_EMAIL_SUBJECT, siteConfig,
} from "@/lib/site-config";
import {
  X, ArrowRight, ArrowLeft, Check, CalendarCheck, Clock, Users,
  Sparkles, CheckCircle2, Calendar, Plus, Mail, MessageCircle, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Service", "Date", "Time", "Details", "Review", "Confirm"];

type BookingState = {
  service: Service | null;
  date: string;          // ISO yyyy-mm-dd
  time: string;
  people: number;
  name: string;
  email: string;
  phone: string;
  notes: string;
};

const empty: BookingState = {
  service: null, date: "", time: "", people: 1,
  name: "", email: "", phone: "", notes: "",
};

export function BookingFlowModal() {
  const { bookingOpen, initialService, bookingSessionId, closeBooking } = useBookingFlow();

  // Lock body scroll while open
  useEffect(() => {
    if (bookingOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [bookingOpen]);

  if (!bookingOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={closeBooking}
        aria-hidden="true"
      />

      <BookingModalInner
        key={bookingSessionId}
        initialService={initialService}
        closeBooking={closeBooking}
      />
    </div>
  );
}

// Inner component remounts on each open (via key={bookingSessionId}),
// giving us a clean state reset without setState-in-effect.
function BookingModalInner({
  initialService,
  closeBooking,
}: {
  initialService: Service | null;
  closeBooking: () => void;
}) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<BookingState>({ ...empty, service: initialService });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bookingRef, setBookingRef] = useState<string>("");

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step < 5) closeBooking();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, closeBooking]);

  const set = <K extends keyof BookingState>(k: K, v: BookingState[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validateStep = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0 && !data.service) e.service = "Please choose a service";
    if (step === 2 && !data.time) e.time = "Please choose a time";
    if (step === 3) {
      if (!data.name.trim()) e.name = "Full name is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Valid email is required";
      if (!/^[0-9+\-\s()]{7,}$/.test(data.phone)) e.phone = "Valid phone number is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step === 4) {
      // Confirm — generate reference
      setBookingRef(generateBookingReference());
    }
    setStep((s) => Math.min(s + 1, 5));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="relative w-full max-w-2xl max-h-[94vh] overflow-y-auto asr-scroll rounded-2xl bg-card border border-border shadow-2xl animate-scale-in"
    >
      {/* Header — sticky with progress */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-md border-b border-border px-5 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accent">
              As Reference Booking
            </p>
            <h2 id="booking-modal-title" className="font-serif text-lg sm:text-xl font-bold">
              {step === 5 ? "Booking Confirmed" : `Step ${step + 1} of 5 — ${STEPS[step]}`}
            </h2>
          </div>
          {step < 5 && (
            <button
              onClick={closeBooking}
              aria-label="Close booking"
              className="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-secondary/60 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Progress bar */}
        {step < 5 && (
          <div className="mt-3 flex gap-1.5">
            {STEPS.slice(0, 5).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  i <= step ? "bg-primary" : "bg-secondary"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-5 sm:px-6 py-6">
        {step === 0 && <StepService data={data} set={set} errors={errors} />}
        {step === 1 && <StepDate data={data} set={set} />}
        {step === 2 && <StepTime data={data} set={set} errors={errors} />}
        {step === 3 && <StepDetails data={data} set={set} errors={errors} />}
        {step === 4 && <StepReview data={data} />}
        {step === 5 && <StepConfirm data={data} bookingRef={bookingRef} onReset={closeBooking} />}
      </div>

      {/* Footer nav */}
      {step < 5 && (
        <div className="sticky bottom-0 bg-card/95 backdrop-blur-md border-t border-border px-5 sm:px-6 py-4 flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            onClick={back}
            disabled={step === 0}
            className={cn(step === 0 && "invisible")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={next} disabled={step === 0 && !data.service}>
            {step === 4 ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirm Booking
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------
// STEP 1 — SERVICE
// ---------------------------------------------------------------------
function StepService({
  data, set, errors,
}: {
  data: BookingState;
  set: <K extends keyof BookingState>(k: K, v: BookingState[K]) => void;
  errors: Record<string, string>;
}) {
  return (
    <div>
      <h3 className="font-serif text-xl font-semibold mb-1">Choose a service</h3>
      <p className="text-sm text-muted-foreground mb-5">Select the experience that's right for you.</p>

      <div className="grid sm:grid-cols-2 gap-3">
        {services.map((s) => {
          const selected = data.service?.id === s.id;
          return (
            <button
              key={s.id}
              onClick={() => set("service", s)}
              className={cn(
                "group relative text-left p-4 rounded-xl border-2 transition-all",
                selected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:border-primary/40"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="h-14 w-14 rounded-lg overflow-hidden shrink-0 bg-secondary">
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-tight">{s.name}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {s.duration}
                    </span>
                    <span className="font-semibold text-primary">{s.price}</span>
                  </div>
                </div>
                {selected && (
                  <span className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {errors.service && <p className="text-xs text-destructive mt-3">{errors.service}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------
// STEP 2 — DATE
// ---------------------------------------------------------------------
function StepDate({
  data, set,
}: {
  data: BookingState;
  set: <K extends keyof BookingState>(k: K, v: BookingState[K]) => void;
}) {
  // Build a 14-day availability calendar starting today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split("T")[0];
      // Demo: Saturdays fully booked, Sundays unavailable
      const dow = d.getDay();
      const unavailable = dow === 0; // Sunday
      const fullyBooked = dow === 6; // Saturday
      return { date: d, iso, unavailable, fullyBooked };
    });
  }, [today]);

  return (
    <div>
      <h3 className="font-serif text-xl font-semibold mb-1">Choose a date</h3>
      <p className="text-sm text-muted-foreground mb-5">Pick a date that works for you. Next two weeks shown.</p>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {days.map(({ date, iso, unavailable, fullyBooked }) => {
          const selected = data.date === iso;
          const isToday = iso === today.toISOString().split("T")[0];
          return (
            <button
              key={iso}
              disabled={unavailable}
              onClick={() => set("date", iso)}
              className={cn(
                "relative aspect-[3/4] rounded-lg border-2 p-2 flex flex-col items-center justify-center transition-all",
                unavailable && "opacity-30 cursor-not-allowed border-border bg-secondary/30",
                !unavailable && !selected && "border-border bg-background hover:border-primary/40",
                selected && "border-primary bg-primary text-primary-foreground",
                fullyBooked && !selected && !unavailable && "border-border bg-secondary/50"
              )}
            >
              <span className="text-[10px] uppercase font-semibold tracking-wider opacity-70">
                {date.toLocaleDateString("en-US", { weekday: "short" })}
              </span>
              <span className="text-lg font-bold mt-0.5">{date.getDate()}</span>
              <span className="text-[9px] mt-0.5 opacity-70">
                {date.toLocaleDateString("en-US", { month: "short" })}
              </span>
              {fullyBooked && !selected && (
                <span className="text-[8px] uppercase font-semibold text-destructive mt-0.5">Full</span>
              )}
              {selected && (
                <Check className="absolute top-1 right-1 h-3 w-3" />
              )}
              {isToday && !selected && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-accent" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border-2 border-primary bg-primary" />
          Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border-2 border-border bg-background" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border-2 border-border bg-secondary/50" />
          Fully Booked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border-2 border-border bg-secondary/30 opacity-50" />
          Unavailable
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// STEP 3 — TIME
// ---------------------------------------------------------------------
function StepTime({
  data, set, errors,
}: {
  data: BookingState;
  set: <K extends keyof BookingState>(k: K, v: BookingState[K]) => void;
  errors: Record<string, string>;
}) {
  return (
    <div>
      <h3 className="font-serif text-xl font-semibold mb-1">Choose a time</h3>
      <p className="text-sm text-muted-foreground mb-5">
        {data.date
          ? `Available slots for ${new Date(data.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}`
          : "Available time slots"}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {timeSlots.map(({ time, available }) => {
          const selected = data.time === time;
          return (
            <button
              key={time}
              disabled={!available}
              onClick={() => set("time", time)}
              className={cn(
                "relative py-3 rounded-lg border-2 text-sm font-medium transition-all flex items-center justify-center gap-1.5",
                !available && "opacity-30 cursor-not-allowed border-border bg-secondary/30 text-muted-foreground line-through",
                available && !selected && "border-border bg-background hover:border-primary/40",
                selected && "border-primary bg-primary text-primary-foreground"
              )}
            >
              <Clock className="h-3.5 w-3.5" />
              {time}
              {selected && <Check className="h-3.5 w-3.5" />}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          <Users className="h-3.5 w-3.5 text-accent" />
          Number of people
        </Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button
              key={n}
              onClick={() => set("people", n)}
              className={cn(
                "h-10 w-10 rounded-lg border-2 text-sm font-semibold transition-all",
                data.people === n
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:border-primary/40"
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {errors.time && <p className="text-xs text-destructive mt-3">{errors.time}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------
// STEP 4 — CUSTOMER DETAILS
// ---------------------------------------------------------------------
function StepDetails({
  data, set, errors,
}: {
  data: BookingState;
  set: <K extends keyof BookingState>(k: K, v: BookingState[K]) => void;
  errors: Record<string, string>;
}) {
  return (
    <div>
      <h3 className="font-serif text-xl font-semibold mb-1">Your details</h3>
      <p className="text-sm text-muted-foreground mb-5">We'll send your booking confirmation here.</p>

      <div className="space-y-4">
        <FieldInput
          label="Full Name"
          icon={User}
          value={data.name}
          onChange={(v) => set("name", v)}
          error={errors.name}
          placeholder="Jane Doe"
          autoComplete="name"
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <FieldInput
            label="Email"
            icon={Mail}
            type="email"
            value={data.email}
            onChange={(v) => set("email", v)}
            error={errors.email}
            placeholder="you@email.com"
            autoComplete="email"
          />
          <FieldInput
            label="Phone Number"
            icon={MessageCircle}
            type="tel"
            value={data.phone}
            onChange={(v) => set("phone", v)}
            error={errors.phone}
            placeholder="+234 800 000 0000"
            autoComplete="tel"
          />
        </div>
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
            Optional Notes
          </Label>
          <Textarea
            value={data.notes}
            onChange={(e) => set("notes", e.target.value)}
            rows={3}
            placeholder="Anything we should know before your appointment?"
          />
        </div>
        <div className="p-3 rounded-lg bg-secondary/60 border border-border text-xs text-muted-foreground">
          <p>
            <strong className="text-foreground">Demo notice:</strong> This is a demonstration booking flow. No real
            appointment is reserved until we confirm with you directly. Your details are sent securely to our team.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// STEP 5 — REVIEW
// ---------------------------------------------------------------------
function StepReview({ data }: { data: BookingState }) {
  if (!data.service) return null;
  return (
    <div>
      <h3 className="font-serif text-xl font-semibold mb-1">Review your booking</h3>
      <p className="text-sm text-muted-foreground mb-5">Please double-check everything looks correct.</p>

      <div className="rounded-xl border border-border overflow-hidden">
        {/* Service image */}
        <div className="relative h-32 sm:h-40 bg-secondary">
          <img src={data.service.image} alt={data.service.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <p className="text-[10px] uppercase tracking-widest text-white/80 font-semibold">
              {data.service.category}
            </p>
            <p className="font-serif text-xl font-bold text-white">{data.service.name}</p>
          </div>
        </div>

        {/* Details */}
        <div className="divide-y divide-border">
          <ReviewRow icon={Sparkles} label="Service" value={data.service.name} />
          <ReviewRow icon={CalendarCheck} label="Date" value={data.date ? new Date(data.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : "—"} />
          <ReviewRow icon={Clock} label="Time" value={data.time || "—"} />
          <ReviewRow icon={Users} label="People" value={`${data.people} ${data.people === 1 ? "person" : "people"}`} />
          <ReviewRow icon={User} label="Name" value={data.name || "—"} />
          <ReviewRow icon={Mail} label="Email" value={data.email || "—"} />
          <ReviewRow icon={MessageCircle} label="Phone" value={data.phone || "—"} />
          {data.notes && <ReviewRow icon={Plus} label="Notes" value={data.notes} />}
          <ReviewRow icon={CalendarCheck} label="Duration" value={data.service.duration} />
          <ReviewRow icon={Sparkles} label="Price" value={data.service.price} highlight />
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        By confirming, you agree to our cancellation policy: {data.service.cancellation}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------
// STEP 6 — CONFIRM
// ---------------------------------------------------------------------
function StepConfirm({
  data, bookingRef, onReset,
}: {
  data: BookingState;
  bookingRef: string;
  onReset: () => void;
}) {
  const waMessage = useMemo(() => buildBookingWhatsAppMessage({
    name: data.name, email: data.email, phone: data.phone,
    service: data.service?.name, preferredDate: data.date, preferredTime: data.time,
    message: data.notes,
  }), [data]);
  const emailBody = useMemo(() => buildBookingEmailBody({
    name: data.name, email: data.email, phone: data.phone,
    service: data.service?.name, preferredDate: data.date, preferredTime: data.time,
    message: data.notes,
  }), [data]);

  // ICS calendar event
  const icsUrl = useMemo(() => {
    if (!data.service || !data.date || !data.time) return "";
    const [hh, mm] = parseTimeTo24h(data.time);
    const start = new Date(`${data.date}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00`);
    const end = new Date(start.getTime() + data.service.durationMinutes * 60_000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//As Reference//Booking//EN",
      "BEGIN:VEVENT",
      `UID:${bookingRef}@asreference.com`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${data.service.name} — As Reference`,
      `DESCRIPTION:Booking reference ${bookingRef}\\nFor: ${data.name}\\nPeople: ${data.people}`,
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    return URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  }, [data, bookingRef]);

  return (
    <div className="text-center py-2">
      <div className="inline-flex h-20 w-20 rounded-full bg-sage-green/15 items-center justify-center mb-4 animate-confirm-pop">
        <CheckCircle2 className="h-10 w-10 text-sage-green" style={{ color: "var(--sage-green)" }} />
      </div>
      <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-2">Booking Confirmed</h3>
      <p className="text-sm text-muted-foreground mb-5">
        Thank you, {data.name?.split(" ")[0] || "friend"}. We've received your request and will confirm shortly.
      </p>

      {/* Booking summary card */}
      <div className="rounded-xl border border-border bg-secondary/30 p-5 text-left max-w-md mx-auto mb-5">
        <div className="text-center mb-4 pb-4 border-b border-border">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">
            Booking Reference
          </p>
          <p className="font-mono text-lg font-bold text-primary">{bookingRef}</p>
        </div>
        <div className="space-y-2 text-sm">
          <ConfirmRow label="Service" value={data.service?.name ?? "—"} />
          <ConfirmRow label="Date" value={data.date ? new Date(data.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : "—"} />
          <ConfirmRow label="Time" value={data.time || "—"} />
          <ConfirmRow label="Name" value={data.name || "—"} />
          <ConfirmRow label="Email" value={data.email || "—"} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-5 max-w-md mx-auto">
        <strong className="text-foreground">Demo notice:</strong> This is a demonstration. To finalize your
        appointment, please send your booking details to us via WhatsApp or email below — our team will confirm
        availability within a few hours.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-2 justify-center max-w-md mx-auto">
        {icsUrl && (
          <Button asChild variant="outline">
            <a href={icsUrl} download={`as-reference-${bookingRef}.ics`}>
              <Calendar className="h-4 w-4 mr-2" />
              Add to Calendar
            </a>
          </Button>
        )}
        <Button asChild className="bg-emerald-700 hover:bg-emerald-600 text-white">
          <a href={whatsappLink(waMessage)} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat on WhatsApp
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href={emailLink(DEFAULT_EMAIL_SUBJECT, emailBody)}>
            <Mail className="h-4 w-4 mr-2" />
            Contact Us
          </a>
        </Button>
      </div>

      <button
        onClick={onReset}
        className="mt-6 text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
      >
        Close and return to site
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------
function FieldInput({
  label, icon: Icon, value, onChange, error, placeholder, type = "text", autoComplete,
}: {
  label: string;
  icon: any;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        <Icon className="h-3.5 w-3.5 text-accent" />
        {label}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn("h-11", error && "border-destructive")}
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

function ReviewRow({
  icon: Icon, label, value, highlight,
}: {
  icon: any; label: string; value: string; highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <span className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
        <Icon className="h-3.5 w-3.5 text-accent" />
        {label}
      </span>
      <span className={cn("text-sm font-medium text-right", highlight && "text-primary font-bold")}>
        {value}
      </span>
    </div>
  );
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

function parseTimeTo24h(time: string): [number, number] {
  // "09:00 AM" → [9, 0]
  const match = time.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return [9, 0];
  let [, h, m, period] = match;
  let hh = parseInt(h, 10);
  if (period.toUpperCase() === "PM" && hh !== 12) hh += 12;
  if (period.toUpperCase() === "AM" && hh === 12) hh = 0;
  return [hh, parseInt(m, 10)];
}
