"use client";

// =====================================================================
// PRODUCT PAGE — dynamic template (works for all products via slug)
// =====================================================================

import { useQuery } from "@tanstack/react-query";
import { useRouter, Link } from "@/lib/router";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore, useRecentlyViewedStore } from "@/lib/wishlist-store";
import { formatPrice, siteConfig } from "@/lib/site-config";
import { ProductCard, Stars } from "@/components/ecommerce/product-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Heart, ShoppingBag, Minus, Plus, Truck, RotateCcw, ShieldCheck,
  ChevronRight, Star, PackageSearch,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Product, Review } from "@/lib/types";

export function ProductPage() {
  const { route, navigate } = useRouter();
  const slug = route.segments[1] ?? "";
  const addItem = useCartStore((s) => s.addItem);
  const wishlistProductIds = useWishlistStore((s) => s.productIds);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.add);
  const recentlyViewed = useRecentlyViewedStore((s) => s.productIds);

  const { data, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const r = await fetch(`/api/products/${slug}`);
      if (!r.ok) return null;
      return (await r.json()) as { product: Product; related: Product[]; reviews: Review[] };
    },
    enabled: Boolean(slug),
  });
  const product = data?.product;
  const related = data?.related ?? [];
  const reviews = data?.reviews ?? [];

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();

  // Reset local UI state when navigating to a different product.
  // Using a key-based approach by tracking slug changes here so we
  // avoid the setState-in-effect antipattern.
  const [prevSlug, setPrevSlug] = useState(slug);
  if (slug !== prevSlug) {
    setPrevSlug(slug);
    setSelectedImage(0);
    setQuantity(1);
    setSelectedSize(undefined);
    setSelectedColor(undefined);
  }

  useEffect(() => {
    if (product) addRecentlyViewed(product.id);
  }, [product, addRecentlyViewed]);

  const { data: recentlyViewedProducts } = useQuery<Product[]>({
    queryKey: ["products", "recent", recentlyViewed.join(",")],
    queryFn: async () => {
      if (!recentlyViewed.length) return [];
      const all = (await (await fetch("/api/products")).json()).products as Product[];
      const filtered = recentlyViewed
        .map((id) => all.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p) && p?.slug !== slug);
      return filtered.slice(0, 4);
    },
    enabled: recentlyViewed.length > 0,
  });

  if (isLoading) return <ProductSkeleton />;
  if (!product) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-col items-center text-center py-16">
          <PackageSearch className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">Product not found</h1>
          <p className="text-muted-foreground mb-6">
            This product may have been removed or the link is incorrect.
          </p>
          <Link to="/shop"><Button>Browse Products</Button></Link>
        </div>
      </div>
    );
  }

  const effectivePrice = product.salePrice ?? product.price;
  const onSale = product.salePrice != null && product.salePrice < product.price;
  const soldOut = product.stock <= 0;
  const discountPct = onSale
    ? Math.round(((product.price - (product.salePrice as number)) / product.price) * 100)
    : 0;

  const addToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (product.colors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }
    addItem(product, { quantity, size: selectedSize, color: selectedColor });
    toast.success(`${product.name} added to cart`);
  };

  const buyNow = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (product.colors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }
    addItem(product, { quantity, size: selectedSize, color: selectedColor });
    navigate("/checkout");
  };

  return (
    <div className="animate-fade-up">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
            description: product.shortDescription,
            sku: product.sku,
            brand: { "@type": "Brand", name: product.brand?.name },
            image: product.images,
            offers: {
              "@type": "Offer",
              price: effectivePrice,
              priceCurrency: product.currency,
              availability: soldOut
                ? "https://schema.org/OutOfStock"
                : "https://schema.org/InStock",
            },
            aggregateRating: product.rating > 0 ? {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: product.reviewCount,
            } : undefined,
          }),
        }}
      />

      {/* Breadcrumb */}
      <div className="border-b border-border bg-secondary/30">
        <div className="container mx-auto max-w-7xl px-4 py-3">
          <nav className="flex items-center gap-1 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-accent">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/shop" className="hover:text-accent">Shop</Link>
            {product.category && (
              <>
                <ChevronRight className="h-3 w-3" />
                <Link to={`/category/${product.category.slug}`} className="hover:text-accent">
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div className="flex flex-col gap-3">
            <div className="aspect-square rounded-xl overflow-hidden bg-secondary">
              <img
                src={product.images[selectedImage] ?? product.thumbnail}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? "border-accent" : "border-transparent hover:border-border"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div>
              {product.brand && (
                <p className="text-sm font-medium text-accent mb-1">{product.brand.name}</p>
              )}
              <h1 className="font-display text-2xl md:text-3xl font-bold leading-tight mb-2">
                {product.name}
              </h1>
              {product.rating > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Stars rating={product.rating} size="md" />
                  <span className="font-medium">{product.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
                </div>
              )}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-2xl md:text-3xl font-bold">{formatPrice(effectivePrice)}</span>
              {onSale && (
                <>
                  <span className="text-base text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs font-bold">
                    -{discountPct}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.shortDescription}
            </p>

            <Separator />

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold">Size</h3>
                  <button className="text-xs text-muted-foreground hover:text-accent">Size guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-12 px-3 h-10 text-sm rounded-md border-2 font-medium transition-colors ${
                        selectedSize === s
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 h-10 text-sm rounded-md border-2 font-medium transition-colors ${
                        selectedColor === c
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to cart */}
            <div className="flex gap-3 items-center">
              <div className="flex items-center border border-border rounded-md h-11">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 h-full hover:bg-secondary transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 text-sm font-medium min-w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 h-full hover:bg-secondary transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button
                size="lg"
                className="flex-1 h-11"
                onClick={addToCart}
                disabled={soldOut}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                {soldOut ? "Sold Out" : "Add to Cart"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 px-3"
                onClick={() => toggleWishlist(product.id)}
                aria-label="Add to wishlist"
              >
                <Heart className={`h-5 w-5 ${wishlistProductIds.includes(product.id) ? "fill-accent text-accent" : ""}`} />
              </Button>
            </div>

            <Button
              size="lg"
              variant="secondary"
              className="w-full h-11"
              onClick={buyNow}
              disabled={soldOut}
            >
              Buy It Now
            </Button>

            {/* Stock + trust */}
            <div className="flex flex-col gap-2 text-sm pt-2">
              {soldOut ? (
                <p className="text-destructive font-medium">Currently out of stock</p>
              ) : (
                <p className="text-accent font-medium flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  In stock — {product.stock} available
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Truck className="h-4 w-4 text-accent shrink-0" />
                  <span>Free shipping over {formatPrice(siteConfig.shipping.freeThreshold)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <RotateCcw className="h-4 w-4 text-accent shrink-0" />
                  <span>30-day returns</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Description / Specs / Shipping / Reviews */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start overflow-x-auto mb-6">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="prose prose-sm max-w-3xl">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </TabsContent>

            <TabsContent value="specifications">
              {product.specifications ? (
                <div className="max-w-2xl border border-border rounded-lg overflow-hidden">
                  {Object.entries(product.specifications).map(([k, v], i) => (
                    <div
                      key={k}
                      className={`flex justify-between px-4 py-3 text-sm ${i % 2 === 0 ? "bg-secondary/40" : ""}`}
                    >
                      <span className="font-medium">{k}</span>
                      <span className="text-muted-foreground">{v}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No specifications available for this product.</p>
              )}
            </TabsContent>

            <TabsContent value="shipping" className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
              {product.shippingInfo ? (
                <p>{product.shippingInfo}</p>
              ) : (
                <p>Ships in 1–2 business days. Free standard shipping on orders over {formatPrice(siteConfig.shipping.freeThreshold)}.</p>
              )}
              <Separator className="my-4" />
              <p>Easy 30-day returns. Items must be in original condition with tags. Refunds processed within 5 business days.</p>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="max-w-3xl">
                {product.rating > 0 && (
                  <div className="flex items-center gap-4 mb-6 p-4 bg-secondary/40 rounded-lg">
                    <div className="text-center">
                      <p className="text-3xl font-bold">{product.rating.toFixed(1)}</p>
                      <Stars rating={product.rating} size="md" />
                      <p className="text-xs text-muted-foreground mt-1">{product.reviewCount} reviews</p>
                    </div>
                    <Separator orientation="vertical" className="h-16" />
                    <p className="text-sm text-muted-foreground">
                      Based on verified customer purchases. Reviews are checked for authenticity.
                    </p>
                  </div>
                )}
                {reviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    No reviews yet. Be the first to share your experience.
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {reviews.map((r) => (
                      <li key={r.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">
                              {r.author.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{r.author}</p>
                              {r.verified && (
                                <span className="text-[10px] text-accent font-medium">Verified purchase</span>
                              )}
                            </div>
                          </div>
                          <Stars rating={r.rating} />
                        </div>
                        {r.title && <p className="text-sm font-semibold mb-1">{r.title}</p>}
                        <p className="text-sm text-muted-foreground">{r.comment}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-12 md:mt-16">
            <h2 className="font-display text-xl md:text-2xl font-bold mb-4">You might also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {related.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Recently viewed */}
        {recentlyViewedProducts && recentlyViewedProducts.length > 0 && (
          <section className="mt-12 md:mt-16">
            <h2 className="font-display text-xl md:text-2xl font-bold mb-4">Recently viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {recentlyViewedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <Skeleton className="aspect-square rounded-xl" />
          <div className="grid grid-cols-5 gap-2 mt-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-md" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}
