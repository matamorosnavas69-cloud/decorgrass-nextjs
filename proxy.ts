import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { authSecret } from "@/app/lib/auth-config";

const COOKIE_NAME = "decorgrass-admin-session";

async function hasValidSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const secret = authSecret(); // sin AUTH_SECRET en producción lanza (500) en vez de aceptar el secreto público de dev
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = await hasValidSession(request);

  if (pathname.startsWith("/login")) {
    if (authenticated) return NextResponse.redirect(new URL("/dashboard", request.url));
    return NextResponse.next();
  }

  if (!authenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
