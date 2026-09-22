"use client";

import { useCartStore, selectCartSubtotal } from "@/lib/cart-store";
import { useRouter, Link } from "@/lib/router";
import { formatPrice, siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ecommerce/ui-blocks";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useSeo } from "@/lib/use-seo";

export function CartPage() {
  useSeo({
    title: "Your Shopping Cart",
    description: "Review your KEDI Healthcare cart and proceed to checkout.",
    canonicalPath: "#/cart",
    noIndex: true,
  });
  const { items, updateQuantity, removeItem } = useCartStore();
  const navigate = useRouter().navigate;
  const subtotal = useCartStore(selectCartSubtotal);
  const shipping = subtotal >= siteConfig.shipping.freeThreshold ? 0 : siteConfig.shipping.standardRate;
  const total = subtotal + shipping;
  const hasFreeShipping = subtotal >= siteConfig.shipping.freeThreshold;

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Let's fix that."
          actionLabel="Browse Products"
          actionTo="/shop"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 md:py-10 animate-fade-up">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Shopping Cart</h1>
        <Link to="/shop" className="text-sm text-muted-foreground hover:text-accent flex items-center">
          <X className="h-4 w-4 mr-1" /> Continue shopping
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size ?? ""}-${item.color ?? ""}`}
              className="flex gap-4 p-4 border border-border rounded-lg bg-card"
            >
              <Link to={`/product/${item.slug}`} className="shrink-0">
                <img src={item.image} alt={item.name} className="h-24 w-24 sm:h-28 sm:w-28 rounded-md object-cover" />
              </Link>
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link to={`/product/${item.slug}`} className="font-medium hover:text-accent line-clamp-2">
                      {item.name}
                    </Link>
                    {(item.size || item.color) && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.size && item.color && " · "}
                        {item.color && <span>Color: {item.color}</span>}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">SKU: {item.sku}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.size, item.color)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-end justify-between mt-auto pt-3">
                  <div className="flex items-center border border-border rounded-md h-9">
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                      className="px-2.5 h-full hover:bg-secondary transition-colors"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-3 text-sm min-w-10 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                      className="px-2.5 h-full hover:bg-secondary transition-colors"
                      aria-label="Increase"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-muted-foreground">{formatPrice(item.price)} each</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2">
            <Link to="/shop">
              <Button variant="ghost" size="sm">
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" /> Continue Shopping
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">{items.length} item{items.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="p-5 border border-border rounded-lg bg-card sticky top-24">
            <h2 className="font-display text-lg font-semibold mb-4">Order Summary</h2>
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
              {!hasFreeShipping && (
                <p className="text-xs text-muted-foreground pt-2 pb-1">
                  Add {formatPrice(siteConfig.shipping.freeThreshold - subtotal)} more for free shipping.
                </p>
              )}
            </div>
            <div className="border-t border-border mt-4 pt-4 flex justify-between font-bold text-base">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Taxes calculated at checkout</p>

            <Button size="lg" className="w-full mt-5" onClick={() => navigate("/checkout")}>
              Proceed to Checkout
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              <span className="font-medium">Secure checkout</span> · 30-day returns · Real-time support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
