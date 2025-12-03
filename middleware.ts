import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  const isPublic = path === "/";

  // Si no está autenticado y quiere entrar a una ruta privada → login
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Si está autenticado y visita / → dashboard
  if (token && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|public).*)",
  ],
};