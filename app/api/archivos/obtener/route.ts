import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const {
      unidad,
      localidad,
      escuela,
      carrera,
      modalidad,
    } = await req.json();


    if (!unidad || !localidad || !escuela || !carrera || !modalidad) {
      return NextResponse.json(
        { error: "Filtros incompletos" },
        { status: 400 }
      );
    }

    const query = `
      SELECT Id, Nombre, Ruta 
      FROM archivo
      WHERE UnidadId = ?
        AND LocalidadId = ?
        AND EscuelaId = ?
        AND CarreraId = ?
        AND ModalidadId = ?
        AND Activo = 1
      ORDER BY FechaCreacion DESC
    `;

    const [rows]: any = await db.query(query, [
      unidad,
      localidad,
      escuela,
      carrera,
      modalidad,
    ]);

    return NextResponse.json({ archivos: rows });
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}