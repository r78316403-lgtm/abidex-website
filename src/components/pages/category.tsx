"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@/lib/router";
import { ProductCard } from "@/components/ecommerce/product-card";
import { EmptyState, SectionHeading } from "@/components/ecommerce/ui-blocks";
import { Skeleton } from "@/components/ui/skeleton";
import { PackageSearch } from "lucide-react";
import type { Product, Category } from "@/lib/types";

export function CategoryPage() {
  const { route, navigate } = useRouter();
  const categorySlug = route.segments[1] ?? "";
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => (await fetch("/api/categories")).json(),
    staleTime: 5 * 60_000,
  });
  const category = categories?.find((c) => c.slug === categorySlug);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["products", "category", categorySlug],
    queryFn: async () =>
      (await (await fetch(`/api/products?category=${categorySlug}`)).json()).products,
    enabled: Boolean(categorySlug),
  });

  if (!categorySlug) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <SectionHeading
          eyebrow="Browse"
          title="All Categories"
          description="Pick a category to start shopping."
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {categories?.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/category/${c.slug}`)}
              className="group relative aspect-square rounded-xl overflow-hidden bg-secondary"
            >
              <img src={c.image ?? ""} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white text-sm font-semibold">{c.name}</h3>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <Skeleton className="h-8 w-1/3 mb-3" />
        <Skeleton className="h-4 w-1/2 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <EmptyState
          icon={PackageSearch}
          title="Category not found"
          description="This category may have been renamed or removed."
          actionLabel="Browse all products"
          actionTo="/shop"
        />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <EmptyState
          icon={PackageSearch}
          title={`No products in ${category.name} yet`}
          description="We're stocking this category. Check back soon — or browse all products in the meantime."
          actionLabel="Browse all products"
          actionTo="/shop"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 md:py-10 animate-fade-up">
      <SectionHeading
        eyebrow={category.name}
        title={category.name}
        description={category.description ?? undefined}
        actionLabel="View all products"
        actionTo="/shop"
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
