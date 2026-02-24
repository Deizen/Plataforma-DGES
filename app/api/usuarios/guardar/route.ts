import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const connection = await db.getConnection();

  try {
    const {
      Nombre,
      Usuario,
      Password,
      RolId,
      Permisos = [],
    } = await req.json();

    console.log("Datos recibidos:", {
      Nombre,
      Usuario,
      Password: Password ? "****" : null, // No mostrar el password en los logs
      RolId,
      Permisos,
    }); 

    if (!Nombre || !Usuario || !Password || !RolId) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    await connection.beginTransaction();

    // 1. Crear usuario
    const [userResult]: any = await connection.query(
      `INSERT INTO usuario (Nombre, Usuario, Password, RolId)
       VALUES (?, ?, ?, ?)`,
      [Nombre, Usuario, Password, RolId]
    );

    const usuarioId = userResult.insertId;

    // 2. Insertar permisos
    for (const p of Permisos) {
      await connection.query(
        `INSERT INTO usuario_permiso
         (UsuarioId, UnidadId, LocalidadId, EscuelaId, CarreraId, TipoPermiso)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          usuarioId,
          p.UnidadId || 0,
          p.LocalidadId || 0,
          p.EscuelaId || 0,
          p.CarreraId || 0,
          p.TipoPermiso,
        ]
      );
    }

    await connection.commit();

    return NextResponse.json(
      { message: "Usuario creado correctamente", usuarioId },
      { status: 201 }
    );
  } catch (error: any) {
    await connection.rollback();
    return NextResponse.json(
      { error: "Error al crear usuario", detail: error.message },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}