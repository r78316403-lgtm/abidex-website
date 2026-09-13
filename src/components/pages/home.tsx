"use client";

// =====================================================================
// HOME PAGE
// Hero, featured products, bestsellers, new arrivals, categories,
// promo banner, benefits, testimonials, trust, newsletter, FAQ
// preview, final CTA.
// =====================================================================

import { useQuery } from "@tanstack/react-query";
import { useRouter, Link } from "@/lib/router";
import { ProductCard } from "@/components/ecommerce/product-card";
import { SectionHeading, TrustBadge } from "@/components/ecommerce/ui-blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import {
  Truck, ShieldCheck, RotateCcw, HeadphonesIcon, Star, ArrowRight, ShoppingBag,
} from "lucide-react";
import type { Product, Category } from "@/lib/types";

export function HomePage() {
  const navigate = useRouter().navigate;
  const { data: featured } = useQuery<Product[]>({
    queryKey: ["products", "featured"],
    queryFn: async () => (await (await fetch("/api/products?featured=1")).json()).products,
  });
  const { data: bestSellers } = useQuery<Product[]>({
    queryKey: ["products", "bestsellers"],
    queryFn: async () => (await (await fetch("/api/products?bestseller=1")).json()).products,
  });
  const { data: newArrivals } = useQuery<Product[]>({
    queryKey: ["products", "new"],
    queryFn: async () => (await (await fetch("/api/products?new=1")).json()).products,
  });
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => (await fetch("/api/categories")).json(),
    staleTime: 5 * 60_000,
  });
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newsletterEmail }),
    });
    if (r.ok) {
      toast.success("You're on the list! Check your inbox for a confirmation.");
      setNewsletterEmail("");
    } else {
      toast.error("Couldn't subscribe — please try again.");
    }
  };

  return (
    <div className="animate-fade-up">
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 py-10 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-5 md:space-y-6 max-w-xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                New season • Free shipping over $50
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
                Considered goods for the people who care.
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                A modern general store for electronics, fashion, home goods, and
                accessories — chosen by people who use them, every day.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button size="lg" onClick={() => navigate("/shop")} className="group">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Shop Now
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/shop?sort=newest")}>
                  Explore Collection
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    <strong className="text-foreground">4.8/5</strong> from 2,400+ reviews
                  </span>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden bg-secondary">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80"
                alt="Curated lifestyle products"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Free shipping on orders over $50</p>
                    <p className="text-xs text-muted-foreground">Ships in 1–2 business days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ TRUST BAR ============================ */}
      <section className="border-y border-border bg-secondary/30">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TrustBadge icon={Truck} label="Free shipping over $50" />
            <TrustBadge icon={RotateCcw} label="30-day easy returns" />
            <TrustBadge icon={ShieldCheck} label="Secure checkout" />
            <TrustBadge icon={HeadphonesIcon} label="Real humans, real help" />
          </div>
        </div>
      </section>

      {/* ============================ CATEGORIES ============================ */}
      <section className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
        <SectionHeading
          eyebrow="Browse"
          title="Shop by category"
          description="Find what you're looking for across our most-loved collections."
          actionLabel="View all"
          actionTo="/shop"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {categories?.slice(0, 6).map((c) => (
            <Link
              key={c.id}
              to={`/category/${c.slug}`}
              className="group relative aspect-square rounded-xl overflow-hidden bg-secondary"
            >
              <img
                src={c.image ?? ""}
                alt={c.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                <h3 className="text-white text-sm md:text-base font-semibold">{c.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================ FEATURED ============================ */}
      {featured && featured.length > 0 && (
        <section className="container mx-auto max-w-7xl px-4 py-6 md:py-10">
          <SectionHeading
            eyebrow="Editor's picks"
            title="Featured products"
            description="Hand-picked favourites our team uses and loves."
            actionLabel="Shop all"
            actionTo="/shop"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {featured.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ============================ PROMO BANNER ============================ */}
      <section className="bg-foreground text-background">
        <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-2">
                Limited time
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
                Up to 30% off selected styles
              </h2>
              <p className="text-background/80 max-w-md mb-6">
                Refresh your setup, your wardrobe, or your home — for less. No code needed,
                discounts applied at checkout.
              </p>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate("/shop?sort=price-asc")}
                className="group"
              >
                Shop the Sale
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
            <div className="aspect-[5/3] rounded-xl overflow-hidden bg-background/10">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80"
                alt="Sale collection"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================ BESTSELLERS ============================ */}
      {bestSellers && bestSellers.length > 0 && (
        <section className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
          <SectionHeading
            eyebrow="Customer favourites"
            title="Best sellers"
            description="The pieces our customers keep coming back for."
            actionLabel="See more"
            actionTo="/shop?sort=bestselling"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {bestSellers.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ============================ NEW ARRIVALS ============================ */}
      {newArrivals && newArrivals.length > 0 && (
        <section className="container mx-auto max-w-7xl px-4 py-6 md:py-10">
          <SectionHeading
            eyebrow="Just landed"
            title="New arrivals"
            description="The latest additions to the Mercato catalog."
            actionLabel="Shop all"
            actionTo="/shop?sort=newest"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {newArrivals.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ============================ BENEFITS ============================ */}
      <section className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: ShieldCheck,
              title: "Quality you can trust",
              body: "Every product is hand-tested by our team before it earns a spot in the catalog. No filler, no fluff — just things that work.",
            },
            {
              icon: Truck,
              title: "Fast, fair shipping",
              body: "Free standard shipping on orders over $50. Express options at checkout. Tracking the moment it leaves the warehouse.",
            },
            {
              icon: RotateCcw,
              title: "30-day easy returns",
              body: "If something isn't right, send it back within 30 days for a full refund. No restocking fees, no questions.",
            },
          ].map((b) => (
            <div key={b.title} className="p-6 rounded-xl border border-border bg-card">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <b.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ TESTIMONIALS ============================ */}
      <section className="bg-secondary/30 border-y border-border">
        <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
          <SectionHeading
            eyebrow="What people say"
            title="Loved by 50,000+ customers"
            align="center"
          />
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {[
              {
                quote: "The headphones I bought from Mercato have outlasted three pairs from bigger brands. The selection is small but everything's good.",
                author: "Priya M.",
                location: "Austin, TX",
              },
              {
                quote: "Checkout was simple, shipping was fast, and the candle I ordered smells incredible. I'm a repeat customer for sure.",
                author: "Daniel R.",
                location: "Brooklyn, NY",
              },
              {
                quote: "I appreciate that they don't oversell. When they say 'free shipping over $50,' they mean it — no surprise fees at checkout.",
                author: "Sofia C.",
                location: "Los Angeles, CA",
              },
            ].map((t) => (
              <figure key={t.author} className="p-6 rounded-xl bg-card border border-border">
                <div className="flex gap-0.5 mb-3">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed mb-4">"{t.quote}"</blockquote>
                <figcaption className="text-xs text-muted-foreground">
                  <strong className="text-foreground">{t.author}</strong> · {t.location}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ NEWSLETTER ============================ */}
      <section className="container mx-auto max-w-3xl px-4 py-12 md:py-16 text-center">
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
          Get first dibs on new arrivals and sales.
        </h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
          One email a week. No spam, no nonsense. Unsubscribe anytime.
        </p>
        <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <Input
            type="email"
            required
            placeholder="you@email.com"
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            className="h-11"
          />
          <Button type="submit" size="lg">Subscribe</Button>
        </form>
      </section>

      {/* ============================ FAQ PREVIEW ============================ */}
      <section className="container mx-auto max-w-3xl px-4 py-6 md:py-10">
        <SectionHeading
          eyebrow="Good to know"
          title="Frequently asked"
          align="center"
          actionLabel="See all"
          actionTo="/faq"
        />
        <div className="space-y-2">
          {[
            {
              q: "How long does shipping take?",
              a: "Standard shipping is 3–7 business days within the country and 7–21 days internationally. Express options are available at checkout.",
            },
            {
              q: "What's your return policy?",
              a: "Items can be returned within 30 days of delivery for a full refund, as long as they're in original condition with tags.",
            },
            {
              q: "Do you ship internationally?",
              a: "Yes — we ship worldwide. International shipping costs are calculated at checkout based on destination and weight.",
            },
          ].map((f) => (
            <details key={f.q} className="group bg-card border border-border rounded-lg overflow-hidden">
              <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                <span className="text-sm font-medium">{f.q}</span>
                <span className="text-muted-foreground group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ============================ FINAL CTA ============================ */}
      <section className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="rounded-2xl bg-gradient-to-br from-foreground to-foreground/80 text-background p-8 md:p-12 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Ready to find your next favourite thing?
          </h2>
          <p className="text-background/80 mb-6 max-w-lg mx-auto">
            Join thousands of happy customers. Browse the full collection and check out in minutes.
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate("/shop")} className="group">
            Start Shopping
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </section>
    </div>
  );
}
