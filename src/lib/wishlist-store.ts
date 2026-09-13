"use client";

// =====================================================================
// WISHLIST + RECENTLY VIEWED STORE
// =====================================================================

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type WishlistState = {
  productIds: string[];
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
  clear: () => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      toggle: (productId) => {
        if (get().productIds.includes(productId)) {
          set({ productIds: get().productIds.filter((id) => id !== productId) });
        } else {
          set({ productIds: [...get().productIds, productId] });
        }
      },
      remove: (productId) =>
        set({ productIds: get().productIds.filter((id) => id !== productId) }),
      has: (productId) => get().productIds.includes(productId),
      clear: () => set({ productIds: [] }),
    }),
    {
      name: "mercato-wishlist",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

type RecentlyViewedState = {
  productIds: string[];
  add: (productId: string) => void;
  clear: () => void;
};

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      productIds: [],
      add: (productId) => {
        const filtered = get().productIds.filter((id) => id !== productId);
        set({ productIds: [productId, ...filtered].slice(0, 8) });
      },
      clear: () => set({ productIds: [] }),
    }),
    {
      name: "mercato-recently-viewed",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Customer auth state (lightweight — for guest vs. account session).
type CustomerState = {
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  signIn: (info: { email: string; firstName: string; lastName: string }) => void;
  signOut: () => void;
};

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      email: null,
      firstName: null,
      lastName: null,
      signIn: (info) => set({ ...info }),
      signOut: () => set({ email: null, firstName: null, lastName: null }),
    }),
    {
      name: "mercato-customer",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
