import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const unidadAcademicaId = searchParams.get("unidadAcademicaId");

    if (!unidadAcademicaId) {
      return NextResponse.json([], { status: 400 });
    }

    const [rows]: any = await db.query(
      `
      SELECT 
        c.id,
        c.nombre,
        c.tipo,
        du.usuarioId,
        u.Nombre AS usuarioNombre,
        u.Usuario AS numeroUsuario
      FROM directorio_cargos c
      LEFT JOIN directorio_unidad du 
        ON du.cargoId = c.id
        AND du.unidadAcademicaId = ?
      LEFT JOIN usuario u
        ON u.Id = du.usuarioId
      WHERE c.activo = 1
      ORDER BY c.tipo, c.nombre
      `,
      [unidadAcademicaId]
    );

    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}