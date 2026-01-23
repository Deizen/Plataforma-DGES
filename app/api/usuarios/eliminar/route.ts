import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { UsuarioId } = await req.json();

    if (!UsuarioId) {
      return NextResponse.json(
        { error: "UsuarioId es obligatorio" },
        { status: 400 }
      );
    }

    await db.query(
      `UPDATE usuario SET Activo = 0 WHERE Id = ?`,
      [UsuarioId]
    );

    return NextResponse.json(
      { message: "Usuario eliminado correctamente" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al eliminar usuario", detail: error.message },
      { status: 500 }
    );
  }
}