import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  let rows;

  if (q === "") {
    // 👇 cuando no se escribe nada
    [rows] = await db.query(`
      SELECT 
        Id as value,
        CONCAT(Nombre,' (',Usuario,')') as label
      FROM usuario
      WHERE Activo = 1
      LIMIT 10
    `);
  } else {
    // 👇 cuando se busca
    [rows] = await db.query(
      `
      SELECT 
        Id as value,
        CONCAT(Nombre,' (',Usuario,')') as label
      FROM usuario
      WHERE Activo = 1
      AND (Nombre LIKE ? OR Usuario LIKE ?)
      LIMIT 10
    `,
      [`%${q}%`, `%${q}%`]
    );
  }

  return NextResponse.json(rows);
}