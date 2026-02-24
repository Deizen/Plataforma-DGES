import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ nombre: string }> }
) {
  const { nombre } = await context.params;

  const filePath = path.join(
    process.cwd(),
    "storage",
    "uploads",
    nombre
  );

  if (!fs.existsSync(filePath)) {
    return new NextResponse("Archivo no encontrado", { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  const ext = path.extname(nombre).toLowerCase();

  const mimeMap: Record<string, string> = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".doc": "application/msword",
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls": "application/vnd.ms-excel",
    ".xlsx":
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  };

  const mime = mimeMap[ext] || "application/octet-stream";

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": mime,
      "Content-Disposition": `inline; filename="${nombre}"`,
    },
  });
}