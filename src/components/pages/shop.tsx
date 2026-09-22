"use client";

// =====================================================================
// SHOP PAGE — all products with filters + sorting + search
// =====================================================================

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@/lib/router";
import { ProductCard } from "@/components/ecommerce/product-card";
import { EmptyState, SectionHeading } from "@/components/ecommerce/ui-blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, X, PackageSearch } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product, Category, Brand } from "@/lib/types";
import { useSeo } from "@/lib/use-seo";
import { itemListSchema } from "@/lib/structured-data";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "bestselling", label: "Best Selling" },
  { value: "rating", label: "Highest Rated" },
];

export function ShopPage() {
  const { route, navigate } = useRouter();
  const initialCategory = route.query.get("cat") || "";
  const initialSort = route.query.get("sort") || "featured";
  const initialQ = route.query.get("q") || "";
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [q, setQ] = useState(initialQ);
  const [brand, setBrand] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 600]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync local state when URL changes (e.g. user clicks a category link).
  // Pattern: detect change during render, then setState. Avoids the
  // setState-in-effect antipattern recommended by React docs.
  const [lastQuery, setLastQuery] = useState<string>("");
  const currentQueryStr = route.query.toString();
  if (currentQueryStr !== lastQuery) {
    setLastQuery(currentQueryStr);
    const cat = route.query.get("cat") || "";
    const srt = route.query.get("sort") || "featured";
    const qq = route.query.get("q") || "";
    if (cat !== category) setCategory(cat);
    if (srt !== sort) setSort(srt);
    if (qq !== q) setQ(qq);
  }

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["products", "shop"],
    queryFn: async () => (await (await fetch("/api/products")).json()).products,
  });
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => (await fetch("/api/categories")).json(),
    staleTime: 5 * 60_000,
  });
  const { data: brands } = useQuery<Brand[]>({
    queryKey: ["brands"],
    queryFn: async () => (await fetch("/api/brands")).json(),
    staleTime: 5 * 60_000,
  });

  const allSizes = useMemo(() => {
    const s = new Set<string>();
    products?.forEach((p) => p.sizes.forEach((sz) => s.add(sz)));
    return Array.from(s).sort();
  }, [products]);
  const allColors = useMemo(() => {
    const s = new Set<string>();
    products?.forEach((p) => p.colors.forEach((c) => s.add(c)));
    return Array.from(s).sort();
  }, [products]);

  const filtered = useMemo(() => {
    if (!products) return [];
    let list = [...products];
    if (category) list = list.filter((p) => p.category?.slug === category);
    if (brand) list = list.filter((p) => p.brand?.slug === brand);
    if (q.trim()) {
      const qq = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(qq) ||
          p.shortDescription.toLowerCase().includes(qq) ||
          p.sku.toLowerCase().includes(qq)
      );
    }
    list = list.filter((p) => {
      const price = p.salePrice ?? p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    if (minRating > 0) list = list.filter((p) => p.rating >= minRating);
    if (inStockOnly) list = list.filter((p) => p.stock > 0);
    if (selectedSizes.length) list = list.filter((p) => p.sizes.some((s) => selectedSizes.includes(s)));
    if (selectedColors.length) list = list.filter((p) => p.colors.some((c) => selectedColors.includes(c)));

    switch (sort) {
      case "price-asc": list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price)); break;
      case "price-desc": list.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price)); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      case "newest": list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)); break;
      case "bestselling": list.sort((a, b) => b.reviewCount - a.reviewCount); break;
      default: list.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
    }
    return list;
  }, [products, category, brand, q, priceRange, minRating, inStockOnly, selectedSizes, selectedColors, sort]);

  const toggleArr = (arr: string[], v: string) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const updateUrl = (patch: Record<string, string>) => {
    const params = new URLSearchParams();
    if (category) params.set("cat", category);
    if (sort !== "featured") params.set("sort", sort);
    if (q) params.set("q", q);
    Object.entries(patch).forEach(([k, v]) => {
      if (v) params.set(k, v); else params.delete(k);
    });
    const qs = params.toString();
    navigate(`/shop${qs ? `?${qs}` : ""}`);
  };

  const setCategoryAndUrl = (c: string) => {
    setCategory(c);
    const params = new URLSearchParams();
    if (c) params.set("cat", c);
    if (sort !== "featured") params.set("sort", sort);
    if (q) params.set("q", q);
    navigate(`/shop${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const setSortAndUrl = (s: string) => {
    setSort(s);
    const params = new URLSearchParams();
    if (category) params.set("cat", category);
    if (s !== "featured") params.set("sort", s);
    if (q) params.set("q", q);
    navigate(`/shop${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const clearFilters = () => {
    setCategory(""); setBrand(""); setQ(""); setSort("featured");
    setPriceRange([0, 600]); setMinRating(0); setInStockOnly(false);
    setSelectedSizes([]); setSelectedColors([]);
    navigate("/shop");
  };

  // SEO metadata for the shop page
  const seoTitle = category
    ? `${categories?.find((c) => c.slug === category)?.name ?? "Shop"} — Buy Online in Nigeria`
    : q
    ? `Search: ${q} — KEDI Healthcare Nigeria`
    : "Shop All Products — Herbal Medicine, Vitamins & Wellness Equipment";
  const seoDesc = category
    ? categories?.find((c) => c.slug === category)?.description ??
      `Browse ${category} products from KEDI Healthcare. NAFDAC-registered, nationwide delivery.`
    : "Browse all KEDI Healthcare products — herbal medicines, vitamins, supplements, and wellness equipment. NAFDAC-registered. Free shipping over ₦50,000.";
  useSeo({
    title: seoTitle,
    description: seoDesc,
    canonicalPath: category ? `#/category/${category}` : "#/shop",
    jsonLd: filtered.length > 0
      ? itemListSchema(filtered.slice(0, 20), categories?.find((c) => c.slug === category)?.name)
      : undefined,
  });

  const activeFilterCount =
    (category ? 1 : 0) + (brand ? 1 : 0) + (q ? 1 : 0) +
    (minRating > 0 ? 1 : 0) + (inStockOnly ? 1 : 0) +
    selectedSizes.length + selectedColors.length +
    (priceRange[0] > 0 || priceRange[1] < 600 ? 1 : 0);

  const FilterPanel = (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Category</h3>
        <div className="space-y-1">
          <button
            onClick={() => setCategoryAndUrl("")}
            className={`block w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-secondary transition-colors ${!category ? "font-semibold text-accent" : ""}`}
          >
            All Categories
          </button>
          {categories?.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoryAndUrl(c.slug)}
              className={`block w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-secondary transition-colors ${category === c.slug ? "font-semibold text-accent" : ""}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-sm font-semibold mb-2">
          Price: ${priceRange[0]} – ${priceRange[1]}
        </h3>
        <Slider
          value={priceRange}
          min={0}
          max={600}
          step={10}
          onValueChange={(v) => setPriceRange(v as [number, number])}
          className="py-2"
        />
      </div>

      {/* Brand */}
      {brands && brands.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2">Brand</h3>
          <div className="space-y-1">
            <button
              onClick={() => setBrand("")}
              className={`block w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-secondary transition-colors ${!brand ? "font-semibold text-accent" : ""}`}
            >
              All Brands
            </button>
            {brands.map((b) => (
              <button
                key={b.id}
                onClick={() => setBrand(b.slug)}
                className={`block w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-secondary transition-colors ${brand === b.slug ? "font-semibold text-accent" : ""}`}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {allSizes.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2">Size</h3>
          <div className="flex flex-wrap gap-1.5">
            {allSizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSizes((prev) => toggleArr(prev, s))}
                className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                  selectedSizes.includes(s)
                    ? "border-accent bg-accent text-accent-foreground"
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
      {allColors.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2">Color</h3>
          <div className="flex flex-wrap gap-1.5">
            {allColors.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedColors((prev) => toggleArr(prev, c))}
                className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                  selectedColors.includes(c)
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border hover:border-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Rating */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Minimum Rating</h3>
        <div className="flex gap-1.5">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                minRating === r ? "border-accent bg-accent text-accent-foreground" : "border-border"
              }`}
            >
              {r === 0 ? "Any" : `${r}+★`}
            </button>
          ))}
        </div>
      </div>

      {/* In stock */}
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className="h-4 w-4 accent-accent"
        />
        In stock only
      </label>

      {activeFilterCount > 0 && (
        <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
          <X className="h-3.5 w-3.5 mr-1.5" /> Clear all ({activeFilterCount})
        </Button>
      )}
    </div>
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 md:py-10">
      <SectionHeading
        eyebrow="Shop"
        title={category ? (categories?.find((c) => c.slug === category)?.name ?? "Shop") : "All Products"}
        description={
          category
            ? categories?.find((c) => c.slug === category)?.description ?? ""
            : "Browse the full KEDI collection. Filter, sort, and find the right herbal products, vitamins, or wellness equipment for your needs."
        }
      />

      {/* Search + sort row */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search within results…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sort} onValueChange={setSortAndUrl}>
          <SelectTrigger className="w-[180px] hidden sm:flex">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORTS.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-1.5 h-5 px-1.5">{activeFilterCount}</Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">{FilterPanel}</div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-24">{FilterPanel}</div>
        </aside>

        {/* Results grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
            <p>{filtered.length} {filtered.length === 1 ? "product" : "products"}</p>
            <div className="sm:hidden">
              <Select value={sort} onValueChange={setSortAndUrl}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  {SORTS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="No products found"
              description="Try changing your filters or search terms. If you're looking for something specific, get in touch — we love a challenge."
              actionLabel="Clear filters"
              onAction={clearFilters}
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
