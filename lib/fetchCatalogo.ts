export async function fetchCatalogo(endpoint: string) {
  try {
    const res = await fetch(`/api/catalogos/${endpoint}`);
    if (!res.ok) throw new Error(`Error al obtener ${endpoint}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error cargando ${endpoint}:`, error);
    return [];
  }
}