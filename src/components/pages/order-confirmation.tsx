"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, Link } from "@/lib/router";
import { formatPrice, siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  CheckCircle2, Package, Truck, Mail, ArrowRight, Loader2, AlertCircle,
} from "lucide-react";
import type { Order } from "@/lib/types";

export function OrderConfirmationPage() {
  const { route, navigate } = useRouter();
  const orderNumber = route.segments[1] ?? "";
  const pending = route.query.get("pending") === "1" || route.query.get("status") === "pending";
  const [verifying, setVerifying] = useState(false);

  const { data, isLoading, refetch } = useQuery<{ order: Order }>({
    queryKey: ["order", orderNumber],
    queryFn: async () => {
      const r = await fetch(`/api/orders/${orderNumber}`);
      if (!r.ok) return null;
      return (await r.json()) as { order: Order };
    },
    enabled: Boolean(orderNumber),
  });

  const order = data?.order;

  // Server-side verify on first load (if not pending) — this hits
  // /api/orders/verify which calls the provider's server-side API.
  useEffect(() => {
    if (!orderNumber || pending) return;
    let active = true;
    (async () => {
      setVerifying(true);
      try {
        const r = await fetch("/api/orders/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderNumber }),
        });
        if (!active) return;
        if (r.ok) {
          const result = await r.json();
          if (result.status === "paid") {
            toast.success("Payment confirmed");
            refetch();
          } else if (result.status === "failed") {
            toast.error("Payment could not be verified. Please contact support.");
          }
        }
      } catch {
        // silent — already shows pending state
      } finally {
        if (active) setVerifying(false);
      }
    })();
    return () => { active = false; };
  }, [orderNumber, pending, refetch]);

  if (isLoading || !order) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <Skeleton className="h-8 w-1/2 mb-4" />
        <Skeleton className="h-32 w-full mb-4" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const isPaid = order.paymentStatus === "paid";
  const isFailed = order.paymentStatus === "failed";
  const isCod = order.paymentMethod === "cod";

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12 animate-fade-up">
      {/* Status header */}
      <div className="text-center mb-8">
        {isPaid || isCod ? (
          <>
            <div className="inline-flex h-16 w-16 rounded-full bg-accent/10 items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-accent" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-2">
              {isCod ? "Order Placed Successfully!" : "Payment Confirmed"}
            </h1>
            <p className="text-muted-foreground">
              Thank you, {order.firstName}. We've received your order and a confirmation is on its way to <strong>{order.email}</strong>.
            </p>
          </>
        ) : isFailed ? (
          <>
            <div className="inline-flex h-16 w-16 rounded-full bg-destructive/10 items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-2">Payment Failed</h1>
            <p className="text-muted-foreground">
              Your payment couldn't be processed. The order has been saved and you can retry payment by clicking below.
            </p>
          </>
        ) : (
          <>
            <div className="inline-flex h-16 w-16 rounded-full bg-secondary items-center justify-center mb-4">
              {verifying ? (
                <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
              ) : (
                <Package className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <h1 className="font-display text-3xl font-bold mb-2">Order Received</h1>
            <p className="text-muted-foreground">
              We're verifying your payment. This usually takes a few seconds — please don't close this page.
            </p>
          </>
        )}
      </div>

      {/* Order number card */}
      <div className="border border-border rounded-lg p-5 bg-card mb-6">
        <div className="flex justify-between items-center flex-wrap gap-2 mb-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Order Number</p>
            <p className="font-mono text-lg font-semibold">{order.orderNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Order Date</p>
            <p className="text-sm font-medium">
              {new Date(order.createdAt).toLocaleDateString(undefined, {
                year: "numeric", month: "long", day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <ol className="relative border-l border-border ml-3 space-y-4">
          <Step
            icon={CheckCircle2}
            label="Order Placed"
            description={`Received at ${new Date(order.createdAt).toLocaleTimeString()}`}
            done
          />
          <Step
            icon={CreditCard}
            label={isPaid || isCod ? "Payment Confirmed" : "Payment Pending"}
            description={
              isCod
                ? "Cash on delivery — pay when your order arrives."
                : isPaid
                ? "Payment verified by the payment provider."
                : "Waiting for payment confirmation from the provider."
            }
            done={isPaid || isCod}
          />
          <Step
            icon={Package}
            label="Order Processed"
            description={isPaid || isCod ? "We're preparing your items for shipment." : "Once payment is confirmed, we'll start packing."}
          />
          <Step
            icon={Truck}
            label="Shipped"
            description="You'll receive tracking information by email."
          />
        </ol>

        <div className="border-t border-border mt-5 pt-5 flex items-start gap-3 text-sm">
          <Mail className="h-4 w-4 text-accent shrink-0 mt-0.5" />
          <p className="text-muted-foreground">
            A receipt and order updates will be sent to <strong className="text-foreground">{order.email}</strong>.
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="border border-border rounded-lg p-5 bg-card mb-6">
        <h2 className="font-semibold mb-4">Items in this order</h2>
        <ul className="space-y-3">
          {order.items.map((it) => (
            <li key={`${it.productId}-${it.size ?? ""}-${it.color ?? ""}`} className="flex gap-3">
              <img src={it.image} alt={it.name} className="h-16 w-16 rounded-md object-cover" />
              <div className="flex-1 min-w-0">
                <Link to={`/product/${it.slug}`} className="text-sm font-medium hover:text-accent line-clamp-1">
                  {it.name}
                </Link>
                {(it.size || it.color) && (
                  <p className="text-xs text-muted-foreground">
                    {it.size && <span>Size: {it.size}</span>}
                    {it.size && it.color && " · "}
                    {it.color && <span>Color: {it.color}</span>}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">Qty: {it.quantity}</p>
              </div>
              <p className="text-sm font-semibold whitespace-nowrap">
                {formatPrice(it.price * it.quantity)}
              </p>
            </li>
          ))}
        </ul>
        <div className="border-t border-border mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            {order.shipping === 0 ? (
              <span className="text-accent">Free</span>
            ) : (
              <span>{formatPrice(order.shipping)}</span>
            )}
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Delivery details */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="border border-border rounded-lg p-5 bg-card">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Delivery Address</h3>
          <p className="text-sm">
            <strong>{order.firstName} {order.lastName}</strong><br />
            {order.address}<br />
            {order.city}, {order.state} {order.postalCode}<br />
            {order.country}<br />
            <span className="text-muted-foreground">Phone: {order.phone}</span>
          </p>
        </div>
        <div className="border border-border rounded-lg p-5 bg-card">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Payment</h3>
          <p className="text-sm capitalize">
            <strong>Method:</strong> {order.paymentMethod}<br />
            <strong>Status:</strong>{" "}
            <span className={
              isPaid ? "text-accent" : isFailed ? "text-destructive" : "text-muted-foreground"
            }>
              {order.paymentStatus}
            </span>
            <br />
            <strong>Order Status:</strong>{" "}
            <span className="capitalize">{order.orderStatus}</span>
          </p>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Link to="/shop"><Button>Continue Shopping</Button></Link>
        <Link to="/orders"><Button variant="outline">View Order History</Button></Link>
        {!isPaid && !isFailed && (
          <Button
            variant="outline"
            onClick={async () => {
              setVerifying(true);
              try {
                await fetch("/api/orders/verify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ orderNumber }),
                });
                refetch();
              } finally {
                setVerifying(false);
              }
            }}
            disabled={verifying}
          >
            {verifying ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Re-check payment
          </Button>
        )}
      </div>
    </div>
  );
}

function Step({ icon: Icon, label, description, done }: { icon: any; label: string; description: string; done?: boolean }) {
  return (
    <li className="ml-6">
      <span className={`absolute -left-3.5 flex h-7 w-7 items-center justify-center rounded-full ${done ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
        <Icon className="h-4 w-4" />
      </span>
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </li>
  );
}

function CreditCard(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}
