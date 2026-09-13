"use client";

// =====================================================================
// APP-WIDE PROVIDERS — React Query + Theme + Hash Router + Cart Sheet
// =====================================================================

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { RouterProvider } from "@/lib/router";
import { Navbar } from "@/components/ecommerce/navbar";
import { Footer } from "@/components/ecommerce/footer";
import { CartSheet } from "@/components/ecommerce/cart-sheet";

export function Providers({ children }: { children: React.ReactNode }) {
  const [qc] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryClientProvider client={qc}>
        <RouterProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CartSheet />
        </RouterProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
