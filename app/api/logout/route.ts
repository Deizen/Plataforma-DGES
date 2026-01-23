import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  //Elimina la cookie desde el servidor (SOLO ASÍ FUNCIONA)
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(0), // fecha expirada
  });

  return response;
}