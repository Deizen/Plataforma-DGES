"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import SelectUnidad from "./SelectUnidad";
import SeccionCargos from "./SeccionCargos";

interface Escuela {
  value: number;
  label: string;
}

export default function DirectorioModulo() {
  const [escuelas, setEscuelas] = useState<Escuela[]>([]);
  const [escuelaSeleccionada, setEscuelaSeleccionada] = useState<number | null>(null);

  useEffect(() => {
    const fetchEscuelas = async () => {
      const res = await fetch("/api/catalogos/escuela");
      const data = await res.json();
      setEscuelas(data);
    };

    fetchEscuelas();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Directorio
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography mb={2}>
            Seleccione una Unidad Académica para configurar su directorio:
          </Typography>

          <SelectUnidad
            escuelas={escuelas}
            value={escuelaSeleccionada}
            onChange={setEscuelaSeleccionada}
          />
        </CardContent>
      </Card>

      {escuelaSeleccionada && (
        <SeccionCargos unidadAcademicaId={escuelaSeleccionada} />
      )}
    </Box>
  );
}