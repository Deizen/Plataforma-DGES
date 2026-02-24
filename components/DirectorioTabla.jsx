import { Box, Grid, Typography, Button } from "@mui/material";
import { useState } from "react";
import Select from "./Select";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import jsPDF from "jspdf";

export default function DirectorioTabla() {
  const [unidadRegional, setUnidadRegional] = useState("");
  const [unidadAcademica, setUnidadAcademica] = useState("");

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

  // 🔥 Exportar PDF dinámico
  const exportarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Directorio Institucional", 14, 20);

    doc.setFontSize(12);
    doc.text(`Unidad Regional: ${unidadesRegionales.find(u => u.value === unidadRegional)?.label}`, 14, 30);
    doc.text(`Unidad Académica: ${unidadesAcademicas.find(u => u.value === unidadAcademica)?.label}`, 14, 38);

    let y = 50;

    Object.entries(directorioDummy).forEach(([key, persona]) => {
      doc.setFont(undefined, "bold");
      doc.text(
        key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase()),
        14,
        y
      );

      doc.setFont(undefined, "normal");
      y += 6;
      doc.text(`Nombre: ${persona.nombre}`, 20, y);
      y += 6;
      doc.text(`Correo: ${persona.correo}`, 20, y);
      y += 6;
      doc.text(`Teléfono: ${persona.telefono}`, 20, y);
      y += 10;
    });

    doc.save("Directorio_Institucional.pdf");
  };

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

        {filtrosCompletos && (
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<PictureAsPdfIcon />}
              onClick={exportarPDF}
              sx={{
                height: "100%",
                bgcolor: "#1d70b8",
                "&:hover": { bgcolor: "#0c3b74" },
              }}
            >
              Exportar PDF
            </Button>
          </Grid>
        )}
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

      {/* 🔥 SOLO SE MUESTRA SI FILTROS COMPLETOS */}
      {filtrosCompletos && (
        <Box
          sx={{
            backgroundColor: "#e8f5e9",
            p: 3,
            borderRadius: 3,
            mt: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Directorio Institucional
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1.2fr 1.2fr 1fr",
              },
              backgroundColor: "#a5d6a7",
              px: 2,
              py: 1.5,
              borderRadius: 2,
              fontWeight: "bold",
              color: "#1b5e20",
            }}
          >
            <Box>CARGO</Box>
            <Box>NOMBRE</Box>
            <Box>CORREO</Box>
            <Box>TELÉFONO</Box>
          </Box>

          <Box sx={{ mt: 2 }}>
            {Object.entries(directorioDummy).map(([key, persona]) => (
              <Box
                key={key}
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "1fr 1.2fr 1.2fr 1fr",
                  },
                  backgroundColor: "white",
                  px: 2,
                  py: 2,
                  mb: 2,
                  borderRadius: 2,
                  boxShadow: 1,
                  transition: "0.3s",
                  "&:hover": {
                    backgroundColor: "#f1f8e9",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </Typography>

                <Typography>{persona.nombre}</Typography>

                <Typography
                  component="a"
                  href={`mailto:${persona.correo}`}
                  sx={{
                    textDecoration: "none",
                    color: "#2e7d32",
                    fontWeight: 500,
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {persona.correo}
                </Typography>

                <Typography>{persona.telefono}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}