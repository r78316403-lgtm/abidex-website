"use client";

// =====================================================================
// CART STORE — Zustand with localStorage persistence
// =====================================================================

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, Product } from "./types";

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  // actions
  addItem: (product: Product, opts?: { quantity?: number; size?: string; color?: string }) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, size: string | undefined, color: string | undefined, quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  // selectors (computed in component to avoid stale closures)
};

function lineKey(productId: string, size?: string, color?: string) {
  return `${productId}::${size ?? ""}::${color ?? ""}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product, opts = {}) => {
        const quantity = Math.max(1, opts.quantity ?? 1);
        const size = opts.size;
        const color = opts.color;
        const effectivePrice = product.salePrice ?? product.price;
        const items = [...get().items];
        const key = lineKey(product.id, size, color);
        const idx = items.findIndex((it) => lineKey(it.productId, it.size, it.color) === key);
        if (idx >= 0) {
          items[idx] = { ...items[idx], quantity: items[idx].quantity + quantity };
        } else {
          items.push({
            productId: product.id,
            slug: product.slug,
            name: product.name,
            image: product.thumbnail,
            price: effectivePrice,
            regularPrice: product.price,
            quantity,
            size,
            color,
            sku: product.sku,
            stock: product.stock,
          });
        }
        set({ items, isOpen: true });
      },
      removeItem: (productId, size, color) => {
        set({
          items: get().items.filter(
            (it) => lineKey(it.productId, it.size, it.color) !== lineKey(productId, size, color)
          ),
        });
      },
      updateQuantity: (productId, size, color, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((it) =>
            lineKey(it.productId, it.size, it.color) === lineKey(productId, size, color)
              ? { ...it, quantity: Math.min(quantity, it.stock) }
              : it
          ),
        });
      },
      clear: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "mercato-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Selector helpers (exported as plain functions so consumers use `useCartStore(s => s.items)`)
export const selectCartCount = (s: CartState) =>
  s.items.reduce((acc, it) => acc + it.quantity, 0);
export const selectCartSubtotal = (s: CartState) =>
  s.items.reduce((acc, it) => acc + it.price * it.quantity, 0);
