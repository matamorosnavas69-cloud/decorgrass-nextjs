import { test } from "node:test";
import assert from "node:assert/strict";
import { login } from "../app/lib/auth.ts";

// login() es la única puerta de /dashboard (protegida además por proxy.ts).
// Solo se prueban las rutas de rechazo: la ruta de éxito llama a
// next/headers → cookies(), que exige un contexto de request real y no
// existe fuera de Next — probarla aquí requeriría mockear el runtime
// completo, que es más código de test que la lógica que protege.

test("login: rechaza un email que no es el admin configurado", async () => {
  const result = await login("no-soy-el-admin@ejemplo.com", "cualquier-cosa");
  assert.equal(result.ok, false);
  assert.equal(result.error, "Credenciales inválidas");
});

test("login: rechaza la contraseña correcta con mayúsculas/espacios distintos en el email (normaliza pero no acepta otro email)", async () => {
  const result = await login("ADMIN@OTRO-DOMINIO.COM", "decorgrass2026");
  assert.equal(result.ok, false);
});

test("login: rechaza la contraseña de desarrollo incorrecta para el admin por defecto", async () => {
  const result = await login("admin@decorgrass.com", "password-incorrecto");
  assert.equal(result.ok, false);
  assert.equal(result.error, "Credenciales inválidas");
});
