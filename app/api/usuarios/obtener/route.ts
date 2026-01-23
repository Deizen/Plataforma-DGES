import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const connection = await db.getConnection();

    const [rows]: any = await connection.query(`
      SELECT 
        u.Id AS UsuarioId,
        u.Nombre,
        u.Usuario,
        u.RolId,
        r.Nombre AS RolNombre,

        p.Id AS PermisoId,
        p.UnidadId,
        p.LocalidadId,
        p.EscuelaId,
        p.CarreraId,
        p.TipoPermiso
      FROM usuario u
      LEFT JOIN usuario_permiso p ON u.Id = p.UsuarioId
      LEFT JOIN rol r ON u.RolId = r.Id
      WHERE u.Activo = 1
      ORDER BY u.Id DESC
    `);

    connection.release();

    // AGRUPAR USUARIOS
    const usuariosMap = new Map();

    rows.forEach((row: any) => {
      if (!usuariosMap.has(row.UsuarioId)) {
        usuariosMap.set(row.UsuarioId, {
          UsuarioId: row.UsuarioId,
          Nombre: row.Nombre,
          Usuario: row.Usuario,
          RolId: row.RolId,
          RolNombre: row.RolNombre,
          Permisos: []
        });
      }

      // Si tiene un permiso
      if (row.PermisoId) {
        usuariosMap.get(row.UsuarioId).Permisos.push({
          PermisoId: row.PermisoId,
          UnidadId: row.UnidadId,
          LocalidadId: row.LocalidadId,
          EscuelaId: row.EscuelaId,
          CarreraId: row.CarreraId,
          TipoPermiso: row.TipoPermiso
        });
      }
    });

    return NextResponse.json(Array.from(usuariosMap.values()));

  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al obtener usuarios", detail: error.message },
      { status: 500 }
    );
  }
}