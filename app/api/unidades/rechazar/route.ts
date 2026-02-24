import { db } from "@/lib/db";

export async function POST(req) {
  const { id, motivo, adminId } = await req.json();

  await db.query(`
    INSERT INTO unidad_semestre_rechazos
    (UnidadSemestreId,Motivo,UsuarioAdminId)
    VALUES (?,?,?)
  `,[id,motivo,adminId]);

  await db.query(`UPDATE unidad_semestre SET Status=3 WHERE Id=?`,[id]);

  return Response.json({ ok:true });
}