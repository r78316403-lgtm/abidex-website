"use client";

import { siteConfig, whatsappLink, telegramLink, emailLink } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "@/components/ecommerce/ui-blocks";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock, MessageSquare, MessageCircle, Send, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useSeo } from "@/lib/use-seo";
import { breadcrumbSchema } from "@/lib/structured-data";

export function ContactPage() {
  useSeo({
    title: "Contact KEDI Healthcare — WhatsApp, Telegram, Email & Phone",
    description:
      "Get in touch with KEDI Healthcare Nigeria. WhatsApp: +234 916 208 0741, Telegram: @ahmedabiola, Email: isiaqmusa123456abc@gmail.com. We reply within 30 minutes during business hours.",
    canonicalPath: "#/contact",
    jsonLd: breadcrumbSchema([
      { name: "Home", url: "" },
      { name: "Contact", url: "#/contact" },
    ]),
  });
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
        toast.error("Couldn't send — please try again or message us on WhatsApp.");
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
        description="Questions about a product, an order, or becoming a distributor? We're here to help — pick whichever channel works best for you."
      />

      {/* Quick contact channels — most prominent */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        <a
          href={whatsappLink("Hello KEDI Healthcare, I'd like to know more about your products.")}
          target="_blank"
          rel="noopener noreferrer"
          className="group p-5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366] hover:text-white transition-all flex flex-col"
        >
          <MessageCircle className="h-8 w-8 text-[#25D366] group-hover:text-white mb-2" />
          <p className="font-semibold text-sm mb-1">WhatsApp</p>
          <p className="text-xs text-muted-foreground group-hover:text-white/90">{siteConfig.contact.whatsappDisplay}</p>
          <p className="text-xs mt-2 inline-flex items-center gap-1 text-[#25D366] group-hover:text-white font-medium">
            Chat now <ArrowRight className="h-3 w-3" />
          </p>
        </a>

        <a
          href={telegramLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="group p-5 rounded-xl bg-[#0088cc]/10 border border-[#0088cc]/30 hover:bg-[#0088cc] hover:text-white transition-all flex flex-col"
        >
          <Send className="h-8 w-8 text-[#0088cc] group-hover:text-white mb-2" />
          <p className="font-semibold text-sm mb-1">Telegram</p>
          <p className="text-xs text-muted-foreground group-hover:text-white/90">{siteConfig.contact.telegramDisplay}</p>
          <p className="text-xs mt-2 inline-flex items-center gap-1 text-[#0088cc] group-hover:text-white font-medium">
            Message us <ArrowRight className="h-3 w-3" />
          </p>
        </a>

        <a
          href={emailLink("KEDI Healthcare enquiry")}
          className="group p-5 rounded-xl bg-accent/10 border border-accent/30 hover:bg-accent hover:text-accent-foreground transition-all flex flex-col"
        >
          <Mail className="h-8 w-8 text-accent group-hover:text-accent-foreground mb-2" />
          <p className="font-semibold text-sm mb-1">Email</p>
          <p className="text-xs text-muted-foreground group-hover:text-accent-foreground/90 break-all">{siteConfig.contact.email}</p>
          <p className="text-xs mt-2 inline-flex items-center gap-1 text-accent group-hover:text-accent-foreground font-medium">
            Send email <ArrowRight className="h-3 w-3" />
          </p>
        </a>

        <a
          href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
          className="group p-5 rounded-xl bg-secondary border border-border hover:bg-foreground hover:text-background transition-all flex flex-col"
        >
          <Phone className="h-8 w-8 text-foreground group-hover:text-background mb-2" />
          <p className="font-semibold text-sm mb-1">Phone</p>
          <p className="text-xs text-muted-foreground group-hover:text-background/80">{siteConfig.contact.phone}</p>
          <p className="text-xs mt-2 inline-flex items-center gap-1 text-foreground group-hover:text-background font-medium">
            Call us <ArrowRight className="h-3 w-3" />
          </p>
        </a>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
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
            <p className="text-xs text-muted-foreground">
              Prefer chat? Use WhatsApp or Telegram above — we usually reply within minutes during business hours.
            </p>
          </form>
        </div>

        {/* Contact info */}
        <div>
          <h2 className="font-display text-xl font-semibold mb-4">Other details</h2>
          <ul className="space-y-4 mb-6">
            <ContactRow icon={MessageCircle} label="WhatsApp" value={siteConfig.contact.whatsappDisplay} href={whatsappLink("Hello KEDI!")} accent="#25D366" />
            <ContactRow icon={Send} label="Telegram" value={siteConfig.contact.telegramDisplay} href={telegramLink()} accent="#0088cc" />
            <ContactRow icon={Mail} label="Email" value={siteConfig.contact.email} href={emailLink("KEDI enquiry")} />
            <ContactRow icon={Phone} label="Phone" value={siteConfig.contact.phone} href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`} />
            <ContactRow icon={MapPin} label="Address" value={siteConfig.contact.address} />
            <ContactRow icon={Clock} label="Hours" value={siteConfig.contact.hours} />
          </ul>

          <div className="p-5 bg-secondary/50 rounded-lg border border-border">
            <h3 className="font-semibold text-sm mb-2">Response times</h3>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li><strong className="text-foreground">WhatsApp / Telegram:</strong> Usually within 30 minutes (9am–5pm)</li>
              <li><strong className="text-foreground">Email:</strong> Within 24 hours</li>
              <li><strong className="text-foreground">Phone:</strong> Live during business hours</li>
              <li><strong className="text-foreground">Order issues:</strong> Always priority — message us anytime</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactRow({
  icon: Icon, label, value, href, accent,
}: {
  icon: any; label: string; value: string; href?: string; accent?: string;
}) {
  const content = (
    <>
      <div
        className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
        style={accent ? { backgroundColor: `${accent}1a` } : { backgroundColor: "var(--accent)" }}
      >
        <Icon className="h-5 w-5" style={accent ? { color: accent } : { color: "var(--accent-foreground)" }} />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="text-sm break-all">{value}</p>
      </div>
    </>
  );
  return href ? (
    <li>
      <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:opacity-80 transition-opacity">
        {content}
      </a>
    </li>
  ) : (
    <li className="flex items-start gap-3">{content}</li>
  );
}
