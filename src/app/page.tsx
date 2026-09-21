// =====================================================================
// APP ENTRY (/) — single externally-visible route
// ---------------------------------------------------------------------
// Renders the correct page based on the URL hash. All "pages" are
// components imported lazily so code-splitting still works.
// =====================================================================

import { Suspense } from "react";
import { AppShell } from "@/components/ecommerce/app-shell";
import { HomePage } from "@/components/pages/home";
import { ShopPage } from "@/components/pages/shop";
import { ProductPage } from "@/components/pages/product";
import { CategoryPage } from "@/components/pages/category";
import { SearchResultsPage } from "@/components/pages/search";
import { CartPage } from "@/components/pages/cart";
import { CheckoutPage } from "@/components/pages/checkout";
import { OrderConfirmationPage } from "@/components/pages/order-confirmation";
import { WishlistPage } from "@/components/pages/wishlist";
import { AccountPage } from "@/components/pages/account";
import { OrderHistoryPage } from "@/components/pages/order-history";
import { StaticPage } from "@/components/pages/static";
import { NotFoundPage } from "@/components/pages/not-found";
import { ContactPage } from "@/components/pages/contact";

export default function Page() {
  return (
    <AppShell
      routes={{
        "/": <HomePage />,
        "/shop": <ShopPage />,
        "/category": <CategoryPage />,
        "/product": <ProductPage />,
        "/search": <SearchResultsPage />,
        "/cart": <CartPage />,
        "/checkout": <CheckoutPage />,
        "/order": <OrderConfirmationPage />,
        "/wishlist": <WishlistPage />,
        "/account": <AccountPage />,
        "/orders": <OrderHistoryPage />,
        "/contact": <ContactPage />,
        "/about": <StaticPage slug="about" />,
        "/distributor": <StaticPage slug="distributor" />,
        "/five-year-plan": <StaticPage slug="five-year-plan" />,
        "/faq": <StaticPage slug="faq" />,
        "/shipping": <StaticPage slug="shipping" />,
        "/returns": <StaticPage slug="returns" />,
        "/privacy": <StaticPage slug="privacy" />,
        "/terms": <StaticPage slug="terms" />,
      }}
      fallback={<NotFoundPage />}
    />
  );
}
