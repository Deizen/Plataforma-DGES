import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rutas permitidas sin login
  const rutasPublicas = ["/login"];

  // Si la ruta es pública -> permitir
  if (rutasPublicas.some((ruta) => pathname.startsWith(ruta))) {
    return NextResponse.next();
  }

  // Revisar si existe token de sesión
  const token = req.cookies.get("token")?.value;

  // Si NO hay token -> redirigir al login
  if (!token) {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }

  // Si hay token -> permitir acceso
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!login|_next|favicon.ico|api).*)",
  ],
};