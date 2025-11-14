import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // ojo: asegúrate que sea lib/, no libs/

export async function GET() {
  try {
    const [rows] = await db.query("SELECT Id AS value, Nombre AS label, UnidadRegionalId, LocalidadId FROM escuela WHERE Activo = 1");
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Error en /api/catalogos:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}