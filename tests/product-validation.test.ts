import { test } from "node:test";
import assert from "node:assert/strict";
import { productFormSchema } from "../app/lib/validations/product.ts";

const validProduct = {
  name: "Grama Test",
  slug: "grama-test",
  category: "decorativa",
  description: "Descripción de prueba con más de diez caracteres.",
  shortDescription: "Corta",
  pricePerM2: 50000,
  fiberHeight: "20 mm",
  density: "Alta",
  toneColor: "Verde",
  guarantee: "3 años",
  petFriendly: false,
  childFriendly: false,
  sportSuitable: false,
  available: true,
  featured: false,
};

test("productFormSchema: acepta un producto válido", () => {
  const result = productFormSchema.safeParse(validProduct);
  assert.equal(result.success, true);
});

test("productFormSchema: rechaza un slug con mayúsculas o espacios (rompería la URL /producto/[slug])", () => {
  const result = productFormSchema.safeParse({ ...validProduct, slug: "Grama Test" });
  assert.equal(result.success, false);
});

test("productFormSchema: rechaza un precio negativo", () => {
  const result = productFormSchema.safeParse({ ...validProduct, pricePerM2: -1000 });
  assert.equal(result.success, false);
});
