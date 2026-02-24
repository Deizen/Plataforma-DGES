import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const unidad = searchParams.get("unidad");
  const localidad = searchParams.get("localidad");
  const escuela = searchParams.get("escuela");
  const carrera = searchParams.get("carrera");
  const modalidad = searchParams.get("modalidad");
  const semestre = searchParams.get("semestre");

  const [rows] = await db.query<RowDataPacket[]>(
    `
    SELECT us.*, ua.Nombre AS UnidadNombre
    FROM unidad_semestre us
    JOIN unidades_aprendizaje ua ON ua.Id = us.UnidadAprendizajeId
    WHERE us.UnidadId=? AND us.LocalidadId=? AND us.EscuelaId=? 
      AND us.CarreraId=? AND us.ModalidadId=? AND us.Semestre=?
    `,
    [unidad, localidad, escuela, carrera, modalidad, semestre]
  );

  return NextResponse.json(rows);
}