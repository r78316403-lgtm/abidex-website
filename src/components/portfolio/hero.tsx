"use client";

// =====================================================================
// HERO — badge, headline, CTAs, availability, quick contact, AI visuals
// =====================================================================

import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Send, Mail, Sparkles, Bot, Workflow, Zap } from "lucide-react";
import {
  whatsappLink,
  telegramLink,
  emailLink,
  DEFAULT_WHATSAPP_MESSAGE,
  DEFAULT_EMAIL_SUBJECT,
} from "@/lib/site-config";

export function Hero() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] bg-glow-blue rounded-full -z-10" />
      <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] bg-glow-violet rounded-full -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
          {/* LEFT — copy */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary/40 backdrop-blur text-xs font-medium tracking-wider mb-6 animate-fade-up">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-soft-pulse" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-muted-foreground">AI • AUTOMATION • DIGITAL SYSTEMS</span>
            </div>

            {/* Headline */}
            <h1 className="font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-[1.05] animate-fade-up" style={{ animationDelay: "100ms" }}>
              I Build <span className="text-gradient">AI-Powered Systems</span> That Help Businesses Work Smarter.
            </h1>

            {/* Supporting text */}
            <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
              I help businesses automate repetitive processes, capture and follow up with
              leads, deploy AI agents, and build digital experiences designed to improve
              efficiency and growth.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-fade-up" style={{ animationDelay: "300ms" }}>
              <Button size="lg" className="group" onClick={() => scrollTo("#contact")}>
                Start a Project
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => scrollTo("#projects")}>
                View My Work
              </Button>
            </div>

            {/* Availability */}
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground justify-center lg:justify-start animate-fade-up" style={{ animationDelay: "400ms" }}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-soft-pulse" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Available for new projects
            </div>

            {/* Quick contact actions */}
            <div className="mt-8 pt-8 border-t border-border animate-fade-up" style={{ animationDelay: "500ms" }}>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 text-center lg:text-left">
                Or reach me directly
              </p>
              <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto lg:mx-0">
                <a
                  href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border bg-secondary/30 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all"
                  aria-label="Chat on WhatsApp"
                >
                  <MessageCircle className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">WhatsApp</span>
                  <span className="text-[10px] text-muted-foreground">Chat directly</span>
                </a>
                <a
                  href={telegramLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border bg-secondary/30 hover:border-sky-500/50 hover:bg-sky-500/5 transition-all"
                  aria-label="Message on Telegram"
                >
                  <Send className="h-5 w-5 text-sky-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">Telegram</span>
                  <span className="text-[10px] text-muted-foreground">@ahmedabiola</span>
                </a>
                <a
                  href={emailLink(DEFAULT_EMAIL_SUBJECT)}
                  className="group flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border bg-secondary/30 hover:border-primary/50 hover:bg-primary/5 transition-all"
                  aria-label="Send an email"
                >
                  <Mail className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">Email</span>
                  <span className="text-[10px] text-muted-foreground truncate w-full text-center">ahmedbiola2025</span>
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT — animated AI visual */}
          <div className="relative hidden lg:flex items-center justify-center h-[500px] xl:h-[600px] animate-fade-in" style={{ animationDelay: "400ms" }}>
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// HERO VISUAL — abstract AI/automation node network with floating cards
// ---------------------------------------------------------------------
function HeroVisual() {
  return (
    <div className="relative w-full h-full">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border border-border/40 animate-[spin_60s_linear_infinite]" />
      <div className="absolute inset-8 rounded-full border border-border/30 animate-[spin_45s_linear_infinite_reverse]" />
      <div className="absolute inset-16 rounded-full border border-border/20" />

      {/* Center node with glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-primary/30 blur-2xl scale-150" />
          <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl">
            <Bot className="h-10 w-10 text-white" />
          </div>
        </div>
      </div>

      {/* SVG connecting lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 500 500"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {/* Lines from center to floating cards */}
        <line x1="250" y1="250" x2="100" y2="80" stroke="url(#line-grad)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="250" y1="250" x2="420" y2="120" stroke="url(#line-grad)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="250" y1="250" x2="80" y2="380" stroke="url(#line-grad)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="250" y1="250" x2="400" y2="400" stroke="url(#line-grad)" strokeWidth="1" strokeDasharray="4 4" />
      </svg>

      {/* Floating mini-cards */}
      <FloatingCard
        className="top-[8%] left-[5%] animate-float"
        icon={Workflow}
        label="Workflow"
        accent="text-primary"
      />
      <FloatingCard
        className="top-[12%] right-[5%] animate-float"
        style={{ animationDelay: "0.6s" }}
        icon={Zap}
        label="Automation"
        accent="text-violet-400"
      />
      <FloatingCard
        className="bottom-[15%] left-[5%] animate-float"
        style={{ animationDelay: "1.2s" }}
        icon={MessageCircle}
        label="WhatsApp"
        accent="text-emerald-400"
      />
      <FloatingCard
        className="bottom-[10%] right-[5%] animate-float"
        style={{ animationDelay: "1.8s" }}
        icon={Sparkles}
        label="AI Agent"
        accent="text-cyan-400"
      />

      {/* Particle dots */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 200;
        const x = 50 + (Math.cos(angle) * radius) / 5;
        const y = 50 + (Math.sin(angle) * radius) / 5;
        return (
          <div
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-primary/60 animate-soft-pulse"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              animationDelay: `${i * 200}ms`,
            }}
          />
        );
      })}
    </div>
  );
}

function FloatingCard({
  icon: Icon,
  label,
  className,
  style,
  accent,
}: {
  icon: any;
  label: string;
  className?: string;
  style?: React.CSSProperties;
  accent: string;
}) {
  return (
    <div
      className={`absolute glass rounded-xl px-3 py-2.5 flex items-center gap-2 shadow-xl ${className ?? ""}`}
      style={style}
    >
      <Icon className={`h-4 w-4 ${accent}`} />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}
