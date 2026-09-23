"use client";

// =====================================================================
// FLOATING CONTACT — Book / Concierge / WhatsApp / Telegram / Email
// =====================================================================

import { useState, useSyncExternalStore } from "react";
import {
  whatsappLink, telegramLink, emailLink,
  DEFAULT_WHATSAPP_MESSAGE, DEFAULT_EMAIL_SUBJECT,
} from "@/lib/site-config";
import { useBookingFlow } from "./booking-context";
import { CalendarCheck, MessageCircle, Send, Mail, Plus, X, Bot } from "lucide-react";

const emptySubscribe = () => () => {};
const getServer = () => false;
const getClient = () => true;

export function FloatingContact() {
  const mounted = useSyncExternalStore(emptySubscribe, getClient, getServer);
  const [open, setOpen] = useState(false);
  const { openBooking } = useBookingFlow();
  if (!mounted) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
      {/* Expanded options */}
      {open && (
        <div className="flex flex-col gap-2 animate-scale-in origin-bottom-right">
          <Action
            label="Book Now"
            color="bg-primary text-primary-foreground"
            icon={CalendarCheck}
            onClick={() => { setOpen(false); openBooking(); }}
          />
          <Action
            label="Chat with Concierge"
            color="bg-accent text-accent-foreground"
            icon={Bot}
            onClick={() => { setOpen(false); window.dispatchEvent(new CustomEvent("asr:open-concierge")); }}
          />
          <Action
            label="WhatsApp"
            color="bg-emerald-600 text-white"
            icon={MessageCircle}
            href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
            external
          />
          <Action
            label="Telegram"
            color="bg-sky-600 text-white"
            icon={Send}
            href={telegramLink()}
            external
          />
          <Action
            label="Email"
            color="bg-foreground text-background"
            icon={Mail}
            href={emailLink(DEFAULT_EMAIL_SUBJECT)}
          />
        </div>
      )}

      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close contact options" : "Open contact options"}
        aria-expanded={open}
        className="relative h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-2xl flex items-center justify-center hover:scale-105 transition-transform"
      >
        {open ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
        )}
      </button>
    </div>
  );
}

function Action({
  label, color, icon: Icon, href, external, onClick,
}: {
  label: string;
  color: string;
  icon: any;
  href?: string;
  external?: boolean;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <span className={`flex h-9 w-9 items-center justify-center rounded-full ${color} shadow-lg`}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-sm font-medium pr-1">{label}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="flex items-center gap-3 pl-1.5 pr-3 py-1.5 rounded-full glass shadow-xl hover:scale-105 transition-transform"
      >
        {inner}
      </a>
    );
  }
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 pl-1.5 pr-3 py-1.5 rounded-full glass shadow-xl hover:scale-105 transition-transform"
    >
      {inner}
    </button>
  );
}
