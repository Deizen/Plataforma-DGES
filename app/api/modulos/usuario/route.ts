import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req:Request){

  const { searchParams } = new URL(req.url)
  const usuarioId = searchParams.get("usuarioId")

  const [rows] = await db.query(
`
SELECT m.Clave
FROM usuario_modulo um
JOIN modulo m ON m.Id = um.ModuloId
WHERE um.UsuarioId = ?
AND um.PuedeVer = 1
`,
[usuarioId]
)

return NextResponse.json(rows)

}