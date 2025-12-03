import { useEffect, useState } from "react";
import { fetchCatalogo } from "@/lib/fetchCatalogo";

export function useCatalogos() {
  const [catalogos, setCatalogos] = useState({
    unidades: [],
    localidades: [],
    escuelas: [],
    carreras: [],
    modalidades: [],
    roles: [],
  });

  useEffect(() => {
    async function cargar() {
      const [unidades, localidades, escuelas, carreras, modalidades,roles] = await Promise.all([
        fetchCatalogo("unidadregional"),
        fetchCatalogo("localidad"),
        fetchCatalogo("escuela"),
        fetchCatalogo("carrera"),
        fetchCatalogo("modalidad"),
        fetchCatalogo("rol"),
      ]);
      setCatalogos({ unidades, localidades, escuelas, carreras, modalidades,roles});
    }
    cargar();
  }, []);

  return catalogos;
}