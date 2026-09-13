"use client";

// =====================================================================
// CART SHEET — slide-out preview that opens whenever an item is added
// =====================================================================

import { useCartStore, selectCartSubtotal } from "@/lib/cart-store";
import { useRouter, Link } from "@/lib/router";
import { formatPrice, siteConfig } from "@/lib/site-config";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";

export function CartSheet() {
  const { isOpen: open, closeCart, items, updateQuantity, removeItem } = useCartStore();
  const navigate = useRouter().navigate;
  const subtotal = useCartStore(selectCartSubtotal);
  const remainingForFree = siteConfig.shipping.freeThreshold - subtotal;
  const hasFreeShipping = remainingForFree <= 0;

  const goToCart = () => {
    closeCart();
    navigate("/cart");
  };
  const goToCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={(o) => (o ? null : closeCart())}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-5 py-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" /> Your Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">
                Let's find something you'll love.
              </p>
            </div>
            <Button onClick={() => { closeCart(); navigate("/shop"); }} className="mt-2">
              Browse Products
            </Button>
          </div>
        ) : (
          <>
            <div className="px-5 py-2 text-sm bg-secondary/50 border-b border-border">
              {hasFreeShipping ? (
                <p className="text-accent font-medium">✓ You qualify for free shipping!</p>
              ) : (
                <p>
                  You're <span className="font-semibold">{formatPrice(remainingForFree)}</span> away from
                  free shipping.
                </p>
              )}
            </div>

            <ul className="flex-1 overflow-y-auto mercato-scroll divide-y divide-border">
              {items.map((item) => (
                <li key={`${item.productId}-${item.size ?? ""}-${item.color ?? ""}`} className="flex gap-3 p-4">
                  <Link to={`/product/${item.slug}`} onClick={closeCart} className="shrink-0">
                    <img src={item.image} alt={item.name} className="h-20 w-20 rounded-lg object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.slug}`} onClick={closeCart} className="text-sm font-medium line-clamp-2 hover:text-accent transition-colors">
                      {item.name}
                    </Link>
                    {(item.size || item.color) && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.size && item.color && " · "}
                        {item.color && <span>Color: {item.color}</span>}
                      </p>
                    )}
                    <p className="text-sm font-semibold mt-1">{formatPrice(item.price)}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-border rounded-md">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-secondary transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-secondary transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.size, item.color)}
                        className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border p-5 space-y-3">
              <div className="flex justify-between items-center text-base">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping & taxes calculated at checkout.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={goToCart}>
                  View Cart
                </Button>
                <Button onClick={goToCheckout}>
                  Checkout
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
