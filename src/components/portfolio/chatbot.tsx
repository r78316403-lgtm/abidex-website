"use client";

// =====================================================================
// ABIDEX AI CHATBOT
// Floating button "Ask Abidex AI" + conversational interface with:
// - Suggested prompts
// - LLM-powered responses (via /api/abidex/chat)
// - Lead collection mode → WhatsApp + Email handoff with prefilled data
// =====================================================================

import { useState, useRef, useEffect, useSyncExternalStore, useCallback } from "react";
import { chatSuggestions } from "@/lib/abidex-data";
import {
  siteConfig,
  whatsappLink,
  emailLink,
  buildLeadWhatsAppMessage,
  buildLeadEmailBody,
} from "@/lib/site-config";
import { Bot, X, Send, Sparkles, MessageCircle, Mail, ArrowRight, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "user" | "assistant";
type Message = {
  role: Role;
  content: string;
  // Lead data attached to the final assistant message
  leadData?: LeadData | null;
};

type LeadData = {
  name?: string;
  business?: string;
  email?: string;
  whatsapp?: string;
  service?: string;
  project?: string;
  budget?: string;
  contactMethod?: string;
};

// Server-side render returns false, client returns true
const emptySubscribe = () => () => {};
const getServer = () => false;
const getClient = () => true;

const GREETING =
  "Hi 👋 I'm Abidex AI. I can help you learn about Abidex's services, explore automation opportunities, or help you start a project. What are you looking to build?";

export function AbidexChatbot() {
  const mounted = useSyncExternalStore(emptySubscribe, getClient, getServer);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [completedLead, setCompletedLead] = useState<LeadData | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, sending]);

  // Focus input when opening
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  // Listen for the "open chatbot" event dispatched by FloatingContact
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("abidex:open-chatbot", handler);
    return () => window.removeEventListener("abidex:open-chatbot", handler);
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
      const r = await fetch("/api/abidex/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Send only role + content, mapping system out
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!r.ok) throw new Error("Chat request failed");
      const data = await r.json() as {
        text: string;
        leadCollected?: boolean;
        leadData?: LeadData | null;
      };

      const assistantMessage: Message = {
        role: "assistant",
        content: data.text,
        leadData: data.leadCollected ? data.leadData : null,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      if (data.leadCollected && data.leadData) {
        setCompletedLead(data.leadData);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't connect to the AI right now. Please reach Abidex directly on WhatsApp at +234 916 208 0741 or email ahmedabiola2025@gmail.com.",
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
      {/* Floating chatbot button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open Abidex AI chatbot"
          className="fixed bottom-5 left-5 z-40 flex items-center gap-2 pl-3 pr-4 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-2xl hover:scale-105 transition-transform group"
        >
          <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
            <Bot className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-primary" />
          </span>
          <span className="text-sm font-semibold">Ask Abidex AI</span>
          <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping -z-10" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-5 sm:left-5 z-50 sm:w-[400px] sm:max-w-[calc(100vw-2.5rem)] sm:h-[600px] sm:max-h-[calc(100vh-2.5rem)]">
          {/* Mobile overlay */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-md sm:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="chatbot-title"
            className="relative w-full h-full sm:rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden animate-scale-in origin-bottom-left"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-primary/40 blur-md scale-150" />
                  <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <p id="chatbot-title" className="text-sm font-semibold">
                    Abidex AI
                  </p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Online · Ready to help
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
                  aria-label="Close chatbot"
                  className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-secondary/60 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto abidex-scroll p-4 space-y-4 bg-background/30"
            >
              {messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
              ))}

              {/* Typing indicator */}
              {sending && (
                <div className="flex items-start gap-2.5">
                  <Avatar />
                  <div className="rounded-2xl rounded-bl-sm bg-card border border-border px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-primary/60 animate-blink" />
                      <span className="h-2 w-2 rounded-full bg-primary/60 animate-blink" style={{ animationDelay: "200ms" }} />
                      <span className="h-2 w-2 rounded-full bg-primary/60 animate-blink" style={{ animationDelay: "400ms" }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Lead handoff card */}
              {completedLead && (
                <LeadHandoff lead={completedLead} />
              )}
            </div>

            {/* Suggested prompts (only show when 1 message — the greeting) */}
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
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
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
                  className="h-11 w-11 shrink-0 inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white disabled:opacity-40 hover:scale-105 transition-transform"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
              <p className="text-[10px] text-muted-foreground text-center mt-2 flex items-center justify-center gap-1">
                <Sparkles className="h-3 w-3" />
                Powered by Abidex AI
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
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex items-start gap-2.5", isUser && "flex-row-reverse")}>
      {!isUser && <Avatar />}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-gradient-to-br from-primary to-accent text-white rounded-br-sm"
            : "bg-card border border-border rounded-bl-sm"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
      <Bot className="h-4 w-4 text-white" />
    </div>
  );
}

// ---------------------------------------------------------------------
// LEAD HANDOFF CARD — shows WhatsApp + Email buttons with prefilled data
// ---------------------------------------------------------------------
function LeadHandoff({ lead }: { lead: LeadData }) {
  const waMessage = buildLeadWhatsAppMessage(lead);
  const emailBody = buildLeadEmailBody(lead);

  return (
    <div className="mt-4 rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/10 to-accent/10 p-4 animate-scale-in">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <p className="text-sm font-semibold">Thanks! Your project details are ready to be sent to Abidex.</p>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Pick your preferred channel — your message will be pre-filled with everything we just discussed.
      </p>

      <div className="flex flex-col sm:flex-row gap-2">
        <a
          href={whatsappLink(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          Continue on WhatsApp
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
        <a
          href={emailLink("New Project Inquiry — Abidex", emailBody)}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card hover:border-primary/50 text-sm font-medium transition-colors"
        >
          <Mail className="h-4 w-4" />
          Send by Email
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
