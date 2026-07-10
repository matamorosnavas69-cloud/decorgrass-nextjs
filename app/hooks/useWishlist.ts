"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GrassProduct } from "@/app/lib/data";

interface WishlistState {
  items: GrassProduct[];
  add: (product: GrassProduct) => void;
  remove: (productId: string) => void;
  toggle: (product: GrassProduct) => void;
  has: (productId: string) => boolean;
  clear: () => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product) =>
        set((s) =>
          s.items.find((i) => i.id === product.id)
            ? s
            : { items: [...s.items, product] }
        ),
      remove: (productId) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== productId) })),
      toggle: (product) => {
        const has = get().items.some((i) => i.id === product.id);
        has ? get().remove(product.id) : get().add(product);
      },
      has: (productId) => get().items.some((i) => i.id === productId),
      clear: () => set({ items: [] }),
    }),
    { name: "decorgrass-wishlist" }
  )
);
