"use client";

import { useWishlistStore } from "@/lib/wishlist-store";
import { useCartStore } from "@/lib/cart-store";
import { useQuery } from "@tanstack/react-query";
import { useRouter, Link } from "@/lib/router";
import { ProductCard } from "@/components/ecommerce/product-card";
import { EmptyState } from "@/components/ecommerce/ui-blocks";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { toast } from "sonner";
import { useSeo } from "@/lib/use-seo";

export function WishlistPage() {
  useSeo({
    title: "My Wishlist — KEDI Healthcare",
    description: "Your saved KEDI Healthcare products.",
    canonicalPath: "#/wishlist",
    noIndex: true,
  });
  const navigate = useRouter().navigate;
  const productIds = useWishlistStore((s) => s.productIds);
  const removeWish = useWishlistStore((s) => s.remove);
  const clearWish = useWishlistStore((s) => s.clear);
  const addItem = useCartStore((s) => s.addItem);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["products", "wishlist", productIds.join(",")],
    queryFn: async () => {
      if (!productIds.length) return [];
      const all = (await (await fetch("/api/products")).json()).products as Product[];
      return productIds.map((id) => all.find((p) => p.id === id)).filter(Boolean) as Product[];
    },
    enabled: productIds.length > 0,
  });

  if (!isLoading && (!products || products.length === 0)) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Tap the heart icon on any product to save it for later."
          actionLabel="Browse Products"
          actionTo="/shop"
        />
      </div>
    );
  }

  const moveAllToCart = () => {
    let added = 0;
    products?.forEach((p) => {
      if (p.sizes.length > 0 || p.colors.length > 0) return; // skip products requiring options
      addItem(p, { quantity: 1 });
      added += 1;
    });
    toast.success(`${added} item${added !== 1 ? "s" : ""} moved to cart`);
    if (added > 0) navigate("/cart");
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 md:py-10 animate-fade-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">My Wishlist</h1>
          <p className="text-sm text-muted-foreground">
            {products?.length ?? 0} saved item{(products?.length ?? 0) !== 1 ? "s" : ""}
          </p>
        </div>
        {products && products.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={moveAllToCart}>
              <ShoppingBag className="h-4 w-4 mr-1.5" /> Move all to cart
            </Button>
            <Button variant="ghost" size="sm" onClick={clearWish}>Clear</Button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {products?.map((p) => (
          <div key={p.id} className="relative">
            <ProductCard product={p} />
            <button
              onClick={() => removeWish(p.id)}
              className="absolute bottom-3 right-3 z-10 text-xs px-2 py-1 rounded-md bg-background/80 backdrop-blur hover:text-destructive"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
