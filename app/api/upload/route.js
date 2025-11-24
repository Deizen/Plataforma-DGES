import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid"; 

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files");

    // Carpeta base /public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploaded = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());

      // Generar nombre único usando UUID
      const ext = path.extname(file.name);
      const uniqueName = `${uuidv4()}${ext}`;
      const filePath = path.join(uploadDir, uniqueName);

      // Guardar archivo en disco
      await writeFile(filePath, buffer);

      // Devolver info al cliente
      uploaded.push({
        name: file.name, // nombre original
        url: `/uploads/${uniqueName}`, // URL única
      });
    }

    return NextResponse.json({ files: uploaded });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json({ error: "Error al subir archivos" }, { status: 500 });
  }
} 