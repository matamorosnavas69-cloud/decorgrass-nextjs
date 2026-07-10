"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GrassProduct } from "@/app/lib/data";

export interface QuoteState {
  spaceType: string;
  width: number;
  length: number;
  squareMeters: number;
  city: string;
  installationNeeded: boolean;
  selectedProduct: GrassProduct | null;
  name: string;
  phone: string;
  step: number;
  setSpaceType: (v: string) => void;
  setDimensions: (width: number, length: number) => void;
  setCity: (v: string) => void;
  setInstallation: (v: boolean) => void;
  setProduct: (p: GrassProduct | null) => void;
  setContact: (name: string, phone: string) => void;
  setStep: (s: number) => void;
  reset: () => void;
}

const initialState = {
  spaceType: "",
  width: 0,
  length: 0,
  squareMeters: 0,
  city: "",
  installationNeeded: true,
  selectedProduct: null,
  name: "",
  phone: "",
  step: 1,
};

export const useQuote = create<QuoteState>()(
  persist(
    (set) => ({
      ...initialState,
      setSpaceType: (spaceType) => set({ spaceType }),
      setDimensions: (width, length) =>
        set({ width, length, squareMeters: width * length }),
      setCity: (city) => set({ city }),
      setInstallation: (installationNeeded) => set({ installationNeeded }),
      setProduct: (selectedProduct) => set({ selectedProduct }),
      setContact: (name, phone) => set({ name, phone }),
      setStep: (step) => set({ step }),
      reset: () => set(initialState),
    }),
    { name: "decorgrass-quote" }
  )
);
