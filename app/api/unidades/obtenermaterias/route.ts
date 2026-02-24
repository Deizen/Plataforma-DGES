import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { carreraId, modalidadId, semestreId } = await req.json();

    if (!carreraId || !modalidadId || !semestreId) {
      return NextResponse.json(
        { error: "Faltan filtros" },
        { status: 400 }
      );
    }

    const [materias]: any = await db.query(
      `
      SELECT 
        Id,
        Nombre
      FROM materia
      WHERE 
        CarreraId = ?
        AND ModalidadId = ?
        AND SemestreId = ?
        AND Activo = 1
      ORDER BY Nombre
      `,
      [carreraId, modalidadId, semestreId]
    );

    // 👇 Formato EXACTO que usa tu tabla
    const formateadas = materias.map((m: any) => ({
      id: m.Id,
      unidadAprendizaje: m.Nombre,
      tipo: "",
      responsables: [],
      status: 1, // inicia en "enviado"
    }));

    return NextResponse.json(formateadas);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error obteniendo materias" },
      { status: 500 }
    );
  }
}