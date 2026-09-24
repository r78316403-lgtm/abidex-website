"use client";

// =====================================================================
// COMMITTEE FORM — Selection Committee contact form
// =====================================================================

import { useState } from "react";
import { Section, HeadingBlock } from "@/components/literary/ui-helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  siteConfig, emailLink, DEFAULT_EMAIL_SUBJECT,
} from "@/lib/site-config";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export function CommitteeForm() {
  const [form, setForm] = useState({
    name: "", email: "", book: "", message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Valid email required";
    if (!form.book.trim()) errs.book = "Book / Publication details required";
    if (!form.message.trim() || form.message.trim().length < 10) errs.message = "Please tell us a bit more (10+ characters)";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const r = await fetch("/api/committee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (r.ok) {
        setDone(true);
        toast.success("Submission received. We respond to qualified submissions only.");
        setForm({ name: "", email: "", book: "", message: "" });
      } else {
        toast.error("Couldn't submit — please try again or contact us directly.");
      }
    } catch {
      toast.error("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section id="contact" alt>
      <HeadingBlock
        number="07"
        eyebrow="Selection Committee"
        title={<>Connect with the <span className="italic text-primary">Selection Committee</span></>}
        lead={
          <>
            To maintain the exceptional quality of our high-signal social salons, our infrastructure only accommodates 18 standout authors per annual cycle. If you are an independent author whose work aligns with our mission of uncovering meaningful ingredients in overlooked places, please submit your contact and publication details below for committee consideration.
            <span className="block mt-3 font-semibold text-foreground">18 standout authors per annual cycle.</span>
          </>
        }
      />

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 md:gap-12 max-w-5xl mx-auto">
        {/* Form */}
        <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card">
          {done ? (
            <div className="text-center py-8">
              <div className="inline-flex h-16 w-16 rounded-full bg-sage-green/15 items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8" style={{ color: "var(--sage-green)" }} />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-2">Submission Received</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                Thank you for your interest in Abidex. Our Selection Committee reviews every submission carefully. We respond to qualified submissions only — typically within 2–3 weeks.
              </p>
              <Button variant="outline" onClick={() => setDone(false)}>
                Submit Another
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Name <span className="text-primary">*</span>
                </Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={cn("h-11", errors.name && "border-destructive")}
                  required
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Email <span className="text-primary">*</span>
                </Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={cn("h-11", errors.email && "border-destructive")}
                  required
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Book / Publication Details <span className="text-primary">*</span>
                </Label>
                <Input
                  value={form.book}
                  onChange={(e) => setForm({ ...form, book: e.target.value })}
                  placeholder="Title, genre, publication date, ISBN (if available)"
                  className={cn("h-11", errors.book && "border-destructive")}
                  required
                />
                {errors.book && <p className="text-xs text-destructive mt-1">{errors.book}</p>}
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Message <span className="text-primary">*</span>
                </Label>
                <Textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={4}
                  placeholder="Tell us about your work and why it aligns with our mission."
                  className={cn(errors.message && "border-destructive")}
                  required
                />
                {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
              </div>
              <Button type="submit" size="lg" className="w-full group" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit for Committee Consideration"}
                {!submitting && <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                We respond to qualified submissions only.
              </p>
            </form>
          )}
        </div>

        {/* Contact options */}
        <div className="space-y-3">
          <h3 className="font-serif text-xl font-semibold mb-4">Prefer to reach us directly?</h3>

          <a
            href={emailLink(DEFAULT_EMAIL_SUBJECT)}
            className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card warm-card group"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 shrink-0">
              <Mail className="h-5 w-5 text-primary" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Email</p>
              <p className="text-sm font-semibold truncate">{siteConfig.contact.email}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </a>
        </div>
      </div>
    </Section>
  );
}
