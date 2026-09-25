import type { Role } from "@/app/lib/rbac";

export {};

declare global {
  // Claim `metadata` del token de sesión de Clerk: se configura con
  // `{"metadata": "{{user.public_metadata}}"}` en Sessions → Customize session token.
  interface CustomJwtSessionClaims {
    metadata?: {
      role?: Role;
    };
  }
}
