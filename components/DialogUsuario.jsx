"use client";
import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, Button, TextField, MenuItem
} from "@mui/material";
import { useState, useEffect } from "react";

export default function DialogUsuario({ open, onClose, usuario, recargar }) {
  
  const [form, setForm] = useState({
    Nombre: "",
    Usuario: "",
    Password: "",
    RolId: 1,
    UnidadId: 0,
    LocalidadId: 0,
    EscuelaId: 0,
    CarreraId: 0,
    TipoPermiso: 1
  });

  useEffect(() => {
    if (usuario) {
      setForm({
        ...usuario,
        Password: "",
        TipoPermiso: usuario.TipoPermiso ?? 1
      });
    } else {
      setForm({
        Nombre: "",
        Usuario: "",
        Password: "",
        RolId: 1,
        UnidadId: 0,
        LocalidadId: 0,
        EscuelaId: 0,
        CarreraId: 0,
        TipoPermiso: 1
      });
    }
  }, [usuario]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardar = async () => {
    const res = await fetch("/api/usuarios/guardar", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (res.ok) {
      recargar();
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{usuario ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        
        <TextField label="Nombre" name="Nombre" value={form.Nombre} onChange={handleChange} />
        <TextField label="Usuario" name="Usuario" value={form.Usuario} onChange={handleChange} />
        <TextField label="Password" name="Password" type="password" value={form.Password} onChange={handleChange} />

        <TextField select label="Rol" name="RolId" value={form.RolId} onChange={handleChange}>
          <MenuItem value={1}>Admin</MenuItem>
          <MenuItem value={2}>Unidad</MenuItem>
          <MenuItem value={3}>Localidad</MenuItem>
          <MenuItem value={4}>Escuela</MenuItem>
          <MenuItem value={5}>Carrera</MenuItem>
        </TextField>

        <TextField label="Unidad" name="UnidadId" type="number" value={form.UnidadId} onChange={handleChange} />
        <TextField label="Localidad" name="LocalidadId" type="number" value={form.LocalidadId} onChange={handleChange} />
        <TextField label="Escuela" name="EscuelaId" type="number" value={form.EscuelaId} onChange={handleChange} />
        <TextField label="Carrera" name="CarreraId" type="number" value={form.CarreraId} onChange={handleChange} />

      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" color="success" onClick={guardar}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}