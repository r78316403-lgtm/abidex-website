"use client";

import { Link, useRouter } from "@/lib/router";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { formatPrice } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const navigate = useRouter().navigate;
  const wishlistHas = useWishlistStore((s) => s.productIds.includes(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  const effectivePrice = product.salePrice ?? product.price;
  const onSale = product.salePrice != null && product.salePrice < product.price;
  const soldOut = product.stock <= 0;
  const discountPct = onSale
    ? Math.round(((product.price - (product.salePrice as number)) / product.price) * 100)
    : 0;

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) return;
    // If product has sizes/colors, send to product page so user can pick.
    if (product.sizes.length > 0 || product.colors.length > 0) {
      navigate(`/product/${product.slug}`);
      return;
    }
    addItem(product, { quantity: 1 });
  };

  const toggleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <article className="group relative flex flex-col bg-card rounded-xl border border-border/60 overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.newArrival && (
          <span className="px-2 py-0.5 rounded-full bg-foreground text-background text-[10px] font-bold uppercase tracking-wider">
            New
          </span>
        )}
        {onSale && (
          <span className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider">
            -{discountPct}%
          </span>
        )}
        {product.bestSeller && (
          <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-wider border border-border">
            Bestseller
          </span>
        )}
      </div>

      {/* Wishlist button */}
      <button
        onClick={toggleWish}
        aria-label={wishlistHas ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
      >
        <Heart
          className={`h-4 w-4 ${wishlistHas ? "fill-accent text-accent" : "text-foreground"}`}
        />
      </button>

      <Link to={`/product/${product.slug}`} className="block aspect-square overflow-hidden bg-secondary">
        <img
          src={product.thumbnail}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      <div className="flex flex-col flex-1 p-3 sm:p-4">
        <p className="text-xs text-muted-foreground mb-0.5">
          {product.brand?.name ?? product.category?.name}
        </p>
        <Link to={`/product/${product.slug}`} className="hover:text-accent transition-colors">
          <h3 className="text-sm font-medium leading-snug line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {product.rating > 0 && (
          <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
            <Stars rating={product.rating} />
            <span>({product.reviewCount})</span>
          </div>
        )}

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-semibold">{formatPrice(effectivePrice)}</span>
          {onSale && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <div className="mt-auto pt-3">
          {soldOut ? (
            <Button size="sm" variant="secondary" className="w-full" disabled>
              Sold Out
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="w-full group-hover:bg-foreground group-hover:text-background transition-colors"
              onClick={quickAdd}
            >
              <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
              {product.sizes.length > 0 || product.colors.length > 0 ? "View Options" : "Quick Add"}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

export function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  const sz = size === "md" ? "h-4 w-4" : "h-3 w-3";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} className={`${sz} fill-accent text-accent`} />
      ))}
      {half && <HalfStar className={`${sz} text-accent`} />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} className={`${sz} text-muted-foreground`} />
      ))}
    </div>
  );
}

function Star(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
    </svg>
  );
}
function HalfStar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <defs>
        <linearGradient id="half">
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"
        fill="url(#half)"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}
