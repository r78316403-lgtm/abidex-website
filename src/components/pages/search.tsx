"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@/lib/router";
import { ProductCard } from "@/components/ecommerce/product-card";
import { EmptyState, SectionHeading } from "@/components/ecommerce/ui-blocks";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, PackageSearch } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/types";

export function SearchResultsPage() {
  const { route, navigate } = useRouter();
  const q = route.query.get("q") ?? "";
  // Track q changes without using setState-in-effect.
  const [lastQ, setLastQ] = useState(q);
  const [input, setInput] = useState(q);
  if (q !== lastQ) {
    setLastQ(q);
    setInput(q);
  }

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["products", "search", q],
    queryFn: async () =>
      (await (await fetch(`/api/products/search?q=${encodeURIComponent(q)}`)).json()).products,
    enabled: q.length >= 2,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) navigate(`/search?q=${encodeURIComponent(input.trim())}`);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 md:py-10">
      <SectionHeading
        eyebrow="Search"
        title={q ? `Results for "${q}"` : "Search products"}
        description="Find products by name, brand, SKU, or tag."
      />

      <form onSubmit={submit} className="relative max-w-2xl mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search for products…"
          className="pl-10 h-11"
        />
      </form>

      {q.length < 2 ? (
        <EmptyState
          icon={Search}
          title="Start typing to search"
          description="Search across our full catalog by name, brand, or SKU."
        />
      ) : isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      ) : !products || products.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No products found"
          description={`We couldn't find anything matching "${q}". Try a different search or browse the full catalog.`}
          actionLabel="Browse all products"
          actionTo="/shop"
        />
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            Showing {products.length} {products.length === 1 ? "result" : "results"}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
