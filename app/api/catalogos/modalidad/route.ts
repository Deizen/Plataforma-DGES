import { NextResponse } from "next/server";
import { db } from "@/lib/db"; 

export async function GET() {
  try {
    const [rows] = await db.query("SELECT Id AS value, Nombre AS label FROM modalidad WHERE Activo = 1");
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Error en /api/catalogos:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}