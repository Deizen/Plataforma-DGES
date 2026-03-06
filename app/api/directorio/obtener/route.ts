import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const unidadAcademicaId = searchParams.get("unidadAcademicaId");

    const [rows]: any = await db.query(
      `
      SELECT 
        d.id,
        d.unidadAcademicaId,
        c.id AS cargoId,
        c.nombre AS cargoNombre,
        c.tipo,
        u.id AS usuarioId,
        u.nombre,
        u.correo
      FROM directorio_unidad d
      JOIN directorio_cargos c ON c.id = d.cargoId
      JOIN usuarios u ON u.id = d.usuarioId
      WHERE d.unidadAcademicaId = ?
      `,
      [unidadAcademicaId]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error obteniendo directorio" },
      { status: 500 }
    );
  }
}