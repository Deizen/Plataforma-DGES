import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {

  const [rows] = await db.query(`
    SELECT Id,Nombre,Clave
    FROM modulo
    WHERE Activo = 1
  `)

  return NextResponse.json(rows)
}