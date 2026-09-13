"use client";

// =====================================================================
// HASH-BASED SPA ROUTER
// ---------------------------------------------------------------------
// Routes everything through the `/` page using URL hash so the whole
// e-commerce experience lives on a single externally-visible route
// while remaining fully deep-linkable & bookmarkable.
//
// Supported patterns:
//   #/                       Home
//   #/shop                   Shop (all products)
//   #/shop?cat=fashion       Shop filtered by category
//   #/category/:slug         Category landing page
//   #/product/:slug          Product detail
//   #/search?q=...           Search results
//   #/cart                   Shopping cart
//   #/checkout               Checkout
//   #/order/:orderNumber     Order confirmation
//   #/wishlist               Wishlist
//   #/account                Account / profile
//   #/orders                 Order history (lookup by email)
//   #/about, #/contact, #/faq, #/shipping, #/returns, #/privacy, #/terms
//   anything else → 404
// =====================================================================

import { useEffect, useState, useCallback, createContext, useContext } from "react";

export type Route = {
  path: string;          // e.g. "/product/aria-headphones"
  query: URLSearchParams; // parsed query string
  segments: string[];   // ["product", "aria-headphones"]
};

function parseHash(): Route {
  if (typeof window === "undefined") {
    return { path: "/", query: new URLSearchParams(), segments: [""] };
  }
  const hash = window.location.hash.replace(/^#/, "");
  const [path, queryString] = hash.split("?");
  const cleanPath = path || "/";
  const segments = cleanPath.split("/").filter(Boolean);
  return {
    path: cleanPath,
    query: new URLSearchParams(queryString || ""),
    segments,
  };
}

type RouterCtx = {
  route: Route;
  navigate: (path: string) => void;
  back: () => void;
};

const Ctx = createContext<RouterCtx | null>(null);

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>(() => parseHash());

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHash());
      // Scroll to top on route change for better UX
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    };
    window.addEventListener("hashchange", onHashChange);
    // Initialise hash if empty
    if (!window.location.hash) {
      window.history.replaceState(null, "", "#/");
    }
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = useCallback((path: string) => {
    const clean = path.startsWith("#") ? path.slice(1) : path;
    if (window.location.hash === clean) {
      // Same hash — force scroll reset
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      setRoute(parseHash());
    } else {
      window.location.hash = clean;
    }
  }, []);

  const back = useCallback(() => window.history.back(), []);

  return (
    <Ctx.Provider value={{ route, navigate, back }}>{children}</Ctx.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useRouter must be used inside RouterProvider");
  return ctx;
}

// Convenience hook for components that only need navigate()
export function useNavigate() {
  return useRouter().navigate;
}

// Link component (anchor that uses hash navigation)
export function Link({
  to,
  className,
  children,
  onClick,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  const navigate = useNavigate();
  const href = `#${to}`;
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        // Allow modifier-click for new tab
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(to);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
