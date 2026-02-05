import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const {
      contenido,
      unidad,
      localidad,
      escuela,
      carrera,
      modalidad,
      usuario,
    } = await req.json();

    const query = `
      INSERT INTO comentario
      (Contenido, UnidadId, LocalidadId, EscuelaId, CarreraId, ModalidadId, UsuarioId)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        Contenido = VALUES(Contenido),
        UsuarioId = VALUES(UsuarioId),
        FechaModificacion = NOW()
    `;

    await db.execute(query, [
      contenido,
      unidad,
      localidad,
      escuela,
      carrera,
      modalidad,
      usuario,
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}