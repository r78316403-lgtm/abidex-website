"use client";

// =====================================================================
// FLOATING CONTACT — WhatsApp / Telegram / Email
// =====================================================================

import { useState, useSyncExternalStore } from "react";
import {
  whatsappLink, telegramLink, emailLink,
  DEFAULT_WHATSAPP_MESSAGE, DEFAULT_EMAIL_SUBJECT,
} from "@/lib/site-config";
import { MessageCircle, Send, Mail, Plus, X } from "lucide-react";

const emptySubscribe = () => () => {};
const getServer = () => false;
const getClient = () => true;

export function FloatingContact() {
  const mounted = useSyncExternalStore(emptySubscribe, getClient, getServer);
  const [open, setOpen] = useState(false);
  if (!mounted) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
      {open && (
        <div className="flex flex-col gap-2 animate-scale-in origin-bottom-right">
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
            color="bg-primary text-primary-foreground"
            icon={Mail}
            href={emailLink(DEFAULT_EMAIL_SUBJECT)}
          />
        </div>
      )}

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
  label, color, icon: Icon, href, external,
}: {
  label: string;
  color: string;
  icon: any;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex items-center gap-3 pl-1.5 pr-3 py-1.5 rounded-full glass shadow-xl hover:scale-105 transition-transform"
      style={{ background: "var(--card)" }}
    >
      <span className={`flex h-9 w-9 items-center justify-center rounded-full ${color} shadow-lg`}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-sm font-medium pr-1">{label}</span>
    </a>
  );
}
