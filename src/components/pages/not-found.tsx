"use client";

import { useRouter, Link } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";
import { useSeo } from "@/lib/use-seo";

export function NotFoundPage() {
  useSeo({
    title: "Page Not Found (404)",
    description: "The page you're looking for doesn't exist.",
    canonicalPath: "",
    noIndex: true,
  });
  const navigate = useRouter().navigate;
  return (
    <div className="container mx-auto max-w-md px-4 py-16 md:py-24 text-center animate-fade-up">
      <p className="font-display text-7xl md:text-8xl font-bold text-accent mb-2">404</p>
      <h1 className="font-display text-2xl font-bold mb-2">Page not found</h1>
      <p className="text-muted-foreground mb-6">
        We couldn't find what you're looking for. The page may have moved, been removed, or never existed.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Button onClick={() => navigate("/")}>
          <Home className="h-4 w-4 mr-2" /> Back to Home
        </Button>
        <Button variant="outline" onClick={() => navigate("/shop")}>
          <Search className="h-4 w-4 mr-2" /> Browse Products
        </Button>
      </div>
    </div>
  );
}
