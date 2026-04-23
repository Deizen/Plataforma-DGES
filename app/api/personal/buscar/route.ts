import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  let rows;

  if (q === "") {

    // Cuando el usuario abre el autocomplete sin escribir
    [rows] = await db.query(`
      SELECT
        Id AS value,
        CONCAT(Nombres,' ',Apellidos,' (',NumeroEmpleado,')') AS label
      FROM personalacademico
      LIMIT 10
    `);

  } else {

    // Cuando escribe para buscar
    [rows] = await db.query(
      `
      SELECT
        Id AS value,
        CONCAT(Nombres,' ',Apellidos,' (',NumeroEmpleado,')') AS label
      FROM personalacademico
      WHERE
        Nombres LIKE ?
        OR Apellidos LIKE ?
        OR NumeroEmpleado LIKE ?
      LIMIT 10
      `,
      [`%${q}%`, `%${q}%`, `%${q}%`]
    );

  }

  return NextResponse.json(rows);

}