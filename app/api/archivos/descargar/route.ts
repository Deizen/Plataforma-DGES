import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ruta = searchParams.get("ruta");

  if (!ruta) {
    return NextResponse.json({ error: "Falta ruta" }, { status: 400 });
  }

  // Normaliza la ruta por seguridad (evita ../../../ etc)
  const fileName = path.basename(ruta);
  const filePath = path.join(process.cwd(), "storage", "uploads", fileName);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
  }

  const buffer = fs.readFileSync(filePath);

  const ext = path.extname(fileName).toLowerCase();
  const mimeMap: Record<string, string> = {
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

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": mime,
      "Content-Disposition": `inline; filename="${fileName}"`, 
    },
  });
}
// import { NextResponse } from "next/server";
// import path from "path";
// import fs from "fs/promises";
// import { db } from "@/lib/db";

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");

//     if (!id) {
//       return NextResponse.json({ error: "ID requerido" }, { status: 400 });
//     }

//     // Buscar archivo en BD
//     const [rows]: any = await db.query(
//       "SELECT Nombre, Ruta FROM archivo WHERE Id = ? AND Activo = 1",
//       [id]
//     );

//     if (!rows || rows.length === 0) {
//       return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
//     }

//     const { Nombre, Ruta } = rows[0];

//     // Seguridad: evitar traversal
//     if (Ruta.includes("..")) {
//       return NextResponse.json({ error: "Ruta inválida" }, { status: 400 });
//     }

//     // Ruta física del file
//     const absolutePath = path.join(
//       process.cwd(),
//       "storage",
//       "uploads",
//       path.basename(Ruta)
//     );

//     // Leer archivo
//     let fileBuffer;
//     try {
//       fileBuffer = await fs.readFile(absolutePath);
//     } catch {
//       return NextResponse.json({ error: "Archivo físico no encontrado" }, { status: 404 });
//     }

//     // Detectar MIME básico
//     const ext = path.extname(Nombre).toLowerCase();
//     const mimeMap: Record<string, string> = {
//       ".pdf": "application/pdf",
//       ".png": "image/png",
//       ".jpg": "image/jpeg",
//       ".jpeg": "image/jpeg",
//       ".doc": "application/msword",
//       ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       ".xls": "application/vnd.ms-excel",
//       ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     };

//     const mime = mimeMap[ext] || "application/octet-stream";

//     return new NextResponse(fileBuffer, {
//       headers: {
//         "Content-Type": mime,
//         "Content-Disposition": `attachment; filename="${encodeURIComponent(Nombre)}"`,
//         "Cache-Control": "no-store",
//       },
//     });

//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Error interno" }, { status: 500 });
//   }
// }