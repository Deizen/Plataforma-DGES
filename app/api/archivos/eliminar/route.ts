import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // ⬅ tu conexión Pool
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    // 1️⃣ Buscar archivo por ID
    const [rows]: any = await db.query(
      "SELECT Ruta FROM archivo WHERE Id = ?",
      [id]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: "Archivo no encontrado" },
        { status: 404 }
      );
    }

    const filePath = rows[0].Ruta;

    // 2️⃣ Eliminar archivo físico
    const absolutePath = path.join(process.cwd(), "public", filePath);

    try {
      await fs.unlink(absolutePath);
    } catch (error) {
      console.warn("Archivo físico ya no existe:", absolutePath);
    }

    // 3️⃣ Eliminar registro en BD
    await db.query("DELETE FROM archivo WHERE Id = ?", [id]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno al eliminar archivo" },
      { status: 500 }
    );
  }
}