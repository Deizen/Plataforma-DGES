import { useEffect, useState } from "react";
import { fetchCatalogo } from "@/lib/fetchCatalogo";

export function useCatalogos() {
  const [catalogos, setCatalogos] = useState({
    unidades: [],
    localidades: [],
    escuelas: [],
    carreras: [],
    modalidades: [],
  });

  useEffect(() => {
    async function cargar() {
      const [unidades, localidades, escuelas, carreras, modalidades] = await Promise.all([
        fetchCatalogo("unidadregional"),
        fetchCatalogo("localidad"),
        fetchCatalogo("escuela"),
        fetchCatalogo("carrera"),
        fetchCatalogo("modalidad"),
      ]);
      setCatalogos({ unidades, localidades, escuelas, carreras, modalidades});
    }
    cargar();
  }, []);

  return catalogos;
}