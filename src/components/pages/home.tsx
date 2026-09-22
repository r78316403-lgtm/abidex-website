"use client";

// =====================================================================
// KEDI HEALTHCARE — HOME PAGE
// =====================================================================

import { useQuery } from "@tanstack/react-query";
import { useRouter, Link } from "@/lib/router";
import { ProductCard } from "@/components/ecommerce/product-card";
import { SectionHeading, TrustBadge } from "@/components/ecommerce/ui-blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { siteConfig } from "@/lib/site-config";
import { useSeo } from "@/lib/use-seo";
import {
  Truck, ShieldCheck, RotateCcw, HeadphonesIcon, Star, ArrowRight, ShoppingBag,
  Sprout, Heart, Award, Users,
} from "lucide-react";
import type { Product, Category } from "@/lib/types";

export function HomePage() {
  // SEO: home page metadata
  useSeo({
    title: "KEDI Healthcare — Herbal Medicine, Vitamins & Wellness Equipment in Nigeria",
    description:
      "Shop NAFDAC-registered KEDI herbal medicines, vitamins & supplements, and wellness equipment in Nigeria. Free shipping over ₦50,000. Paystack payment. Open up to a new life with KEDI.",
    canonicalPath: "",
    type: "website",
  });

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
      toast.success("You're on the KEDI list! Watch your inbox for updates.");
      setNewsletterEmail("");
    } else {
      toast.error("Couldn't subscribe — please try again.");
    }
  };

  return (
    <div className="animate-fade-up">
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden bg-leaf-pattern">
        <div className="container mx-auto max-w-7xl px-4 py-10 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-5 md:space-y-6 max-w-xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs font-medium">
                <Sprout className="h-3.5 w-3.5 text-accent" />
                Premium Chinese herbal medicine since {siteConfig.legal.registrationYear}
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
                Open Up To A New Life With KEDI
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Quality herbal products, wellness solutions, and rewarding business
                opportunities that support healthier communities across Nigeria and beyond.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button size="lg" onClick={() => navigate("/shop")} className="group">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Shop Now
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/distributor")}>
                  Become a Distributor
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
                    <strong className="text-foreground">4.8/5</strong> from 12,000+ happy customers
                  </span>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden bg-secondary">
              <img
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80"
                alt="KEDI herbal wellness products"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Free shipping on orders above ₦50,000</p>
                    <p className="text-xs text-muted-foreground">Nationwide delivery in 1-5 business days</p>
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
            <TrustBadge icon={Truck} label="Nationwide shipping" />
            <TrustBadge icon={RotateCcw} label="7-day returns" />
            <TrustBadge icon={ShieldCheck} label="NAFDAC-registered products" />
            <TrustBadge icon={HeadphonesIcon} label="Real KEDI support, 9-5" />
          </div>
        </div>
      </section>

      {/* ============================ FOUNDER QUOTE ============================ */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16 text-center">
          <Sprout className="h-10 w-10 mx-auto mb-4 text-accent" />
          <blockquote className="font-display text-2xl md:text-3xl font-bold leading-tight mb-4">
            "KEDI Brings You Health, Wealth, and Happiness!"
          </blockquote>
          <p className="text-primary-foreground/80 text-sm">
            {siteConfig.founder} · <span className="text-accent">{siteConfig.founderTitle}</span>
          </p>
        </div>
      </section>

      {/* ============================ CATEGORIES ============================ */}
      <section className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
        <SectionHeading
          eyebrow="Browse"
          title="Shop by category"
          description="Three product lines, all crafted to support your wellbeing."
          actionLabel="View all"
          actionTo="/shop"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {categories?.map((c) => (
            <Link
              key={c.id}
              to={`/category/${c.slug}`}
              className="group relative aspect-[5/3] rounded-xl overflow-hidden bg-secondary"
            >
              <img
                src={c.image ?? ""}
                alt={c.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-display text-xl text-white font-bold mb-1">{c.name}</h3>
                <p className="text-xs text-white/80 line-clamp-2 mb-2">{c.description}</p>
                <span className="text-xs font-medium text-accent inline-flex items-center gap-1">
                  Shop now <ArrowRight className="h-3 w-3" />
                </span>
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
            description="Our most-loved formulas, picked by KEDI wellness experts."
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

      {/* ============================ PROMO: FIVE YEAR PLAN ============================ */}
      <section className="bg-accent/10 border-y border-accent/20">
        <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-2">
                Special Column
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
                KEDI Five Years Development Plan ({siteConfig.programs.fiveYearPlan})
              </h2>
              <p className="text-muted-foreground max-w-md mb-6">
                A corporate blueprint covering market penetration, distributor compensation,
                and corporate efforts for the next five business years.
              </p>
              <Button
                variant="default"
                size="lg"
                onClick={() => navigate("/five-year-plan")}
                className="group"
              >
                Read the Plan
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
            <div className="aspect-[5/3] rounded-xl overflow-hidden bg-secondary">
              <img
                src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1000&q=80"
                alt="KEDI Five Year Plan"
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
            description="The KEDI products our customers keep coming back for."
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

      {/* ============================ FOCUS AREAS ============================ */}
      <section className="container mx-auto max-w-7xl px-4 py-6 md:py-10">
        <SectionHeading
          eyebrow="Our focus"
          title="Wellness for every need"
          description="KEDI products are organized around seven core health focus areas."
        />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: "Man Power", icon: Users },
            { label: "Lady Care", icon: Heart },
            { label: "Immune Boosting", icon: ShieldCheck },
            { label: "Pain Relief", icon: RotateCcw },
            { label: "Body Nourishment", icon: Sprout },
            { label: "Disease Curative", icon: Star },
            { label: "Disease Preventive", icon: Award },
          ].map((f) => (
            <Link
              key={f.label}
              to={`/shop?q=${encodeURIComponent(f.label)}`}
              className="group p-4 rounded-xl border border-border bg-card hover:border-accent hover:shadow-md transition-all flex flex-col items-center text-center"
            >
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-2 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <f.icon className="h-5 w-5 text-accent group-hover:text-accent-foreground" />
              </div>
              <p className="text-xs font-medium">{f.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================ NEW ARRIVALS ============================ */}
      {newArrivals && newArrivals.length > 0 && (
        <section className="container mx-auto max-w-7xl px-4 py-6 md:py-10">
          <SectionHeading
            eyebrow="Just landed"
            title="New arrivals"
            description="The latest additions to the KEDI catalog."
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

      {/* ============================ DISTRIBUTOR OPPORTUNITY ============================ */}
      <section className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="rounded-2xl bg-primary text-primary-foreground p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-2">
              Business Opportunity
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
              Build a sustainable income with KEDI
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-md">
              Join thousands of distributors transforming their lives by sharing quality
              healthcare products. Weekly training, mentorship, and incentive programs
              including the {siteConfig.programs.carAwardYear} Car Award.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/distributor")}
              className="group"
            >
              Become a Distributor
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-lg bg-primary-foreground/10">
              <Users className="h-6 w-6 text-accent mb-2" />
              <p className="font-semibold text-sm">Weekly Seminars</p>
              <p className="text-xs text-primary-foreground/70">Training across the country</p>
            </div>
            <div className="p-4 rounded-lg bg-primary-foreground/10">
              <Award className="h-6 w-6 text-accent mb-2" />
              <p className="font-semibold text-sm">{siteConfig.programs.carAwardYear} Car Award</p>
              <p className="text-xs text-primary-foreground/70">Top performer incentives</p>
            </div>
            <div className="p-4 rounded-lg bg-primary-foreground/10">
              <Heart className="h-6 w-6 text-accent mb-2" />
              <p className="font-semibold text-sm">KEDI Impact Fund</p>
              <p className="text-xs text-primary-foreground/70">Community support</p>
            </div>
            <div className="p-4 rounded-lg bg-primary-foreground/10">
              <Sprout className="h-6 w-6 text-accent mb-2" />
              <p className="font-semibold text-sm">Aloe House</p>
              <p className="text-xs text-primary-foreground/70">Wellness centres nationwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ BENEFITS ============================ */}
      <section className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: ShieldCheck,
              title: "Quality you can trust",
              body: "Every KEDI product is NAFDAC-registered and produced under strict quality standards — combining traditional Chinese herbs with modern science.",
            },
            {
              icon: Truck,
              title: "Fast, fair shipping",
              body: "Free shipping on orders above ₦50,000. Express options at checkout. Tracking the moment it leaves our Lagos warehouse.",
            },
            {
              icon: RotateCcw,
              title: "7-day easy returns",
              body: "If something isn't right, send it back within 7 days for a full refund. No restocking fees, no questions.",
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
            title="Loved by 12,000+ Nigerians"
            align="center"
          />
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {[
              {
                quote: "KEDI Reishi has been a game-changer for my immune system. I haven't had a serious cold in over a year. The distributor I bought from was so knowledgeable.",
                author: "Chioma A.",
                location: "Lagos",
              },
              {
                quote: "I started as a KEDI distributor two years ago to supplement my salary. Today it's my full-time income. The training and community support made all the difference.",
                author: "Emeka O.",
                location: "Abuja",
              },
              {
                quote: "The Golden Six capsules have been wonderful for managing my cycle. I appreciate that KEDI products are affordable and genuinely effective. Highly recommended.",
                author: "Fatima M.",
                location: "Kano",
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
          Stay Updated with the Latest KEDI News & Offers
        </h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
          One email a week. Health tips, new products, distributor news. Unsubscribe anytime.
        </p>
        <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <Input
            type="email"
            required
            placeholder="Your email address"
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            className="h-11"
          />
          <Button type="submit" size="lg">Subscribe</Button>
        </form>
        <p className="text-xs text-muted-foreground mt-3">
          You can unsubscribe at any time by clicking the unsubscribe link in our newsletter.
        </p>
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
              q: "Are KEDI products safe?",
              a: "Yes. All KEDI products are NAFDAC-registered and manufactured under strict quality standards. As with any supplement, consult your healthcare provider if you have a medical condition.",
            },
            {
              q: "How long does delivery take?",
              a: "Lagos: 1-2 business days. Major cities: 2-3 days. Other locations: 3-5 days. Express shipping is available at checkout.",
            },
            {
              q: "How do I become a KEDI distributor?",
              a: "Visit our Distributor page to learn more, or attend one of our weekly training seminars held across the country.",
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
        <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 md:p-12 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Open up to a new life with KEDI
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-lg mx-auto">
            Join thousands of Nigerians enjoying better health and financial growth with KEDI.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate("/shop")} className="group">
              Start Shopping
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/distributor")}
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              Become a Distributor
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
