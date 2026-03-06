import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM directorio_cargos WHERE activo = 1 ORDER BY tipo, nombre"
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error obteniendo cargos" },
      { status: 500 }
    );
  }
}