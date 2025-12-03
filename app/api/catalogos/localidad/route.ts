import { NextResponse } from "next/server";
import { db } from "@/lib/db"; 

export async function GET() {
  try {
    const [rows] = await db.query("SELECT Id AS value, Nombre AS label,UnidadRegionalId FROM localidad WHERE Activo = 1");
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}