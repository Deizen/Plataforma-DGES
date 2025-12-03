export async function obtenerUnidadesRegionales() {
  try {
    const res = await fetch("/api/catalogos");
    if (!res.ok) throw new Error("Error al obtener unidades regionales");
    return await res.json();
  } catch (error) {
    console.error("Error cargando unidades:", error);
    return [];
  }
}