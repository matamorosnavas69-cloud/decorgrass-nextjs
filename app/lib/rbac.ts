/**
 * Modelo de control de acceso (RBAC) — fuente única de verdad.
 *
 * - El rol de cada persona vive en Clerk (`publicMetadata.role`), que solo se
 *   puede escribir desde el servidor. El token de sesión lo lleva en el claim
 *   `metadata.role` (ver types/globals.d.ts).
 * - Los permisos NO viajan en el token: se derivan aquí del rol. Cambiar qué
 *   puede hacer un rol es editar esta tabla, sin tocar Clerk ni migrar usuarios.
 * - Deny-by-default: sin rol válido no hay ningún permiso.
 * - Este archivo es puro (sin Clerk ni Next) para poder testearlo aislado.
 */

export const ROLES = ["admin", "manager", "sales", "viewer"] as const;
export type Role = (typeof ROLES)[number];

export const PERMISSIONS = [
  "products:read",
  "products:write",
  "projects:read",
  "projects:write",
  "leads:read",
  "leads:write",
  "orders:read",
  "users:read",
  "users:manage",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrador",
  manager: "Gerente",
  sales: "Comercial",
  viewer: "Solo lectura",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  admin: "Acceso total, incluida la gestión de usuarios y roles.",
  manager: "Gestiona catálogo, proyectos y cotizaciones. No administra usuarios.",
  sales: "Atiende cotizaciones y consulta catálogo, proyectos y pedidos.",
  viewer: "Consulta todo el panel sin poder modificar nada.",
};

const READ_ALL: readonly Permission[] = ["products:read", "projects:read", "leads:read", "orders:read"];

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  admin: PERMISSIONS,
  manager: [...READ_ALL, "products:write", "projects:write", "leads:write"],
  sales: [...READ_ALL, "leads:write"],
  viewer: READ_ALL,
};

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

/** Convierte cualquier valor no confiable (claim, metadata, formulario) en un Role válido o null. */
export function parseRole(value: unknown): Role | null {
  return isRole(value) ? value : null;
}

export function hasPermission(role: Role | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role].includes(permission);
}

/**
 * Permiso mínimo exigido por cada sección del panel. El proxy lo usa para
 * cortar temprano; cada página y acción vuelve a verificar por su cuenta
 * (defensa en profundidad: un fallo del matcher no abre el panel).
 * `/dashboard` a secas solo pide tener algún rol.
 */
const ROUTE_PERMISSIONS: ReadonlyArray<readonly [prefix: string, permission: Permission]> = [
  ["/dashboard/usuarios", "users:read"],
  ["/dashboard/leads", "leads:read"],
  ["/dashboard/pedidos", "orders:read"],
  ["/dashboard/productos", "products:read"],
  ["/dashboard/proyectos", "projects:read"],
];

export function requiredPermissionForPath(pathname: string): Permission | null {
  for (const [prefix, permission] of ROUTE_PERMISSIONS) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return permission;
  }
  return null;
}
