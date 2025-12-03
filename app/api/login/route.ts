import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { usuario, password } = await req.json();

    if (!usuario || !password) {
      return NextResponse.json(
        { error: "Faltan credenciales" },
        { status: 400 }
      );
    }

    // 1) Buscar usuario por nombre de usuario
    const [rows]: any = await db.query(
      `SELECT * FROM usuario WHERE Usuario = ? AND Activo = 1 LIMIT 1`,
      [usuario]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const user = rows[0];

    // 2) Validar contraseña
    if (user.Password !== password) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    // 3) Buscar permisos del usuario
    const [permisos]: any = await db.query(
      `SELECT UnidadId, LocalidadId, EscuelaId, CarreraId, TipoPermiso
       FROM usuario_permiso
       WHERE UsuarioId = ?`,
      [user.Id]
    );

const userData = {
      id: user.Id,
      nombre: user.Nombre,
      usuario: user.Usuario,
      rolid: user.RolId,
      permisos,
    };

    // Crear JWT
    const token = jwt.sign(
      {
        id: user.Id,
        rolid: user.RolId,
      },
      process.env.JWT_SECRET!, //Debes agregar esta variable en .env
      { expiresIn: "1d" }
    );

    // Respuesta con cookie
    const res = NextResponse.json({ ok: true, user: userData });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return res;
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}