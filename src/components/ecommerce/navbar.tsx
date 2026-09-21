"use client";

import { useState } from "react";
import { useRouter, Link } from "@/lib/router";
import { useCartStore, selectCartCount } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { useCustomerStore } from "@/lib/wishlist-store";
import { siteConfig, formatPrice } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@/lib/use-search";

export function Navbar() {
  const navigate = useRouter().navigate;
  const cartCount = useCartStore(selectCartCount);
  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const customer = useCustomerStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { search, results, isSearching } = useSearch();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const r = await fetch("/api/categories");
      return (await r.json()) as { id: string; name: string; slug: string; image: string | null }[];
    },
    staleTime: 5 * 60_000,
  });

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchValue.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
      setMobileOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-16 md:h-18 items-center justify-between gap-4">
          {/* Left: mobile menu trigger + logo */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/" className="font-display text-xl md:text-2xl font-bold tracking-tight">
              {siteConfig.name}
            </Link>
          </div>

          {/* Center: desktop nav */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link to="/" className="px-3 py-2 rounded-md hover:bg-secondary transition-colors">
              Home
            </Link>
            <Link to="/shop" className="px-3 py-2 rounded-md hover:bg-secondary transition-colors">
              Shop
            </Link>
            <div className="relative group">
              <button className="px-3 py-2 rounded-md hover:bg-secondary transition-colors flex items-center gap-1">
                Categories <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <div className="absolute left-0 top-full pt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="bg-card border border-border rounded-lg shadow-lg py-2">
                  {categories?.map((c) => (
                    <Link
                      key={c.id}
                      to={`/category/${c.slug}`}
                      className="block px-4 py-2 text-sm hover:bg-secondary transition-colors"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link to="/distributor" className="px-3 py-2 rounded-md hover:bg-secondary transition-colors text-accent font-medium">
              Distributor
            </Link>
            <Link to="/five-year-plan" className="px-3 py-2 rounded-md hover:bg-secondary transition-colors">
              Five-Year Plan
            </Link>
            <Link to="/about" className="px-3 py-2 rounded-md hover:bg-secondary transition-colors">
              About
            </Link>
            <Link to="/contact" className="px-3 py-2 rounded-md hover:bg-secondary transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right: actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen((s) => !s)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Link to="/wishlist" className="hidden sm:block" aria-label="Wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && <Badge>{wishlistCount}</Badge>}
              </Button>
            </Link>
            <Link to="/account" aria-label="Account">
              <Button variant="ghost" size="icon" className="relative">
                <User className="h-5 w-5" />
                {customer.email && (
                  <span className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-accent" />
                )}
              </Button>
            </Link>
            <Link to="/cart" aria-label="Cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && <Badge>{cartCount}</Badge>}
              </Button>
            </Link>
          </div>
        </div>

        {/* Search dropdown */}
        {searchOpen && (
          <div className="absolute left-0 right-0 top-full bg-background border-b border-border shadow-lg">
            <div className="container mx-auto max-w-3xl py-4 px-4">
              <form onSubmit={submitSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  autoFocus
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    search(e.target.value);
                  }}
                  placeholder="Search products, brands, or SKU…"
                  className="pl-10 pr-10 h-12"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
              {isSearching && results.length === 0 && (
                <p className="text-sm text-muted-foreground mt-3 px-1">Searching…</p>
              )}
              {results.length > 0 && (
                <ul className="mt-3 max-h-80 overflow-y-auto mercato-scroll divide-y divide-border">
                  {results.slice(0, 8).map((p) => (
                    <li key={p.id}>
                      <button
                        onClick={() => {
                          navigate(`/product/${p.slug}`);
                          setSearchOpen(false);
                          setSearchValue("");
                        }}
                        className="w-full flex items-center gap-3 py-2.5 px-1 hover:bg-secondary rounded-md text-left"
                      >
                        <img src={p.thumbnail} alt={p.name} className="h-12 w-12 object-cover rounded-md" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{p.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {p.category?.name ?? ""}
                          </p>
                        </div>
                        <span className="text-sm font-semibold">
                          {formatPrice(p.salePrice ?? p.price)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {searchValue.trim().length >= 2 && !isSearching && results.length === 0 && (
                <p className="text-sm text-muted-foreground mt-3 px-1">
                  No products found. Try a different search.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] sm:w-[320px]">
          <SheetHeader>
            <SheetTitle className="font-display text-xl">{siteConfig.name}</SheetTitle>
          </SheetHeader>
          <div className="mt-6 flex flex-col gap-1">
            <form onSubmit={submitSearch} className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search…"
                className="pl-10 h-11"
              />
            </form>
            <MobileLink to="/" onClick={() => setMobileOpen(false)}>Home</MobileLink>
            <MobileLink to="/shop" onClick={() => setMobileOpen(false)}>All Products</MobileLink>
            <div className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider mt-2">
              Categories
            </div>
            {categories?.map((c) => (
              <MobileLink
                key={c.id}
                to={`/category/${c.slug}`}
                onClick={() => setMobileOpen(false)}
                indent
              >
                {c.name}
              </MobileLink>
            ))}
            <div className="border-t border-border my-3" />
            <MobileLink to="/distributor" onClick={() => setMobileOpen(false)}>Become a Distributor</MobileLink>
            <MobileLink to="/five-year-plan" onClick={() => setMobileOpen(false)}>Five-Year Plan</MobileLink>
            <MobileLink to="/about" onClick={() => setMobileOpen(false)}>About KEDI</MobileLink>
            <MobileLink to="/contact" onClick={() => setMobileOpen(false)}>Contact</MobileLink>
            <MobileLink to="/faq" onClick={() => setMobileOpen(false)}>FAQ</MobileLink>
            <MobileLink to="/shipping" onClick={() => setMobileOpen(false)}>Shipping</MobileLink>
            <MobileLink to="/returns" onClick={() => setMobileOpen(false)}>Returns</MobileLink>
            <div className="border-t border-border my-3" />
            <MobileLink to="/wishlist" onClick={() => setMobileOpen(false)}>Wishlist ({wishlistCount})</MobileLink>
            <MobileLink to="/account" onClick={() => setMobileOpen(false)}>Account</MobileLink>
            <MobileLink to="/orders" onClick={() => setMobileOpen(false)}>Order History</MobileLink>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}

function MobileLink({
  to,
  children,
  onClick,
  indent,
}: {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
  indent?: boolean;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block px-3 py-2.5 rounded-md hover:bg-secondary transition-colors text-sm font-medium ${
        indent ? "pl-6" : ""
      }`}
    >
      {children}
    </Link>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
      {children}
    </span>
  );
}
