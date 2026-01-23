import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const fileName = params.nombre;

  const filePath = path.join(process.cwd(), "storage", "uploads", fileName);

  if (!fs.existsSync(filePath)) {
    return new NextResponse("Archivo no encontrado", { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  // Obtener MIME por extensión
  const ext = path.extname(fileName).toLowerCase();
  const mimeMap = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  };

  const mime = mimeMap[ext] || "application/octet-stream";

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": mime,
      "Content-Disposition": `inline; filename="${fileName}"`,
    },
  });
}