import { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { CargoDirectorio } from "@/types/directorio";
import CampoCargo from "./CampoCargo";

interface Cargo {
  id: number;
  nombre: string;
  tipo: "UNICO" | "AREA";
  usuarioId: number | null;
}

interface Props {
  unidadAcademicaId: number;
}

export default function SeccionCargos({ unidadAcademicaId }: Props) {
  // const [cargos, setCargos] = useState<Cargo[]>([]);
  const [cargos, setCargos] = useState<CargoDirectorio[]>([]);

  useEffect(() => {
    const fetchCargos = async () => {
      const res = await fetch(
        `/api/directorio?unidadAcademicaId=${unidadAcademicaId}`
      );
      const data = await res.json();
      setCargos(data);
    };

    fetchCargos();
  }, [unidadAcademicaId]);

  
  console.log("Cargos obtenidos:", cargos);

  const cargosUnicos = cargos.filter(c => c.tipo === "UNICO");
  const responsablesArea = cargos.filter(c => c.tipo === "AREA");

  return (
    <Grid container spacing={3}>
      {/* CARGOS ÚNICOS */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ bgcolor: "#2e4ea1", color: "white" }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Cargos Únicos
            </Typography>


            {cargosUnicos.map(cargo => (
              <Box key={cargo.id} mb={2}>
                <CampoCargo key={cargo.id} cargo={cargo} unidadAcademicaId={unidadAcademicaId} />
                
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* RESPONSABLES DE ÁREA */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ bgcolor: "#1f7a57", color: "white" }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Responsables de Áreas
            </Typography>

            {responsablesArea.map(cargo => (
              <Box key={cargo.id} mb={2}>
                <CampoCargo key={cargo.id} cargo={cargo} unidadAcademicaId={unidadAcademicaId} />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}