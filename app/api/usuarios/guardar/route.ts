import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  let connection: any;

  try {
    const data = await req.json();

    const {
      Nombre,
      Usuario,
      Password,
      RolId,
      UnidadId = 0,
      LocalidadId = 0,
      EscuelaId = 0,
      CarreraId = 0,
      TipoPermiso,
    } = data;

    if (!Nombre || !Usuario || !Password || !RolId) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios de usuario" },
        { status: 400 }
      );
    }

    // -------------------------------------------
    // 1. Obtener conexión real del pool
    // -------------------------------------------
    connection = await db.getConnection();
    await connection.beginTransaction();

    // -------------------------------------------
    // 2. Buscar usuario existente
    // -------------------------------------------
    const [existingUserRaw] = await connection.query(
      `SELECT Id FROM usuario WHERE Usuario = ? LIMIT 1`,
      [Usuario]
    );

    const existingUser = existingUserRaw as { Id: number }[];

    let usuarioId: number;

    if (existingUser.length > 0) {
      usuarioId = existingUser[0].Id;
    } else {
      const [insertUserRaw] = await connection.query(
        `INSERT INTO usuario (Nombre, Usuario, Password, RolId)
         VALUES (?, ?, ?, ?)`,
        [Nombre, Usuario, Password, RolId]
      );

      const insertUser = insertUserRaw as { insertId: number };
      usuarioId = insertUser.insertId;
    }

    // -------------------------------------------
    // 3. Verificar si ya tiene ese permiso
    // -------------------------------------------
    const [permExistsRaw] = await connection.query(
      `SELECT Id FROM usuario_permiso
       WHERE UsuarioId = ?
         AND UnidadId = ?
         AND LocalidadId = ?
         AND EscuelaId = ?
         AND CarreraId = ?`,
      [usuarioId, UnidadId, LocalidadId, EscuelaId, CarreraId]
    );

    const permExists = permExistsRaw as { Id: number }[];

    if (permExists.length > 0) {
      await connection.rollback();
      return NextResponse.json(
        { error: "Este usuario ya tiene asignado este permiso." },
        { status: 400 }
      );
    }

    // -------------------------------------------
    // 4. Insertar permiso nuevo
    // -------------------------------------------
    await connection.query(
      `INSERT INTO usuario_permiso
       (UsuarioId, UnidadId, LocalidadId, EscuelaId, CarreraId, TipoPermiso)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        usuarioId,
        UnidadId,
        LocalidadId,
        EscuelaId,
        CarreraId,
        TipoPermiso,
      ]
    );

    await connection.commit();
    connection.release();

    return NextResponse.json(
      {
        message:
          existingUser.length > 0
            ? "Permiso agregado a usuario existente."
            : "Usuario y permiso registrados correctamente.",
        usuarioId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (connection) await connection.rollback();

    return NextResponse.json(
      {
        error: "Error en la creación del usuario",
        detail: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}