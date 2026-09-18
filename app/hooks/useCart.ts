"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GrassProduct } from "@/app/lib/data";
import { calculateQuote } from "@/app/lib/utils";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image?: string;
  pricePerM2: number;
  squareMeters: number;
  installationNeeded: boolean;
}

interface CartState {
  items: CartItem[];
  addItem: (product: GrassProduct, squareMeters: number, installationNeeded: boolean) => void;
  removeItem: (productId: string) => void;
  updateItem: (productId: string, patch: Partial<Pick<CartItem, "squareMeters" | "installationNeeded">>) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, squareMeters, installationNeeded) =>
        set((s) => {
          const existing = s.items.find((i) => i.productId === product.id);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.productId === product.id ? { ...i, squareMeters: i.squareMeters + squareMeters } : i
              ),
            };
          }
          return {
            items: [
              ...s.items,
              {
                productId: product.id,
                slug: product.slug,
                name: product.name,
                image: product.images[0],
                pricePerM2: product.pricePerM2,
                squareMeters,
                installationNeeded,
              },
            ],
          };
        }),
      removeItem: (productId) => set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
      updateItem: (productId, patch) =>
        set((s) => ({
          items: s.items.map((i) => (i.productId === productId ? { ...i, ...patch } : i)),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "decorgrass-cart" }
  )
);

export function cartItemSubtotal(item: CartItem): number {
  return calculateQuote(item.squareMeters, item.pricePerM2, item.installationNeeded).grandTotal;
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + cartItemSubtotal(item), 0);
}
