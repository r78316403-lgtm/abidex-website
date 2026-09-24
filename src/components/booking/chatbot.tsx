"use client";

// =====================================================================
// AS REFERENCE CONCIERGE — warm customer-service chatbot
// Powered by z-ai-web-dev-sdk via /api/concierge/chat
// Lead capture → WhatsApp/Email handoff
// =====================================================================

import { useState, useRef, useEffect, useSyncExternalStore, useCallback } from "react";
import { chatSuggestions } from "@/lib/booking-data";
import { services } from "@/lib/booking-data";
import {
  siteConfig, whatsappLink, emailLink,
  buildBookingWhatsAppMessage, buildBookingEmailBody,
  DEFAULT_EMAIL_SUBJECT,
} from "@/lib/site-config";
import { useBookingFlow } from "./booking-context";
import {
  Bot, X, Send, Sparkles, MessageCircle, Mail, ArrowRight,
  RefreshCw, User, HeartHandshake,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "user" | "assistant";
type Message = {
  role: Role;
  content: string;
  leadData?: LeadData | null;
  handoff?: boolean; // show WhatsApp/Email buttons
};

type LeadData = {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
};

const emptySubscribe = () => () => {};
const getServer = () => false;
const getClient = () => true;

const GREETING =
  "Hello! 👋 Welcome to As Reference. I'm your Booking Concierge. I can help you choose a service, check booking options, answer questions, or connect you with our team. What are you looking for today?";

export function ConciergeChatbot() {
  const mounted = useSyncExternalStore(emptySubscribe, getClient, getServer);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [completedLead, setCompletedLead] = useState<LeadData | null>(null);
  const { openBooking } = useBookingFlow();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, sending]);

  // Focus on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 250);
  }, [open]);

  // Listen for "open concierge" event from FloatingContact
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("asr:open-concierge", handler);
    return () => window.removeEventListener("asr:open-concierge", handler);
  }, []);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setSending(true);

    try {
      const r = await fetch("/api/concierge/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!r.ok) throw new Error("Chat failed");
      const data = await r.json() as {
        text: string;
        leadCollected?: boolean;
        leadData?: LeadData | null;
        handoff?: boolean;
      };

      const assistantMessage: Message = {
        role: "assistant",
        content: data.text,
        leadData: data.leadCollected ? data.leadData : null,
        handoff: data.handoff || data.leadCollected,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      if (data.leadCollected && data.leadData) {
        setCompletedLead(data.leadData);
      }
    } catch (err) {
      console.error("Concierge error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. You can reach us directly on WhatsApp at +234 703 756 8457 or email profabiolabukclub@gmail.com.",
          handoff: true,
        },
      ]);
    } finally {
      setSending(false);
    }
  }, [messages, sending]);

  const reset = useCallback(() => {
    setMessages([{ role: "assistant", content: GREETING }]);
    setCompletedLead(null);
    setInput("");
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Floating chatbot button — bottom-LEFT */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open As Reference Concierge chatbot"
          className="fixed bottom-5 left-5 z-40 flex items-center gap-2 pl-3 pr-4 py-3 rounded-full bg-card border border-border shadow-2xl hover:shadow-xl hover:scale-105 transition-all group"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-accent">
            <Bot className="h-4 w-4 text-accent-foreground" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-card" />
          </span>
          <span className="text-sm font-semibold text-foreground">Concierge</span>
          <span className="absolute inset-0 rounded-full bg-accent/20 animate-ping -z-10" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-5 sm:left-5 z-50 sm:w-[400px] sm:max-w-[calc(100vw-2.5rem)] sm:h-[600px] sm:max-h-[calc(100vh-2.5rem)]">
          {/* Mobile overlay */}
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm sm:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="concierge-title"
            className="relative w-full h-full sm:rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden animate-scale-in origin-bottom-left"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/40">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-accent/30 blur-md scale-150" />
                  <div className="relative h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                    <HeartHandshake className="h-5 w-5 text-accent-foreground" />
                  </div>
                </div>
                <div>
                  <p id="concierge-title" className="text-sm font-semibold">
                    As Reference Concierge
                  </p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Online · Here to help
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={reset}
                  aria-label="Restart conversation"
                  className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-secondary/60 transition-colors text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close concierge"
                  className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-secondary/60 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto asr-scroll p-4 space-y-4 bg-background/40"
            >
              {messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} onBookNow={() => { setOpen(false); setTimeout(() => openBooking(), 100); }} />
              ))}

              {/* Typing indicator */}
              {sending && (
                <div className="flex items-start gap-2.5">
                  <Avatar />
                  <div className="rounded-2xl rounded-bl-sm bg-card border border-border px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-accent/60 animate-blink" />
                      <span className="h-2 w-2 rounded-full bg-accent/60 animate-blink" style={{ animationDelay: "200ms" }} />
                      <span className="h-2 w-2 rounded-full bg-accent/60 animate-blink" style={{ animationDelay: "400ms" }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Lead handoff card */}
              {completedLead && (
                <LeadHandoff lead={completedLead} onBookNow={() => { setOpen(false); setTimeout(() => openBooking(), 100); }} />
              )}
            </div>

            {/* Suggested prompts */}
            {messages.length === 1 && !sending && (
              <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                {chatSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="px-2.5 py-1.5 rounded-full text-xs font-medium border border-border bg-card hover:border-primary/50 hover:text-primary transition-colors text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border bg-card">
              <form
                onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={sending}
                  className="flex-1 h-11 px-4 rounded-full bg-background border border-border text-sm focus:outline-none focus:border-primary/60 placeholder:text-muted-foreground disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  aria-label="Send message"
                  className="h-11 w-11 shrink-0 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40 hover:scale-105 transition-transform"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
              <p className="text-[10px] text-muted-foreground text-center mt-2 flex items-center justify-center gap-1">
                <Sparkles className="h-3 w-3" />
                Powered by As Reference Concierge
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------
// MESSAGE BUBBLE
// ---------------------------------------------------------------------
function MessageBubble({ message, onBookNow }: { message: Message; onBookNow: () => void }) {
  const isUser = message.role === "user";

  // If assistant message includes a "book" CTA hint, render a Book Now button
  const showBookButton = !isUser && /book|availability|schedule|reserve/i.test(message.content) && !message.handoff;

  return (
    <div className={cn("flex items-start gap-2.5", isUser && "flex-row-reverse")}>
      {!isUser && <Avatar />}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-card border border-border rounded-bl-sm"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>

        {/* Inline Book Now button */}
        {showBookButton && (
          <button
            onClick={onBookNow}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold hover:bg-accent/90 transition-colors"
          >
            <CalendarCheck2 />
            Check Availability
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}

function CalendarCheck2() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <polyline points="9 16 11 18 15 14" />
    </svg>
  );
}

function Avatar() {
  return (
    <div className="h-8 w-8 shrink-0 rounded-full bg-accent flex items-center justify-center shadow-md">
      <HeartHandshake className="h-4 w-4 text-accent-foreground" />
    </div>
  );
}

// ---------------------------------------------------------------------
// LEAD HANDOFF CARD
// ---------------------------------------------------------------------
function LeadHandoff({ lead, onBookNow }: { lead: LeadData; onBookNow: () => void }) {
  const waMessage = buildBookingWhatsAppMessage(lead);
  const emailBody = buildBookingEmailBody(lead);

  return (
    <div className="mt-2 rounded-2xl border border-primary/40 bg-primary/5 p-4 animate-scale-in">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <p className="text-sm font-semibold">Thanks! Your request has been captured.</p>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        You can continue with your booking or contact our team directly — your details are ready to send.
      </p>

      <div className="flex flex-col gap-2">
        <button
          onClick={onBookNow}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <CalendarCheck2 />
          Continue Booking
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
        <div className="grid grid-cols-2 gap-2">
          <a
            href={whatsappLink(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp Us
          </a>
          <a
            href={emailLink(DEFAULT_EMAIL_SUBJECT, emailBody)}
            className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-card hover:border-primary/50 text-xs font-medium transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            Send Email
          </a>
        </div>
      </div>
    </div>
  );
}
