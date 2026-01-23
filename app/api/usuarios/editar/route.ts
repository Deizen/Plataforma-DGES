import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const connection = await db.getConnection();

  try {
    const {
      Id,
      Nombre,
      Usuario,
      Password,
      RolId,
      Permisos = [],
    } = await req.json();

    if (!Id || !Nombre || !Usuario || !RolId) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    await connection.beginTransaction();

    // 1. Actualizar usuario
    if (Password) {
      await connection.query(
        `UPDATE usuario
         SET Nombre = ?, Usuario = ?, Password = ?, RolId = ?
         WHERE Id = ?`,
        [Nombre, Usuario, Password, RolId, Id]
      );
    } else {
      await connection.query(
        `UPDATE usuario
         SET Nombre = ?, Usuario = ?, RolId = ?
         WHERE Id = ?`,
        [Nombre, Usuario, RolId, Id]
      );
    }

    // 2. Eliminar permisos existentes
    await connection.query(
      `DELETE FROM usuario_permiso WHERE UsuarioId = ?`,
      [Id]
    );

    // 3. Insertar permisos nuevos
    for (const p of Permisos) {
      await connection.query(
        `INSERT INTO usuario_permiso
         (UsuarioId, UnidadId, LocalidadId, EscuelaId, CarreraId, TipoPermiso)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          Id,
          p.UnidadId || 0,
          p.LocalidadId || 0,
          p.EscuelaId || 0,
          p.CarreraId || 0,
          p.TipoPermiso,
        ]
      );
    }

    await connection.commit();

    return NextResponse.json({
      message: "Usuario actualizado correctamente",
    });
  } catch (error: any) {
    await connection.rollback();
    return NextResponse.json(
      { error: "Error al editar usuario", detail: error.message },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}