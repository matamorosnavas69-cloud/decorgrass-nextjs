import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateQuote } from "../app/lib/utils.ts";

// El total de una cotización se recalcula siempre en el servidor
// (app/lib/actions/leads.ts) a partir de esta función — si el cálculo
// se rompe, cada cotización enviada muestra un precio incorrecto.

test("calculateQuote: material + instalación suman el total", () => {
  const result = calculateQuote(40, 42000, true);
  assert.equal(result.materialTotal, 40 * 42000);
  assert.equal(result.installationTotal, 40 * 15000);
  assert.equal(result.grandTotal, result.materialTotal + result.installationTotal);
});

test("calculateQuote: sin instalación, el total es solo el material", () => {
  const result = calculateQuote(40, 42000, false);
  assert.equal(result.installationTotal, 0);
  assert.equal(result.grandTotal, result.materialTotal);
});

test("calculateQuote: 0 m² da un total de 0, no NaN ni negativo", () => {
  const result = calculateQuote(0, 42000, true);
  assert.equal(result.grandTotal, 0);
});
