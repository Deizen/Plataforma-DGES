import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {

  try {

    const {
      materiaId,
      carreraId,
      modalidadId,
      semestreId,

      totalAlumnos,
      masculino,
      femenino,
      indiceDesercion,
      indiceBajas,
      indiceReingreso,
      materiasReprobadas,
      promedioGeneral

    } = await req.json();

    await db.query(

      `
      INSERT INTO trayectorias
      (
        MateriaId,
        CarreraId,
        ModalidadId,
        SemestreId,
        TotalAlumnos,
        Masculino,
        Femenino,
        IndiceDesercion,
        IndiceBajas,
        IndiceReingreso,
        MateriasReprobadas,
        PromedioGeneral
      )
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)

      ON DUPLICATE KEY UPDATE

      TotalAlumnos = VALUES(TotalAlumnos),
      Masculino = VALUES(Masculino),
      Femenino = VALUES(Femenino),
      IndiceDesercion = VALUES(IndiceDesercion),
      IndiceBajas = VALUES(IndiceBajas),
      IndiceReingreso = VALUES(IndiceReingreso),
      MateriasReprobadas = VALUES(MateriasReprobadas),
      PromedioGeneral = VALUES(PromedioGeneral),
      FechaModificacion = NOW()
      `,
      [
        materiaId,
        carreraId,
        modalidadId,
        semestreId,
        totalAlumnos,
        masculino,
        femenino,
        indiceDesercion,
        indiceBajas,
        indiceReingreso,
        materiasReprobadas,
        promedioGeneral
      ]
    );

    return NextResponse.json({ success: true });

  } catch (error) {

    return NextResponse.json(
      { error: "Error guardando trayectoria" },
      { status: 500 }
    );

  }

}