import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await db.query(`
      SELECT 
        Id,
        Nombre
      FROM responsable
      WHERE Activo = 1
      ORDER BY Nombre
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error obteniendo responsables:", error);
    return NextResponse.json(
      { error: "Error obteniendo responsables" },
      { status: 500 }
    );
  }
}