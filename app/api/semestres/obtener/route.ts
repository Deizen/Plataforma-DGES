import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { carreraId, modalidadId } = await req.json();

    if (!carreraId || !modalidadId) {
      return NextResponse.json(
        { error: "Faltan parámetros" },
        { status: 400 }
      );
    }

    const [rows]: any = await db.query(
      `
      SELECT DISTINCT SemestreId
      FROM materia
      WHERE CarreraId = ?
        AND ModalidadId = ?
        AND Activo = 1
      ORDER BY SemestreId ASC
      `,
      [carreraId, modalidadId]
    );

    const semestres = rows.map((row: any) => ({
      label: `Semestre ${row.SemestreId}`,
      value: row.SemestreId,
    }));

    return NextResponse.json(semestres);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error obteniendo semestres" },
      { status: 500 }
    );
  }
}