"use client";

// =====================================================================
// FLOATING CONTACT BUTTONS — WhatsApp + Telegram
// ---------------------------------------------------------------------
// Persistent on every page on mobile & desktop. Lets visitors start a
// chat with one tap. Boosts conversions by reducing support friction.
// =====================================================================

import { useState, useSyncExternalStore } from "react";
import { whatsappLink, telegramLink } from "@/lib/site-config";
import { MessageCircle, Send, X } from "lucide-react";

const emptySubscribe = () => () => {};
const getServerSnapshot = () => false;
const getClientSnapshot = () => true;

export function FloatingContact() {
  const mounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
  const [open, setOpen] = useState(false);

  // Don't render on server to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
      {open && (
        <div className="flex flex-col gap-2 animate-fade-up">
          <a
            href={whatsappLink("Hello KEDI Healthcare, I'd like to know more about your products.")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="flex items-center gap-3 bg-[#25D366] text-white rounded-full pl-3 pr-4 py-2.5 shadow-lg hover:scale-105 transition-transform"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-medium">WhatsApp</span>
          </a>
          <a
            href={telegramLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on Telegram"
            className="flex items-center gap-3 bg-[#0088cc] text-white rounded-full pl-3 pr-4 py-2.5 shadow-lg hover:scale-105 transition-transform"
          >
            <Send className="h-5 w-5" />
            <span className="text-sm font-medium">Telegram</span>
          </a>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close contact options" : "Open contact options"}
        aria-expanded={open}
        className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-xl hover:scale-105 transition-transform flex items-center justify-center"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
