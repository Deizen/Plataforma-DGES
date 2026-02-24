import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const data = await req.json();

    const {
      unidadId,
      semestre,
      tipoProceso,
      responsables,
      comentarios,
      observaciones,
      planArchivo,
    } = data;

    // Verificamos si ya existe registro
    const [existe] = await db.query(
      `SELECT Id FROM UnidadesSemestreProceso 
       WHERE UnidadAprendizajeId = ? AND Semestre = ?`,
      [unidadId, semestre]
    );

    if (existe.length > 0) {
      await db.query(
        `UPDATE UnidadesSemestreProceso SET
          TipoProceso = ?,
          Responsables = ?,
          Comentarios = ?,
          Observaciones = ?,
          PlanEstudioArchivo = ?,
          FechaModificacion = NOW()
         WHERE UnidadAprendizajeId = ? AND Semestre = ?`,
        [
          tipoProceso,
          JSON.stringify(responsables),
          comentarios,
          observaciones,
          planArchivo,
          unidadId,
          semestre,
        ]
      );
    } else {
      await db.query(
        `INSERT INTO UnidadesSemestreProceso
        (UnidadAprendizajeId, Semestre, TipoProceso, Responsables, Comentarios, Observaciones, PlanEstudioArchivo)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          unidadId,
          semestre,
          tipoProceso,
          JSON.stringify(responsables),
          comentarios,
          observaciones,
          planArchivo,
        ]
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}