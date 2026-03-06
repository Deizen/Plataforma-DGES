import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { unidadAcademicaId, cargoId, usuarioId } = body;

    if (!unidadAcademicaId || !cargoId || !usuarioId) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    await db.query(
      `
      INSERT INTO directorio_unidad
      (unidadAcademicaId, cargoId, usuarioId)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
      usuarioId = VALUES(usuarioId)
      `,
      [unidadAcademicaId, cargoId, usuarioId]
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error asignando cargo" },
      { status: 500 }
    );
  }
}

