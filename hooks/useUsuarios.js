"use client";
import { useEffect, useState } from "react";

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/usuarios/obtener");
      const data = await res.json();
      setUsuarios(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return { usuarios, loading, cargarUsuarios };
}