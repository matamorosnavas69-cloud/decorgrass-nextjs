import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { login } from "../app/lib/auth.ts";
import { prisma } from "../app/lib/db.ts";
import { LOGIN_ATTEMPT_MAX } from "../app/lib/rate-limit.ts";

// login() es la única puerta de /dashboard (protegida además por proxy.ts),
// y ahora también escribe intentos fallidos en Postgres para el rate limit
// — estos tests sí tocan la base real. Se limpian los identificadores que
// usan antes y después para que correr la suite varias veces seguidas no
// dispare el rate limit y rompa las aserciones de "Credenciales inválidas".
const TEST_IDENTIFIERS = [
  "no-soy-el-admin@ejemplo.com",
  "admin@otro-dominio.com",
  "admin@decorgrass.com",
  "rate-limit-test@decorgrass.com",
];

async function cleanup() {
  await prisma.loginAttempt.deleteMany({ where: { identifier: { in: TEST_IDENTIFIERS } } });
}

before(cleanup);
after(async () => {
  await cleanup();
  await prisma.$disconnect();
});

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

test("login: bloquea tras superar el máximo de intentos fallidos", async () => {
  const identifier = "rate-limit-test@decorgrass.com";

  for (let i = 0; i < LOGIN_ATTEMPT_MAX; i++) {
    const result = await login(identifier, "password-incorrecto");
    assert.equal(result.error, "Credenciales inválidas", `intento ${i + 1} debería rechazarse por credenciales, no por rate limit`);
  }

  const blocked = await login(identifier, "password-incorrecto");
  assert.equal(blocked.ok, false);
  assert.match(blocked.error ?? "", /Demasiados intentos/);
});
