import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No se enviaron archivos" }, { status: 400 });
    }

    // Extensiones permitidas
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

    // MIME permitidos
    const allowedMime = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    // Guardado seguro fuera de /public
    const uploadDir = path.join(process.cwd(), "storage", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploaded = [];

    for (const file of files) {
      const ext = path.extname(file.name).toLowerCase();
      const mime = file.type;
      const original = file.name;

      // Bloquear extensiones dobles (ej: file.pdf.php)
      if (original.split(".").length > 2) {
        return NextResponse.json(
          { error: `Nombre inválido: ${original}` },
          { status: 400 }
        );
      }

      // Validar extensión
      if (!allowedExt.includes(ext)) {
        return NextResponse.json(
          { error: `Extensión no permitida: ${ext}` },
          { status: 400 }
        );
      }

      // Validar MIME
      if (!allowedMime.includes(mime)) {
        return NextResponse.json(
          { error: `MIME no permitido: ${mime}` },
          { status: 400 }
        );
      }

      // Nombre seguro
      const fileId = uuidv4() + ext;
      const filePath = path.join(uploadDir, fileId);

      // Guardar archivo
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);

      uploaded.push({
        id: fileId,
        ruta: `uploads/${fileId}`,
        nombreOriginal: original,
        size: file.size,
        mime
      });
      // uploaded.push({
      //   id: fileId,
      //   size: file.size,
      //   mime,
      // });
    }
    return NextResponse.json({ ok: true, files: uploaded });
    // return NextResponse.json({ ok: true, files: uploaded });
  } catch (error) {
    console.error("Error al subir archivos:", error);
    return NextResponse.json({ error: "Error al subir archivos" }, { status: 500 });
  }
}