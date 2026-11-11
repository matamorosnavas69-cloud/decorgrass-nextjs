import { test } from "node:test";
import assert from "node:assert/strict";
import {
  PERMISSIONS,
  ROLES,
  ROLE_PERMISSIONS,
  hasPermission,
  parseRole,
  requiredPermissionForPath,
  type Permission,
} from "../app/lib/rbac.ts";

test("deny-by-default: sin rol no hay ningún permiso", () => {
  for (const permission of PERMISSIONS) {
    assert.equal(hasPermission(null, permission), false);
    assert.equal(hasPermission(undefined, permission), false);
  }
});

test("admin tiene todos los permisos", () => {
  for (const permission of PERMISSIONS) {
    assert.equal(hasPermission("admin", permission), true);
  }
});

test("solo admin gestiona usuarios", () => {
  for (const role of ROLES) {
    assert.equal(hasPermission(role, "users:manage"), role === "admin", `users:manage para ${role}`);
  }
});

test("viewer no puede escribir nada", () => {
  const writes = PERMISSIONS.filter((p) => p.endsWith(":write") || p.endsWith(":manage"));
  for (const permission of writes) {
    assert.equal(hasPermission("viewer", permission), false, permission);
  }
});

test("todo permiso de escritura implica el de lectura de esa misma sección", () => {
  for (const role of ROLES) {
    for (const permission of ROLE_PERMISSIONS[role]) {
      if (!permission.endsWith(":write")) continue;
      const read = permission.replace(":write", ":read") as Permission;
      assert.equal(hasPermission(role, read), true, `${role} tiene ${permission} sin ${read}`);
    }
  }
});

test("parseRole rechaza valores no confiables", () => {
  for (const bad of ["ADMIN", "root", "", " admin", "admin ", "__proto__", "constructor", 42, null, undefined, {}, ["admin"]]) {
    assert.equal(parseRole(bad), null, String(bad));
  }
  for (const role of ROLES) assert.equal(parseRole(role), role);
});

test("requiredPermissionForPath: mapea secciones y respeta el límite de segmento", () => {
  assert.equal(requiredPermissionForPath("/dashboard"), null);
  assert.equal(requiredPermissionForPath("/dashboard/leads"), "leads:read");
  assert.equal(requiredPermissionForPath("/dashboard/leads/abc123"), "leads:read");
  assert.equal(requiredPermissionForPath("/dashboard/usuarios"), "users:read");
  assert.equal(requiredPermissionForPath("/dashboard/pedidos/x"), "orders:read");
  // "/dashboard/leadsX" NO es la sección de leads: no debe heredar su permiso por prefijo de texto.
  assert.equal(requiredPermissionForPath("/dashboard/leadsX"), null);
});
