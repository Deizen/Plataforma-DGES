import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {

  try {

    const { carreraId, modalidadId, semestreId } = await req.json();

    const [materias]: any = await db.query(
      `
      SELECT
        m.Id,
        m.Nombre,
        m.Clave,
        m.Plan,

        t.TotalAlumnos,
        t.Masculino,
        t.Femenino,
        t.IndiceDesercion,
        t.IndiceBajas,
        t.IndiceReingreso,
        t.MateriasReprobadas,
        t.PromedioGeneral

      FROM materia m

      LEFT JOIN trayectorias t
      ON t.MateriaId = m.Id
      AND t.CarreraId = ?
      AND t.ModalidadId = ?
      AND t.SemestreId = ?

      WHERE m.CarreraId = ?
      AND m.ModalidadId = ?
      AND m.SemestreId = ?
      AND m.Activo = 1

      ORDER BY m.Clave
      `,
      [
        carreraId,
        modalidadId,
        semestreId,
        carreraId,
        modalidadId,
        semestreId
      ]
    );

    return NextResponse.json(materias);

  } catch (error) {

    return NextResponse.json(
      { error: "Error obteniendo trayectorias" },
      { status: 500 }
    );

  }

}