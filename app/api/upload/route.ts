import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No se recibieron archivos" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const savedFiles: { name: string; url: string }[] = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Generar nombre único
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/\s/g, "_"); // reemplaza espacios
      const fileName = `${timestamp}_${sanitizedName}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, buffer);

      savedFiles.push({
        name: file.name, // nombre original
        url: `/uploads/${fileName}`, // URL pública
      });
    }

    return NextResponse.json({ message: "Archivos subidos correctamente", files: savedFiles });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al subir archivos" }, { status: 500 });
  }
};