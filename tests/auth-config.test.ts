import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { adminEmail, adminPasswordHash, authSecret } from "../app/lib/auth-config.ts";

const env = process.env as Record<string, string | undefined>;
const VARS = ["NODE_ENV", "AUTH_SECRET", "ADMIN_EMAIL", "ADMIN_PASSWORD_HASH"];
const saved = Object.fromEntries(VARS.map((k) => [k, env[k]]));

afterEach(() => {
  for (const k of VARS) {
    if (saved[k] === undefined) delete env[k];
    else env[k] = saved[k];
  }
});

test("auth-config: en producción sin variables lanza en vez de usar la credencial de desarrollo", () => {
  env.NODE_ENV = "production";
  for (const k of VARS.slice(1)) delete env[k];

  assert.throws(() => authSecret(), /AUTH_SECRET/);
  assert.throws(() => adminEmail(), /ADMIN_EMAIL/);
  assert.throws(() => adminPasswordHash(), /ADMIN_PASSWORD_HASH/);
});

test("auth-config: en producción con variables usa las reales", () => {
  env.NODE_ENV = "production";
  env.AUTH_SECRET = "x".repeat(32);
  env.ADMIN_EMAIL = "Real@Negocio.com";
  env.ADMIN_PASSWORD_HASH = "hash-real";

  assert.equal(adminEmail(), "real@negocio.com");
  assert.equal(adminPasswordHash(), "hash-real");
});

test("auth-config: fuera de producción cae a los valores de desarrollo", () => {
  env.NODE_ENV = "development";
  for (const k of VARS.slice(1)) delete env[k];

  assert.equal(adminEmail(), "admin@decorgrass.com");
});
