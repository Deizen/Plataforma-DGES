import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const unidad = searchParams.get("unidad");
    const localidad = searchParams.get("localidad");
    const escuela = searchParams.get("escuela");
    const carrera = searchParams.get("carrera");
    const modalidad = searchParams.get("modalidad");

    const selectQuery = `
      SELECT *
      FROM observacion
      WHERE Activo = 1
      AND UnidadId = ?
      AND LocalidadId = ?
      AND EscuelaId = ?
      AND CarreraId = ?
      AND ModalidadId = ?
      ORDER BY FechaCreacion DESC
    `;

    const [rows]: any = await db.execute(selectQuery, [
      unidad,
      localidad,
      escuela,
      carrera,
      modalidad,
    ]);

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}