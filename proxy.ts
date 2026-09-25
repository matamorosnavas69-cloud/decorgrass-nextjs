import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { hasPermission, parseRole, requiredPermissionForPath } from "@/app/lib/rbac";

const isDashboard = createRouteMatcher(["/dashboard(.*)"]);

// Primera barrera: corta temprano por sesión y por rol. No es la única — cada
// página y Server Action vuelve a verificar con requirePermission().
export default clerkMiddleware(async (auth, req) => {
  if (!isDashboard(req)) return;

  const { userId, sessionClaims, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn({ returnBackUrl: req.url });

  const role = parseRole(sessionClaims?.metadata?.role);
  const required = requiredPermissionForPath(req.nextUrl.pathname);
  const allowed = role !== null && (required === null || hasPermission(role, required));

  if (!allowed) return NextResponse.redirect(new URL("/acceso-denegado", req.url));
});

// Solo las rutas que usan sesión: la tienda pública queda fuera y sigue estática.
export const config = {
  matcher: ["/dashboard/:path*", "/sign-in(.*)", "/sign-up(.*)", "/acceso-denegado", "/__clerk/:path*"],
};
