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

            console.log("Filtros incompletos:", {
          unidad,
          localidad,        
            escuela,
            carrera,
            modalidad,
        })

    if (!unidad || !localidad || !escuela || !carrera || !modalidad) {
      return NextResponse.json(
        { error: "Filtros incompletos" },
        { status: 400 }
      );
    }

    console.log("Consultando archivos con filtros:", {
      unidad,
      localidad,    
        escuela,
        carrera,
        modalidad,
    });

    const query = `
      SELECT Id, Nombre, Ruta 
      FROM archivos
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
    console.error("❌ Error consultando archivos:", error);
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}