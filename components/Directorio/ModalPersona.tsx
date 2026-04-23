"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ModalPersona({ open, onClose }: Props) {
  const [form, setForm] = useState({
    numeroEmpleado: "",
    nombres: "",
    apellidos: "",
    nombramiento: "",
    gradoAcademico: "",
    correo: "",
    telefono: "",
  });

  const handleChange = (campo: string, valor: string) => {
    setForm({
      ...form,
      [campo]: valor,
    });
  };

  const guardarPersona = async () => {
    await fetch("/api/personal/guardar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Registrar Persona</DialogTitle>

      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Número de empleado"
              fullWidth
              value={form.numeroEmpleado}
              onChange={(e) =>
                handleChange("numeroEmpleado", e.target.value)
              }
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Nombre(s)"
              fullWidth
              value={form.nombres}
              onChange={(e) =>
                handleChange("nombres", e.target.value)
              }
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Apellido(s)"
              fullWidth
              value={form.apellidos}
              onChange={(e) =>
                handleChange("apellidos", e.target.value)
              }
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Nombramiento"
              fullWidth
              placeholder="Confianza, Asignatura, PITC"
              value={form.nombramiento}
              onChange={(e) =>
                handleChange("nombramiento", e.target.value)
              }
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Grado académico"
              fullWidth
              value={form.gradoAcademico}
              onChange={(e) =>
                handleChange("gradoAcademico", e.target.value)
              }
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Correo electrónico"
              fullWidth
              value={form.correo}
              onChange={(e) =>
                handleChange("correo", e.target.value)
              }
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Teléfono"
              fullWidth
              value={form.telefono}
              onChange={(e) =>
                handleChange("telefono", e.target.value)
              }
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={guardarPersona}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}