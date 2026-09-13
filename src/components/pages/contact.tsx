"use client";

import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "@/components/ecommerce/ui-blocks";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react";
import { useState } from "react";

export function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (r.ok) {
        toast.success("Message sent! We'll reply within 24 hours.");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("Couldn't send — please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 md:py-10 animate-fade-up">
      <SectionHeading
        eyebrow="Contact"
        title="Get in touch"
        description="Questions about a product, an order, or anything else? We're here to help."
      />
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-display text-xl font-semibold mb-4">Send a message</h2>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label className="text-xs mb-1.5 block">Your name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                autoComplete="name"
              />
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Subject</Label>
              <Input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              />
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Message</Label>
              <Textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={5}
                required
                placeholder="How can we help?"
              />
            </div>
            <Button type="submit" disabled={submitting}>
              <MessageSquare className="h-4 w-4 mr-2" />
              {submitting ? "Sending…" : "Send Message"}
            </Button>
          </form>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold mb-4">Other ways to reach us</h2>
          <ul className="space-y-4">
            <ContactRow icon={Mail} label="Email" value={siteConfig.contact.email} href={`mailto:${siteConfig.contact.email}`} />
            <ContactRow icon={Phone} label="Phone" value={siteConfig.contact.phone} />
            <ContactRow icon={MessageSquare} label="WhatsApp" value={siteConfig.contact.whatsapp} href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, "")}`} />
            <ContactRow icon={MapPin} label="Address" value={siteConfig.contact.address} />
            <ContactRow icon={Clock} label="Hours" value={siteConfig.contact.hours} />
          </ul>

          <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Most questions are answered in our FAQ — including shipping times, returns, and order tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactRow({
  icon: Icon, label, value, href,
}: {
  icon: any; label: string; value: string; href?: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-accent" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</p>
        {href ? (
          <a href={href} className="text-sm hover:text-accent">{value}</a>
        ) : (
          <p className="text-sm">{value}</p>
        )}
      </div>
    </li>
  );
}
