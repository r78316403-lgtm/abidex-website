"use client";

// =====================================================================
// SERVICE DETAIL MODAL — full service info + Book This Service / Ask
// =====================================================================

import { Button } from "@/components/ui/button";
import { useBookingFlow } from "./booking-context";
import {
  whatsappLink, emailLink, DEFAULT_EMAIL_SUBJECT, siteConfig,
} from "@/lib/site-config";
import {
  X, Clock, Check, CalendarCheck, MessageCircle, Mail, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ServiceDetailModal() {
  const { detailService, closeDetail, openBooking } = useBookingFlow();

  if (!detailService) return null;
  const s = detailService;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={closeDetail}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-detail-title"
        className="relative w-full max-w-2xl max-h-[94vh] overflow-y-auto asr-scroll rounded-2xl bg-card border border-border shadow-2xl animate-scale-in"
      >
        {/* Hero image */}
        <div className="relative h-48 sm:h-64 bg-secondary">
          <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
          <button
            onClick={closeDetail}
            className="absolute top-4 right-4 h-9 w-9 inline-flex items-center justify-center rounded-full bg-card/95 backdrop-blur shadow hover:bg-secondary transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-4 left-5 right-5">
            <p className="text-[10px] uppercase tracking-widest text-accent font-semibold mb-1">
              {s.category}
            </p>
            <h2 id="service-detail-title" className="font-serif text-2xl sm:text-3xl font-bold">
              {s.name}
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6">
          {/* Meta row */}
          <div className="grid grid-cols-3 gap-3 mb-5 pb-5 border-b border-border">
            <Meta label="Duration" value={s.duration} icon={Clock} />
            <Meta label="Price" value={s.price} icon={CalendarCheck} />
            <Meta label="Availability" value={s.availability} icon={Check} />
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">
            {s.longDescription}
          </p>

          {/* What's included */}
          <div className="mb-5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              What's Included
            </h3>
            <ul className="space-y-2">
              {s.included.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-green/15">
                    <Check className="h-3 w-3" style={{ color: "var(--sage-green)" }} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cancellation */}
          <div className="p-3 rounded-lg bg-secondary/60 border border-border mb-6">
            <p className="text-xs">
              <strong className="font-semibold">Cancellation policy:</strong>{" "}
              <span className="text-muted-foreground">{s.cancellation}</span>
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              size="lg"
              className="flex-1 group"
              onClick={() => { closeDetail(); setTimeout(() => openBooking(s), 100); }}
            >
              <CalendarCheck className="h-4 w-4 mr-2" />
              Book This Service
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
            >
              <a
                href={whatsappLink(`Hello As Reference, I have a question about ${s.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Ask a Question
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="text-center sm:text-left">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-1 justify-center sm:justify-start mb-1">
        <Icon className="h-3 w-3 text-accent" />
        {label}
      </p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}
