import { test } from "node:test";
import assert from "node:assert/strict";
import { quoteLeadSchema, contactLeadSchema } from "../app/lib/validations/lead.ts";

// Esto es lo único que se interpone entre un formulario público y un
// INSERT en Postgres — si la validación falla en falso positivo o falso
// negativo, o el honeypot no funciona, entra basura a la tabla Lead.

test("quoteLeadSchema: acepta una cotización válida", () => {
  const result = quoteLeadSchema.safeParse({
    name: "Camila Rojas",
    phone: "3011234567",
    city: "Medellín",
    spaceType: "Jardín / Terraza",
    squareMeters: 40,
    productSlug: "tapicesped",
    installationNeeded: true,
  });
  assert.equal(result.success, true);
});

test("quoteLeadSchema: rechaza metros cuadrados en 0 o negativos", () => {
  const result = quoteLeadSchema.safeParse({
    name: "Camila Rojas",
    phone: "3011234567",
    city: "Medellín",
    spaceType: "Jardín / Terraza",
    squareMeters: 0,
    productSlug: "tapicesped",
    installationNeeded: true,
  });
  assert.equal(result.success, false);
});

test("quoteLeadSchema: un honeypot lleno (bot) NO debe romper el parseo", () => {
  const result = quoteLeadSchema.safeParse({
    name: "Bot",
    phone: "0000000",
    city: "X",
    spaceType: "X",
    squareMeters: 10,
    productSlug: "tapicesped",
    installationNeeded: false,
    company: "relleno-de-bot",
  });
  // El schema solo valida forma de datos. La decisión de ignorar el envío
  // (silenciosamente, sin persistir) vive en createQuoteLead — si el schema
  // rechazara un "company" no vacío, un bot recibiría un error de vuelta en
  // vez de una falsa confirmación, delatando el honeypot.
  assert.equal(result.success, true);
  assert.equal(result.data?.company, "relleno-de-bot");
});

test("contactLeadSchema: rechaza un mensaje demasiado corto", () => {
  const result = contactLeadSchema.safeParse({
    name: "Andrés",
    phone: "3005551122",
    spaceType: "Terraza / Balcón",
    message: "Hola",
  });
  assert.equal(result.success, false);
});

test("contactLeadSchema: acepta un contacto válido", () => {
  const result = contactLeadSchema.safeParse({
    name: "Andrés",
    phone: "3005551122",
    spaceType: "Terraza / Balcón",
    message: "Quiero cotizar grama para una terraza de 30 metros en Bogotá.",
  });
  assert.equal(result.success, true);
});
