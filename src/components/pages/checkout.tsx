"use client";

import { useState } from "react";
import { useCartStore, selectCartSubtotal } from "@/lib/cart-store";
import { useRouter, Link } from "@/lib/router";
import { formatPrice, siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ArrowRight, ShieldCheck, Truck, CreditCard, Loader2, Lock } from "lucide-react";
import { useCustomerStore } from "@/lib/wishlist-store";
import { useSeo } from "@/lib/use-seo";
import type { ApiResponse } from "@/lib/types";

const COUNTRIES = ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "Nigeria", "South Africa", "Kenya", "Ghana"];

type CreateOrderResponse = {
  orderNumber: string;
  payment: {
    provider: string;
    authorizationUrl?: string;
    clientSecret?: string;
    paymentIntentId?: string;
    reference: string;
  };
};

export function CheckoutPage() {
  useSeo({
    title: "Secure Checkout — KEDI Healthcare",
    description: "Complete your KEDI Healthcare order securely with Paystack, Flutterwave, or cash on delivery.",
    canonicalPath: "#/checkout",
    noIndex: true,
  });
  const navigate = useRouter().navigate;
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectCartSubtotal);
  const clear = useCartStore((s) => s.clear);
  const customer = useCustomerStore();

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: customer.firstName ?? "",
    lastName: customer.lastName ?? "",
    email: customer.email ?? "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "United States",
    postalCode: "",
    deliveryInstructions: "",
    paymentMethod: siteConfig.payment.provider,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shipping = subtotal >= siteConfig.shipping.freeThreshold ? 0 : siteConfig.shipping.standardRate;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-10 text-center">
        <h1 className="font-display text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Add a product to your cart before checking out.</p>
        <Link to="/shop"><Button>Browse Products</Button></Link>
      </div>
    );
  }

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!/^[0-9+\-\s()]{7,}$/.test(form.phone)) e.phone = "Valid phone required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state.trim()) e.state = "State/Region is required";
    if (!form.country.trim()) e.country = "Country is required";
    if (!form.postalCode.trim()) e.postalCode = "Postal code is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors below.");
      return;
    }
    setSubmitting(true);
    try {
      const r = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
          },
          shipping: {
            address: form.address,
            city: form.city,
            state: form.state,
            country: form.country,
            postalCode: form.postalCode,
            deliveryInstructions: form.deliveryInstructions,
          },
          items,
          paymentMethod: form.paymentMethod,
        }),
      });
      const result = (await r.json()) as CreateOrderResponse | ApiResponse<never>;
      if (!r.ok || "error" in result) {
        const msg = "error" in result ? result.error : "Order creation failed";
        toast.error(msg);
        setSubmitting(false);
        return;
      }
      // Persist customer for repeat-checkout convenience (no password).
      customer.signIn({
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
      });
      // If provider returned an external authorization URL, redirect there.
      if (result.payment.authorizationUrl && !result.payment.authorizationUrl.includes(`#/order/${result.orderNumber}`)) {
        window.location.href = result.payment.authorizationUrl;
        return;
      }
      // COD or provider returned placeholder → go straight to confirmation
      clear();
      navigate(`/order/${result.orderNumber}`);
    } catch (err) {
      console.error(err);
      toast.error("Network error — please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 md:py-10 animate-fade-up">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Checkout</h1>
        <Link to="/cart" className="text-sm text-muted-foreground hover:text-accent">
          ← Back to cart
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        {/* Left: forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer info */}
          <section className="border border-border rounded-lg p-5 bg-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center">1</span>
                Contact Information
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="First name" required error={errors.firstName}>
                <Input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} autoComplete="given-name" />
              </Field>
              <Field label="Last name" required error={errors.lastName}>
                <Input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} autoComplete="family-name" />
              </Field>
              <Field label="Email" required error={errors.email}>
                <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
              </Field>
              <Field label="Phone" required error={errors.phone}>
                <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" placeholder="+1 555 123 4567" />
              </Field>
            </div>
          </section>

          {/* Shipping info */}
          <section className="border border-border rounded-lg p-5 bg-card">
            <h2 className="font-semibold flex items-center gap-2 mb-4">
              <span className="h-6 w-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center">2</span>
              Delivery Address
            </h2>
            <div className="space-y-4">
              <Field label="Street address" required error={errors.address}>
                <Input value={form.address} onChange={(e) => set("address", e.target.value)} autoComplete="street-address" />
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="City" required error={errors.city}>
                  <Input value={form.city} onChange={(e) => set("city", e.target.value)} autoComplete="address-level2" />
                </Field>
                <Field label="State / Region" required error={errors.state}>
                  <Input value={form.state} onChange={(e) => set("state", e.target.value)} autoComplete="address-level1" />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Country" required error={errors.country}>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={form.country}
                    onChange={(e) => set("country", e.target.value)}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Postal / ZIP code" required error={errors.postalCode}>
                  <Input value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} autoComplete="postal-code" />
                </Field>
              </div>
              <Field label="Delivery instructions (optional)">
                <Textarea
                  value={form.deliveryInstructions}
                  onChange={(e) => set("deliveryInstructions", e.target.value)}
                  rows={2}
                  placeholder="Apartment number, gate code, leave at door, etc."
                />
              </Field>
            </div>
          </section>

          {/* Payment */}
          <section className="border border-border rounded-lg p-5 bg-card">
            <h2 className="font-semibold flex items-center gap-2 mb-4">
              <span className="h-6 w-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center">3</span>
              Payment Method
            </h2>
            <RadioGroup
              value={form.paymentMethod}
              onValueChange={(v) => set("paymentMethod", v)}
              className="space-y-2"
            >
              <PaymentOption
                value="stripe"
                label="Credit / Debit Card"
                description="Pay securely with Visa, Mastercard, or Amex via Stripe."
              />
              <PaymentOption
                value="paystack"
                label="Paystack"
                description="For customers in Nigeria and supported African countries."
              />
              <PaymentOption
                value="flutterwave"
                label="Flutterwave"
                description="Alternative African payment provider with mobile money support."
              />
              <PaymentOption
                value="cod"
                label="Cash on Delivery"
                description="Pay in cash when your order arrives. Available in select areas."
              />
            </RadioGroup>
            <div className="mt-4 p-3 bg-secondary/50 rounded-md text-xs text-muted-foreground flex items-start gap-2">
              <Lock className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <p>
                Your payment is processed securely by the payment provider. We never store your card details on our servers. All payment confirmations are verified server-side.
              </p>
            </div>
          </section>
        </div>

        {/* Right: order summary */}
        <div className="lg:col-span-1">
          <div className="border border-border rounded-lg p-5 bg-card sticky top-24">
            <h2 className="font-display text-lg font-semibold mb-4">Order Summary</h2>
            <ul className="space-y-3 mb-4">
              {items.map((item) => (
                <li key={`${item.productId}-${item.size ?? ""}-${item.color ?? ""}`} className="flex gap-3">
                  <div className="relative shrink-0">
                    <img src={item.image} alt={item.name} className="h-14 w-14 rounded-md object-cover" />
                    <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                    {(item.size || item.color) && (
                      <p className="text-xs text-muted-foreground">
                        {item.size} {item.color && `· ${item.color}`}
                      </p>
                    )}
                  </div>
                  <p className="text-sm font-medium whitespace-nowrap">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            <Separator className="my-3" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                {shipping === 0 ? (
                  <span className="text-accent font-medium">Free</span>
                ) : (
                  <span className="font-medium">{formatPrice(shipping)}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-muted-foreground">Calculated next</span>
              </div>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <Button type="submit" size="lg" className="w-full mt-5" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing…
                </>
              ) : (
                <>
                  Place Order <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>

            <div className="flex flex-col gap-2 mt-4 text-xs text-muted-foreground">
              <p className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-accent" /> Secure SSL checkout</p>
              <p className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-accent" /> 30-day easy returns</p>
              <p className="flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5 text-accent" /> Multiple payment options</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  label, required, error, children,
}: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="text-xs font-medium mb-1.5 block">
        {label} {required && <span className="text-accent">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

function PaymentOption({
  value, label, description,
}: {
  value: string; label: string; description: string;
}) {
  return (
    <label htmlFor={`po-${value}`} className="flex items-start gap-3 p-3 border border-border rounded-md cursor-pointer hover:bg-secondary/50 transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent/5">
      <RadioGroupItem value={value} id={`po-${value}`} className="mt-1" />
      <div className="flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </label>
  );
}
