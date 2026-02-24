"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Button,
} from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

export default function Trayectorias({
  filtrosCompletos,
  soloLectura,
}) {
  const [formData, setFormData] = useState({
    clave: "UAS-ENF-001",
    unidadAcademica: "Facultad de Enfermería",
    unidadRegional: "Norte",
    direccion: "Blvd. Universitario S/N",
    numeroEmpleado: "12345",
    nombre: "Dr. Juan Pérez López",
    nombreInformacion: "",
    archivo: null,
  });

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  if (!filtrosCompletos) {
    return (
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          bgcolor: "#e8f5e9",
          borderRadius: 2,
          mt: 3,
        }}
      >
        <BlockIcon sx={{ fontSize: 60, color: "#0c3b74" }} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Sección bloqueada
        </Typography>
        <Typography variant="body2">
          Selecciona todos los filtros para mostrar la sección.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: "#f5f7fa",
        p: 4,
        borderRadius: 3,
        mt: 3,
        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
      }}
    >
      {/* ENCABEZADO */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          mb: 3,
          color: "#0c3b74",
        }}
      >
        Coordinación de Trayectorias Escolares y Atención Estudiantil
      </Typography>

      <Typography variant="body2" sx={{ mb: 4 }}>
        Este espacio está destinado a la integración y actualización de la
        información correspondiente a las trayectorias estudiantiles.
      </Typography>

      {/* FORMULARIO */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Clave"
            value={formData.clave}
            disabled
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Unidad Académica"
            value={formData.unidadAcademica}
            disabled
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Unidad Regional"
            value={formData.unidadRegional}
            disabled
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Dirección de la U.A."
            value={formData.direccion}
            disabled
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Número de Empleado"
            value={formData.numeroEmpleado}
            onChange={(e) =>
              handleChange("numeroEmpleado", e.target.value)
            }
            disabled={soloLectura}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Nombre"
            value={formData.nombre}
            onChange={(e) =>
              handleChange("nombre", e.target.value)
            }
            disabled={soloLectura}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Nombre de la Información Solicitada"
            value={formData.nombreInformacion}
            onChange={(e) =>
              handleChange("nombreInformacion", e.target.value)
            }
            disabled={soloLectura}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          {!soloLectura && (
            <Button
              variant="contained"
              component="label"
              startIcon={<InsertDriveFileIcon />}
              sx={{
                height: "56px",
                backgroundColor: "#1d70b8",
                "&:hover": {
                  backgroundColor: "#0c3b74",
                },
              }}
            >
              Adjuntar Archivo
              <input
                type="file"
                hidden
                onChange={(e) =>
                  handleChange("archivo", e.target.files[0])
                }
              />
            </Button>
          )}

          {formData.archivo && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Archivo seleccionado: {formData.archivo.name}
            </Typography>
          )}
        </Grid>

        {!soloLectura && (
          <Grid item xs={12}>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: "#2e7d32",
                "&:hover": {
                  backgroundColor: "#1b5e20",
                },
              }}
            >
              Guardar Información
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}