import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      numeroEmpleado,
      nombres,
      apellidos,
      nombramiento,
      gradoAcademico,
      correo,
      telefono
    } = body;

    if (!numeroEmpleado || !nombres || !apellidos) {
      return NextResponse.json(
        { error: "Datos obligatorios faltantes" },
        { status: 400 }
      );
    }

    const connection = await db.getConnection();

    try {

      const [existe]: any = await connection.query(
        `
        SELECT Id
        FROM personalacademico
        WHERE NumeroEmpleado = ?
        `,
        [numeroEmpleado]
      );

      if (existe.length > 0) {
        return NextResponse.json(
          { error: "El número de empleado ya existe" },
          { status: 400 }
        );
      }

      await connection.query(
        `
        INSERT INTO personalacademico
        (
          NumeroEmpleado,
          Nombres,
          Apellidos,
          Nombramiento,
          GradoAcademico,
          Correo,
          Telefono
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          numeroEmpleado,
          nombres,
          apellidos,
          nombramiento,
          gradoAcademico,
          correo,
          telefono
        ]
      );

      return NextResponse.json({
        success: true,
        message: "Personal académico registrado correctamente"
      });

    } finally {
      connection.release();
    }

  } catch (error: any) {

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}