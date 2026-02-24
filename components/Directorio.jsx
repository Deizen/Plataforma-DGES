import { Box, Grid, Typography, Card, CardContent, Divider } from "@mui/material";
import { useState } from "react";
import Select from "./Select";

export default function Directorio() {
  const [unidadRegional, setUnidadRegional] = useState("");
  const [unidadAcademica, setUnidadAcademica] = useState("");

  // 🔹 Dummy Unidades
  const unidadesRegionales = [
    { label: "Norte", value: 1 },
    { label: "Centro", value: 2 },
    { label: "Sur", value: 3 },
  ];

  const unidadesAcademicas = [
    { label: "Facultad de Enfermería", value: 1 },
    { label: "Facultad de Medicina", value: 2 },
    { label: "Facultad de Derecho", value: 3 },
  ];

  // 🔹 Dummy Directorio
  const directorioDummy = {
    director: {
      nombre: "Dra. María López",
      correo: "direccion@uas.edu.mx",
      telefono: "667-123-4567",
    },
    secretarioAcademico: {
      nombre: "Dr. Carlos Ruiz",
      correo: "academico@uas.edu.mx",
      telefono: "667-555-1234",
    },
    secretarioAdministrativo: {
      nombre: "Lic. Ana Torres",
      correo: "administrativo@uas.edu.mx",
      telefono: "667-444-7788",
    },
    controlEscolar: {
      nombre: "Mtra. Laura Sánchez",
      correo: "controlescolar@uas.edu.mx",
      telefono: "667-888-9900",
    },
    tutorias: {
      nombre: "Psic. Roberto Díaz",
      correo: "tutorias@uas.edu.mx",
      telefono: "667-222-3344",
    },
  };

  const filtrosCompletos = unidadRegional && unidadAcademica;

  return (
    <Box sx={{ p: 4, background: "linear-gradient(to right, #1d70b8, #0c3b74)", minHeight: "100vh" }}>
      
      {/* 🔹 Filtros */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} md={4}>
          <Box sx={{ bgcolor: "#e9e9f5", p: 2, borderRadius: 2 }}>
            <Select
              options={unidadesRegionales}
              value={unidadRegional}
              onChange={(value) => {
                setUnidadRegional(value);
                setUnidadAcademica("");
              }}
              label="Selecciona una unidad regional..."
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ bgcolor: "#e9e9f5", p: 2, borderRadius: 2 }}>
            <Select
              options={unidadesAcademicas}
              value={unidadAcademica}
              onChange={(value) => setUnidadAcademica(value)}
              label="Selecciona una unidad académica..."
            />
          </Box>
        </Grid>
      </Grid>

      {/* 🔹 Bloque vacío */}
      {!filtrosCompletos && (
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "#e8f5e9",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: "#0c3b74", fontWeight: "bold" }}>
            Sección bloqueada
          </Typography>
          <Typography sx={{ color: "#1d70b8" }}>
            Selecciona la unidad regional y académica para visualizar el directorio.
          </Typography>
        </Box>
      )}

      {/* 🔹 Directorio */}
        {filtrosCompletos && (
        <Box
            sx={{
            backgroundColor: "#e8f5e9",
            p: 3,
            borderRadius: 3,
            }}
        >
            <Typography
            variant="h5"
            sx={{
                fontWeight: "bold",
                mb: 3,
            }}
            >
            Directorio
            </Typography>

            <Grid container spacing={3}>
            {Object.entries(directorioDummy).map(([key, persona]) => (
                <Grid item xs={12} md={6} lg={4} key={key}>
                <Box
                    sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: 2,
                    transition: "0.3s",
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 5,
                    },
                    }}
                >
                    {/* 🔹 Encabezado verde tipo tabla */}
                    <Box
                    sx={{
                        backgroundColor: "#a5d6a7",
                        px: 2,
                        py: 1.5,
                    }}
                    >
                    <Typography
                        sx={{
                        fontWeight: "bold",
                        color: "#1b5e20",
                        }}
                    >
                        {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </Typography>
                    </Box>

                    {/* 🔹 Contenido */}
                    <Box sx={{ backgroundColor: "white", p: 2 }}>
                    <Typography sx={{ mb: 0.5 }}>
                        <strong>Nombre:</strong> {persona.nombre}
                    </Typography>
                    <Typography sx={{ mb: 0.5 }}>
                        <strong>Correo:</strong> {persona.correo}
                    </Typography>
                    <Typography>
                        <strong>Teléfono:</strong> {persona.telefono}
                    </Typography>
                    </Box>
                </Box>
                </Grid>
            ))}
            </Grid>
        </Box>
        )}
    </Box>
  );
}