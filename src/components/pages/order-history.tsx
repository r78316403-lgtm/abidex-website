"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, Link } from "@/lib/router";
import { formatPrice } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ecommerce/ui-blocks";
import { Package, Search, ArrowRight } from "lucide-react";
import type { Order } from "@/lib/types";

export function OrderHistoryPage() {
  const { navigate } = useRouter();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { data, isLoading, isFetching } = useQuery<{ orders: Order[] }>({
    queryKey: ["orders", email],
    queryFn: async () => {
      const r = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
      if (!r.ok) return { orders: [] };
      return (await r.json()) as { orders: Order[] };
    },
    enabled: submitted && Boolean(email),
  });

  const orders = data?.orders ?? [];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setSubmitted(true);
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6 md:py-10 animate-fade-up">
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Order History</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Enter the email you used at checkout and we'll find your orders.
      </p>

      <form onSubmit={submit} className="flex gap-2 mb-6">
        <Input
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 h-11"
        />
        <Button type="submit" size="lg">
          <Search className="h-4 w-4 mr-2" /> Find Orders
        </Button>
      </form>

      {!submitted && (
        <EmptyState
          icon={Package}
          title="Find your orders"
          description="Enter the email you used at checkout above to see all your past orders in one place."
        />
      )}

      {submitted && (isLoading || isFetching) && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />)}
        </div>
      )}

      {submitted && !isLoading && orders.length === 0 && (
        <EmptyState
          icon={Package}
          title="No orders found"
          description="We couldn't find any orders for that email. Double-check the address or start a new order."
          actionLabel="Browse Products"
          actionTo="/shop"
        />
      )}

      {orders.length > 0 && (
        <ul className="space-y-3">
          {orders.map((o) => (
            <li key={o.orderNumber}>
              <button
                onClick={() => navigate(`/order/${o.orderNumber}`)}
                className="block w-full text-left p-4 border border-border rounded-lg bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-semibold">{o.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(o.createdAt).toLocaleDateString(undefined, {
                        year: "numeric", month: "long", day: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {o.items.length} item{o.items.length !== 1 ? "s" : ""} · {o.paymentMethod}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatPrice(o.total)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      o.paymentStatus === "paid"
                        ? "bg-accent/10 text-accent"
                        : o.paymentStatus === "failed"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-secondary text-muted-foreground"
                    }`}>
                      {o.paymentStatus}
                    </span>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="text-center mt-6">
        <Link to="/shop">
          <Button variant="ghost" size="sm">
            Continue Shopping <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
