import { useEffect, useState } from "react";
import { fetchCatalogo } from "@/lib/fetchCatalogo";

export function useCatalogos() {
  const [catalogos, setCatalogos] = useState({
    unidades: [],
    localidades: [],
    escuelas: [],
    carreras: [],
  });

  useEffect(() => {
    async function cargar() {
      const [unidades, localidades, escuelas, carreras] = await Promise.all([
        fetchCatalogo("unidadregional"),
        fetchCatalogo("localidad"),
        fetchCatalogo("escuela"),
        fetchCatalogo("carrera"),
      ]);
      setCatalogos({ unidades, localidades, escuelas, carreras });
    }
    cargar();
  }, []);

  return catalogos;
}