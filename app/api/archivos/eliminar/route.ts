// api/archivos/eliminar/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const [rows]: any = await db.query(
      "SELECT Ruta FROM archivo WHERE Id = ?",
      [id]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
    }

    const filePath = rows[0].Ruta;

    //const absolutePath = path.join(process.cwd(), "public", filePath);
    const absolutePath = path.join(
        process.cwd(),
        "storage",
        "uploads",
        path.basename(filePath) 
      );

    try {
      await fs.unlink(absolutePath);
    } catch (error) {
      console.warn("Archivo físico no encontrado:", absolutePath);
    }

    await db.query("DELETE FROM archivo WHERE Id = ?", [id]);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}