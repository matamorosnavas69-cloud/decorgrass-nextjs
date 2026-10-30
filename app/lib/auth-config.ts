/**
 * Credenciales de admin: variables de entorno, con valores de desarrollo
 * solo fuera de producción. En producción, si falta alguna, lanza en lugar
 * de caer a una credencial pública. Se resuelven al usarse (no al importar)
 * para no romper `next build` cuando las variables aún no están cargadas.
 */

const DEV_SECRET = "dev-only-secret-replace-in-prod-32-chars";
const DEV_EMAIL = "admin@decorgrass.com";
const DEV_PASSWORD_HASH = "$2b$10$oXdsZD.6nQ7Gi7UZzQwGF./WzewtnkKMbI67unU7xEKTwfeR01zne"; // "decorgrass2026"

function fromEnv(name: string, devValue: string): string {
  const value = process.env[name];
  if (value) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error(`Falta la variable de entorno ${name} (obligatoria en producción)`);
  }
  return devValue;
}

export const authSecret = () => new TextEncoder().encode(fromEnv("AUTH_SECRET", DEV_SECRET));
export const adminEmail = () => fromEnv("ADMIN_EMAIL", DEV_EMAIL).toLowerCase();
export const adminPasswordHash = () => fromEnv("ADMIN_PASSWORD_HASH", DEV_PASSWORD_HASH);
