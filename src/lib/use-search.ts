"use client";

// Client-side search hook backed by the /api/products/search endpoint.
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim()), 250);
    return () => clearTimeout(id);
  }, [query]);

  const { data, isFetching } = useQuery({
    queryKey: ["search", debounced],
    queryFn: async () => {
      if (!debounced) return [] as Product[];
      const r = await fetch(`/api/products/search?q=${encodeURIComponent(debounced)}`);
      const j = await r.json();
      return (j.products ?? []) as Product[];
    },
    enabled: debounced.length >= 2,
  });

  return {
    search: setQuery,
    results: data ?? [],
    isSearching: isFetching,
  };
}
