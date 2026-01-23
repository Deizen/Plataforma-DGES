"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  Paper,
} from "@mui/material";
import Select from "../Select";
import { useCatalogos } from "@/hooks/useCatalogos";

const permisoVacio = {
  UnidadId: "",
  LocalidadId: "",
  EscuelaId: "",
  CarreraId: "",
  TipoPermiso: "1",
};

export default function FormularioUsuario({
  usuarioEditar,
  onGuardado,
  onCancelar,
}) {
  const { unidades, localidades, escuelas, carreras, modalidades, roles } =
    useCatalogos();

  /* ====================== USUARIO ====================== */
  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [selectedRol, setSelectedRol] = useState("");

  const ROLES_SIN_PERMISOS = [1]; // Admin
  /* ====================== PERMISOS ====================== */
  const [permisos, setPermisos] = useState([permisoVacio]);
  const [mensaje, setMensaje] = useState("");
  
  const requierePermisos = selectedRol && !ROLES_SIN_PERMISOS.includes(Number(selectedRol));

  /* ====================== EDICIÓN ====================== */
  useEffect(() => {
    if (!usuarioEditar) return;

    setNombre(usuarioEditar.Nombre);
    setUsuario(usuarioEditar.Usuario);
    setSelectedRol(usuarioEditar.RolId);

    const requiere =
      usuarioEditar.RolId &&
      !ROLES_SIN_PERMISOS.includes(Number(usuarioEditar.RolId));

    if (requiere && Array.isArray(usuarioEditar.Permisos)) {
      setPermisos(
        usuarioEditar.Permisos.map((p) => ({
          UnidadId: p.UnidadId ?? "",
          LocalidadId: p.LocalidadId ?? "",
          EscuelaId: p.EscuelaId ?? "",
          CarreraId: p.CarreraId ?? "",
          TipoPermiso: String(p.TipoPermiso ?? "1"),
        }))
      );
    } else {
      setPermisos([]);
    }

    setContrasena("");
  }, [usuarioEditar]);

  /* ====================== VISIBILIDAD ====================== */
  const showUnidad = selectedRol >= 2;
  const showLocalidad = selectedRol >= 3;
  const showEscuela = selectedRol >= 4;
  const showCarrera = selectedRol >= 5;

  /* ====================== VALIDACIÓN ====================== */
  const validar = () => {
    if (!nombre || !usuario || (!usuarioEditar && !contrasena) || !selectedRol) {
      return "Completa todos los campos obligatorios.";
    }

    for (const p of permisos) {
      if (showUnidad && !p.UnidadId) return "Selecciona Unidad Regional.";
      if (showLocalidad && !p.LocalidadId) return "Selecciona Localidad.";
      if (showEscuela && !p.EscuelaId) return "Selecciona Escuela.";
      if (showCarrera && !p.CarreraId) return "Selecciona Carrera.";
    }

    return null;
  };

  /* ====================== GUARDAR ====================== */
  const handleSubmit = async () => {
    const error = validar();

    if (error) {
      setMensaje(error);
      return;
    }

    const payload = {
      Id: usuarioEditar?.UsuarioId,
      Nombre: nombre,
      Usuario: usuario,
      Password: contrasena || undefined,
      RolId: selectedRol,
      //Permisos: permisos,
      Permisos: requierePermisos ? permisos : [],
    };

    const url = usuarioEditar
      ? "/api/usuarios/editar"
      : "/api/usuarios/guardar";

    await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    onGuardado();
  };

  return (
    <Box sx={{ width: "100%", background: "white", p: 1 }}>
      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: "bold", color: "#2e7d32" }}
      >
        {usuarioEditar ? "Editar Usuario" : "Registrar Usuario"}
      </Typography>

      {/* ======================= DATOS ======================= */}
      <Grid container spacing={2} alignItems="stretch">
      {/* ACCESO */}
      <Grid item xs={12} md={4}>
        <Paper elevation={2} sx={{ p: 2.5, borderRadius: 3, height: "100%" }}>
          <Typography sx={{ mb: 1.5, fontWeight: "bold", color: "#2e7d32" }}>
            Datos de acceso
          </Typography>

          <TextField
            fullWidth
            label="Usuario"
            type="number"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            size="small"
            sx={{ mb: 1.5 }}
          />

          <TextField
            fullWidth
            type="password"
            size="small"
            label={
              usuarioEditar ? "Nueva contraseña (opcional)" : "Contraseña"
            }
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
        </Paper>
      </Grid>

      {/* INFO + ROL */}
      <Grid item xs={12} md={4}>
        <Paper elevation={2} sx={{ p: 2.5, borderRadius: 3, height: "100%" }}>
          <Typography sx={{ mb: 1.5, fontWeight: "bold", color: "#2e7d32" }}>
            Información personal
          </Typography>

          <TextField
            fullWidth
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            size="small"
            sx={{ mb: 1.5 }}
          />

          <Typography
            sx={{ mb: 0.5, fontWeight: "bold", color: "#2e7d32" }}
          >
            Rol
          </Typography>

          <Select
            options={roles}
            value={selectedRol}
            onChange={setSelectedRol}
            label="Selecciona un rol..."
          />
        </Paper>
      </Grid>

      {/* BOTONES */}
      <Grid item xs={12} md={4}>
        <Paper
          elevation={2}
          sx={{
            p: 2.5,
            borderRadius: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            fullWidth
            sx={{
              py: 1.2,
              fontSize: "1rem",
              bgcolor: "#2e7d32",
            }}
            onClick={handleSubmit}
          >
            {usuarioEditar ? "Actualizar Usuario" : "Registrar"}
          </Button>

          <Button
            fullWidth
            sx={{ mt: 1.5 }}
            variant="outlined"
            onClick={onCancelar}
          >
            Cancelar
          </Button>
        </Paper>
      </Grid>
    </Grid>
 {/* ======================= PERMISOS ======================= */}
{requierePermisos &&
  permisos.map((permiso, index) => {
    const filteredLocalidades = localidades.filter(
      (l) => l.UnidadRegionalId === permiso.UnidadId
    );

    const filteredEscuelas = escuelas.filter(
      (e) => e.LocalidadId === permiso.LocalidadId
    );

    const carrerasUnicas = carreras
      .filter((c) => c.EscuelaId === permiso.EscuelaId)
      .map((c) => {
        const m = modalidades.find((m) => m.value === c.ModalidadId);
        return { value: c.value, label: `${c.label} - ${m?.label || ""}` };
      });

    return (
      <Paper
        key={index}
        elevation={2}
        sx={{ p: 3, mt: 2, borderRadius: 3 }}
      >
        <Typography sx={{ mb: 1, fontWeight: "bold", color: "#2e7d32" }}>
          Permiso #{index + 1}
        </Typography>

        <Grid container spacing={1}>
          {showUnidad && (
            <Grid item xs={12} sm={3}>
              <Select
                options={unidades}
                value={permiso.UnidadId}
                onChange={(v) => {
                  const copy = [...permisos];
                  copy[index] = {
                    ...permiso,
                    UnidadId: v,
                    LocalidadId: "",
                    EscuelaId: "",
                    CarreraId: "",
                  };
                  setPermisos(copy);
                }}
              />
            </Grid>
          )}

          {showLocalidad && (
            <Grid item xs={12} sm={3}>
              <Select
                options={filteredLocalidades}
                value={permiso.LocalidadId}
                onChange={(v) => {
                  const copy = [...permisos];
                  copy[index] = {
                    ...permiso,
                    LocalidadId: v,
                    EscuelaId: "",
                    CarreraId: "",
                  };
                  setPermisos(copy);
                }}
              />
            </Grid>
          )}

          {showEscuela && (
            <Grid item xs={12} sm={3}>
              <Select
                options={filteredEscuelas}
                value={permiso.EscuelaId}
                onChange={(v) => {
                  const copy = [...permisos];
                  copy[index] = {
                    ...permiso,
                    EscuelaId: v,
                    CarreraId: "",
                  };
                  setPermisos(copy);
                }}
              />
            </Grid>
          )}

          {showCarrera && (
            <Grid item xs={12} sm={3}>
              <Select
                options={carrerasUnicas}
                value={permiso.CarreraId}
                onChange={(v) => {
                  const copy = [...permisos];
                  copy[index] = { ...permiso, CarreraId: v };
                  setPermisos(copy);
                }}
              />
            </Grid>
          )}

          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              select
              label="Tipo"
              value={permiso.TipoPermiso}
              onChange={(e) => {
                const copy = [...permisos];
                copy[index] = {
                  ...permiso,
                  TipoPermiso: e.target.value,
                };
                setPermisos(copy);
              }}
            >
              <MenuItem value="1">Edición</MenuItem>
              <MenuItem value="2">Lectura</MenuItem>
            </TextField>
          </Grid>

          {permisos.length > 1 && (
            <Grid item xs={12} sm={1}>
              <Button
                color="error"
                onClick={() =>
                  setPermisos(permisos.filter((_, i) => i !== index))
                }
              >
                −
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>
    );
  })}
      

      <Button
        sx={{ mt: 2 }}
        variant="outlined"
        onClick={() => setPermisos([...permisos, permisoVacio])}
      >
        + Agregar permiso
      </Button>

      {mensaje && (
        <Typography color="error" sx={{ mt: 1 }}>
          {mensaje}
        </Typography>
      )}
    </Box>
  );
}