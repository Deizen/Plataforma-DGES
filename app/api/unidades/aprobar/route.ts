import { db } from "@/lib/db";


export async function POST(req: Request){
  const { id } = await req.json();

  await db.query(`UPDATE unidad_semestre SET Status=4 WHERE Id=?`,[id]);

  return Response.json({ ok:true });
}