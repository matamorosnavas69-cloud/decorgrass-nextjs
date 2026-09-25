import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";

// Solo envuelve las rutas que necesitan sesión (/dashboard, /sign-in, /sign-up,
// /acceso-denegado). La tienda pública NO carga Clerk: sigue siendo estática y liviana.
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider localization={esES} afterSignOutUrl="/sign-in">
      {children}
    </ClerkProvider>
  );
}
