"use client";

import { useQuery } from "@tanstack/react-query";
import { SectionHeading } from "@/components/ecommerce/ui-blocks";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, Link } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileQuestion } from "lucide-react";
import { useSeo } from "@/lib/use-seo";
import { faqSchema, breadcrumbSchema } from "@/lib/structured-data";

const SEO_META: Record<string, { title: string; description: string }> = {
  about: {
    title: "About KEDI Healthcare — Our Story, Founder & Mission",
    description:
      "KEDI Healthcare Ind. Nig. Ltd. is a leading Nigerian health and wellness company offering quality herbal products since 2005. Founded by Mr. William Zhao. Discover our story and mission.",
  },
  faq: {
    title: "Frequently Asked Questions — KEDI Healthcare Nigeria",
    description:
      "Answers to common questions about KEDI herbal products, ordering, shipping, returns, NAFDAC registration, and becoming a distributor. Get the info you need fast.",
  },
  distributor: {
    title: "Become a KEDI Distributor — Build a Sustainable Income",
    description:
      "Join the KEDI distributor network and build a sustainable income sharing quality healthcare products. Weekly training, mentorship, 2026 Car Award, Impact Fund, Aloe House.",
  },
  "five-year-plan": {
    title: "KEDI Five Years Development Plan (2024-2028)",
    description:
      "KEDI Healthcare's 2024-2028 corporate blueprint: product innovation, distributor empowerment (2026 Car Award, Impact Fund), and community impact across Nigeria.",
  },
  shipping: {
    title: "Shipping & Delivery — KEDI Healthcare Nigeria",
    description:
      "Free shipping on orders above ₦50,000. Lagos: 1-2 business days. Nationwide: 3-5 days. Express shipping available. Track your order from our Lagos warehouse.",
  },
  returns: {
    title: "Returns & Refund Policy — KEDI Healthcare",
    description:
      "7-day return policy on unopened items in original packaging. Refunds processed within 5 business days. Damaged or incorrect items replaced at no cost.",
  },
  privacy: {
    title: "Privacy Policy — KEDI Healthcare",
    description:
      "KEDI Healthcare collects only what's needed to fulfill orders and improve services. We never sell your information. Read our full privacy policy.",
  },
  terms: {
    title: "Terms & Conditions — KEDI Healthcare",
    description:
      "Terms governing the use of the KEDI Healthcare website, ordering, payment, and delivery. Products sold for personal use only.",
  },
};

export function StaticPage({ slug }: { slug: string }) {
  const navigate = useRouter().navigate;
  const { data, isLoading } = useQuery({
    queryKey: ["content", slug],
    queryFn: async () => {
      const r = await fetch(`/api/content/${slug}`);
      if (!r.ok) return null;
      return (await r.json()) as { title: string; body: string };
    },
  });

  const meta = SEO_META[slug];
  useSeo({
    title: meta?.title ?? data?.title ?? "KEDI Healthcare",
    description: meta?.description ?? data?.title,
    canonicalPath: `#/${slug}`,
    noIndex: false,
    jsonLd: slug === "faq"
      ? [faqSchema(extractFaqs(data?.body ?? ""))]
      : breadcrumbSchema([
          { name: "Home", url: "" },
          { name: data?.title ?? slug, url: `#/${slug}` },
        ]),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <SectionHeading eyebrow="404" title="Page not found" description="This page may have moved or doesn't exist." />
        <Button onClick={() => navigate("/")}><ArrowRight className="h-4 w-4 mr-2" /> Back to home</Button>
      </div>
    );
  }

  // FAQ is rendered with collapsible Q&A.
  if (slug === "faq") {
    return <FaqPage body={data.body} />;
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6 md:py-10 animate-fade-up">
      <SectionHeading eyebrow={slug} title={data.title} />
      <article className="prose prose-sm max-w-none">
        {data.body.split(/\n\n+/).map((p, i) => (
          <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-4 whitespace-pre-line">
            {p}
          </p>
        ))}
      </article>
      <div className="mt-8 p-5 border border-border rounded-lg bg-card">
        <p className="text-sm text-muted-foreground mb-3">
          Still have questions? We're happy to help.
        </p>
        <Link to="/contact">
          <Button variant="outline" size="sm">Contact Us</Button>
        </Link>
      </div>
    </div>
  );
}

function FaqPage({ body }: { body: string }) {
  // Split the FAQ body into Q/A pairs separated by double newlines.
  // First paragraph is the intro; rest are Q/A pairs.
  const paragraphs = body.split(/\n\n+/);
  const intro = paragraphs[0] ?? "";
  const pairs = paragraphs.slice(1).map((p) => {
    const [q, ...rest] = p.split(/\n/);
    return { q: q.replace(/^Q:?\s*/i, ""), a: rest.join("\n").replace(/^A:?\s*/i, "") };
  });

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6 md:py-10 animate-fade-up">
      <SectionHeading eyebrow="Help" title="Frequently Asked Questions" description={intro} />
      {pairs.length === 0 ? (
        <div className="space-y-2">
          {[
            { q: "How long does shipping take?", a: "Standard shipping is 3–7 business days within the country and 7–21 days internationally. Express options are available at checkout." },
            { q: "What's your return policy?", a: "Items can be returned within 30 days of delivery for a full refund, as long as they're in original condition with tags." },
            { q: "Do you ship internationally?", a: "Yes — we ship worldwide. International shipping costs are calculated at checkout based on destination and weight." },
            { q: "How do I track my order?", a: "Once your order ships, you'll receive a tracking number by email. You can also check order status in the Order History page." },
            { q: "Can I change or cancel my order?", a: "If your order hasn't shipped yet, contact us right away and we'll do our best to help. Once an order is shipped, it can't be changed." },
            { q: "What payment methods do you accept?", a: "We accept major credit/debit cards via Stripe, Paystack, Flutterwave, and cash on delivery in select areas." },
          ].map((pair) => (
            <details key={pair.q} className="group bg-card border border-border rounded-lg overflow-hidden">
              <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                <span className="text-sm font-medium">{pair.q}</span>
                <span className="text-muted-foreground group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{pair.a}</p>
            </details>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {pairs.map((pair, i) => (
            <details key={i} className="group bg-card border border-border rounded-lg overflow-hidden">
              <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                <span className="text-sm font-medium">{pair.q}</span>
                <span className="text-muted-foreground group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{pair.a}</p>
            </details>
          ))}
        </div>
      )}
      <div className="mt-8 p-5 border border-border rounded-lg bg-card flex items-center gap-3">
        <FileQuestion className="h-5 w-5 text-accent" />
        <p className="text-sm text-muted-foreground flex-1">Didn't find your answer?</p>
        <Link to="/contact"><Button size="sm" variant="outline">Contact us</Button></Link>
      </div>
    </div>
  );
}

// Extract Q&A pairs from the FAQ body for FAQ schema
function extractFaqs(body: string): { question: string; answer: string }[] {
  const paragraphs = body.split(/\n\n+/);
  // First paragraph is intro; rest are Q/A pairs
  return paragraphs.slice(1).map((p) => {
    const [q, ...rest] = p.split(/\n/);
    return {
      question: q.replace(/^Q:?\s*/i, "").trim(),
      answer: rest.join("\n").replace(/^A:?\s*/i, "").trim(),
    };
  }).filter((p) => p.question && p.answer);
}
