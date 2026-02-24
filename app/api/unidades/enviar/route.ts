import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const { unidadId, semestre } = await req.json();

    await db.query(
      `UPDATE UnidadSemestreProceso SET
        Status = 1,
        FechaModificacion = NOW()
       WHERE MateriaId = ? AND Semestre = ?`,
      [unidadId, semestre]
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al enviar" }, { status: 500 });
  }
}