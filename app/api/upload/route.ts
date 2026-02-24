import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No se enviaron archivos" },
        { status: 400 }
      );
    }

    const allowedExt = [
      ".pdf",
      ".png",
      ".jpg",
      ".jpeg",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
    ];

    const allowedMime = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    const uploadDir = path.join(process.cwd(), "storage", "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploaded: {
      id: string;
      ruta: string;
      nombreOriginal: string;
      size: number;
      mime: string;
    }[] = [];

    for (const file of files) {
      const ext = path.extname(file.name).toLowerCase();
      const mime = file.type;
      const original = file.name;

      if (original.split(".").length > 2) {
        return NextResponse.json(
          { error: `Nombre inválido: ${original}` },
          { status: 400 }
        );
      }

      if (!allowedExt.includes(ext)) {
        return NextResponse.json(
          { error: `Extensión no permitida: ${ext}` },
          { status: 400 }
        );
      }

      if (!allowedMime.includes(mime)) {
        return NextResponse.json(
          { error: `MIME no permitido: ${mime}` },
          { status: 400 }
        );
      }

      const fileId = uuidv4() + ext;
      const filePath = path.join(uploadDir, fileId);

      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);

      uploaded.push({
        id: fileId,
        ruta: `uploads/${fileId}`,
        nombreOriginal: original,
        size: file.size,
        mime,
      });
    }

    return NextResponse.json({ ok: true, files: uploaded });
  } catch (error) {
    console.error("Error al subir archivos:", error);
    return NextResponse.json(
      { error: "Error al subir archivos" },
      { status: 500 }
    );
  }
}