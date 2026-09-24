"use client";

// =====================================================================
// LEAD GEN — newsletter + contact form
// =====================================================================

import { useState } from "react";
import { Section, Eyebrow, Heading, Lead } from "@/components/booking/ui-helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { services } from "@/lib/booking-data";
import { toast } from "sonner";
import { Mail, Send, CheckCircle2, User, Phone, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export function LeadGen() {
  return (
    <Section id="lead" alt>
      <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
        {/* Newsletter */}
        <NewsletterCard />
        {/* Contact form */}
        <ContactFormCard />
      </div>
    </Section>
  );
}

function NewsletterCard() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter your name and a valid email.");
      return;
    }
    setSubmitting(true);
    try {
      const r = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "newsletter", firstName, email }),
      });
      if (r.ok) {
        setDone(true);
        toast.success("You're on the list! Watch your inbox for updates.");
      } else {
        toast.error("Couldn't subscribe — please try again.");
      }
    } catch {
      toast.error("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card">
      <Eyebrow>Stay in the Loop</Eyebrow>
      <Heading as="h3" className="text-2xl md:text-3xl">
        Get updates & availability
      </Heading>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        Get updates, special offers, availability alerts, and useful information delivered to your inbox.
      </p>

      {done ? (
        <div className="mt-6 p-5 rounded-xl bg-sage-green/10 border border-sage-green/30 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "var(--sage-green)" }} />
          <div>
            <p className="text-sm font-semibold mb-0.5">You're subscribed!</p>
            <p className="text-xs text-muted-foreground">We'll be in touch soon. No spam, ever.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-3">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
              First Name
            </Label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Your first name"
              className="h-11"
              required
            />
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
              Email
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="h-11"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            <Mail className="h-4 w-4 mr-2" />
            {submitting ? "Subscribing..." : "Stay Updated"}
          </Button>
        </form>
      )}
    </div>
  );
}

function ContactFormCard() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", service: "", message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Valid email required";
    if (!form.message.trim() || form.message.trim().length < 10) errs.message = "Please tell us a bit more (10+ characters)";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const r = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", ...form }),
      });
      if (r.ok) {
        setDone(true);
        toast.success("Inquiry sent! We'll be in touch soon.");
        setForm({ name: "", email: "", phone: "", service: "", message: "" });
      } else {
        toast.error("Couldn't send — please try again.");
      }
    } catch {
      toast.error("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card">
      <Eyebrow>Send an Inquiry</Eyebrow>
      <Heading as="h3" className="text-2xl md:text-3xl">
        Tell us what you need
      </Heading>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        Have a specific question or special request? Send us a message and we'll get back to you within a few hours.
      </p>

      {done ? (
        <div className="mt-6 p-5 rounded-xl bg-sage-green/10 border border-sage-green/30 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "var(--sage-green)" }} />
          <div>
            <p className="text-sm font-semibold mb-0.5">Inquiry sent!</p>
            <p className="text-xs text-muted-foreground">We'll get back to you within a few hours during business hours.</p>
            <button
              onClick={() => setDone(false)}
              className="text-xs text-primary underline mt-2"
            >
              Send another message
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <FormField label="Name" icon={User} error={errors.name} required>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={cn("h-11", errors.name && "border-destructive")}
                required
              />
            </FormField>
            <FormField label="Email" icon={Mail} error={errors.email} required>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={cn("h-11", errors.email && "border-destructive")}
                required
              />
            </FormField>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <FormField label="Phone" icon={Phone}>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="h-11"
                placeholder="Optional"
              />
            </FormField>
            <FormField label="Service Interested In" icon={MessageSquare}>
              <select
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                className="h-11 w-full px-3 rounded-md bg-background border border-border text-sm"
              >
                <option value="">Select a service (optional)</option>
                {services.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </FormField>
          </div>
          <FormField label="Message" error={errors.message} required>
            <Textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              className={cn(errors.message && "border-destructive")}
              placeholder="How can we help?"
              required
            />
          </FormField>
          <Button type="submit" className="w-full" disabled={submitting}>
            <Send className="h-4 w-4 mr-2" />
            {submitting ? "Sending..." : "Send Inquiry"}
          </Button>
        </form>
      )}
    </div>
  );
}

function FormField({
  label, icon: Icon, error, required, children,
}: {
  label: string;
  icon?: any;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        {Icon && <Icon className="h-3.5 w-3.5 text-accent" />}
        {label}
        {required && <span className="text-primary">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
