import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // ⬅ tu conexión ya configurada

export async function POST(req: Request) {
  try {

    const data = await req.json();

    const {
      nombre,
      ruta,
      unidad,
      localidad,
      escuela,
      carrera,
      modalidad,
      usuario
    } = data;

    // const { nombre, ruta, usuario } = await req.json();

    if (!nombre || !ruta || !unidad || !localidad || !escuela || !carrera || !modalidad || !usuario) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO archivo (Nombre, Ruta, UnidadId, LocalidadId, EscuelaId, CarreraId, ModalidadId, UsuarioId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;  


    const [result]: any = await db.execute(insertQuery, [
      nombre,
      ruta,
      unidad,
      localidad,
      escuela,
      carrera,
      modalidad,
      usuario
    ]);

    return NextResponse.json({ success: true, id: result.insertId });

    //return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}