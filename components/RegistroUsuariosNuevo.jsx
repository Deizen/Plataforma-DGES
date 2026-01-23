"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import FormularioUsuario from "./FormularioUsuario";   // <-- tu form actual separado

export default function RegistroUsuarios() {
  const [vista, setVista] = useState("lista"); // "lista" | "form"
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEditar, setUsuarioEditar] = useState(null);

  // ============================
  //  CARGAR USUARIOS
  // ============================
  const cargarUsuarios = async () => {
    try {
      const res = await fetch("/api/usuarios/obtener");
      const data = await res.json();
      setUsuarios(data);
    } catch (e) {
      console.error("Error cargando usuarios:", e);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // ============================
  //  ELIMINAR USUARIO
  // ============================
  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar este usuario?")) return;

    await fetch("/api/usuarios/eliminar", {
      method: "POST",
      body: JSON.stringify({ UsuarioId: id }),
    });

    cargarUsuarios();
  };

  // ============================
  //  EDITAR USUARIO
  // ============================
  const handleEditar = (usuario) => {
    setUsuarioEditar(usuario);
    setVista("form");
  };

  // ============================
  //  NUEVO USUARIO
  // ============================
  const handleNuevo = () => {
    setUsuarioEditar(null); // sin datos → modo crear
    setVista("form");
  };

  // ============================
  //  AL GUARDAR FORMULARIO
  // ============================
  const handleGuardado = () => {
    setVista("lista");
    cargarUsuarios();
  };

  return (
    <Box sx={{ p: 2 }}>

      {/* ============================
            VISTA LISTA
      ============================ */}
      {vista === "lista" && (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Usuarios registrados
            </Typography>

            <Tooltip title="Agregar nuevo usuario">
              <IconButton
                color="success"
                sx={{ bgcolor: "#e8f5e9" }}
                onClick={handleNuevo}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: "#f1f8f4" }}>
                    <TableCell><b>Usuario</b></TableCell>
                    <TableCell><b>Nombre</b></TableCell>
                    <TableCell><b>Rol</b></TableCell>
                    <TableCell><b>Unidad</b></TableCell>
                    <TableCell><b>Localidad</b></TableCell>
                    <TableCell><b>Escuela</b></TableCell>
                    <TableCell><b>Carrera</b></TableCell>
                    <TableCell><b>Acciones</b></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {usuarios.map((u) => (
                    <TableRow key={u.UsuarioId}>
                      <TableCell>{u.Usuario}</TableCell>
                      <TableCell>{u.Nombre}</TableCell>
                      <TableCell>{u.RolNombre}</TableCell>
                      <TableCell>{u.UnidadNombre}</TableCell>
                      <TableCell>{u.LocalidadNombre}</TableCell>
                      <TableCell>{u.EscuelaNombre}</TableCell>
                      <TableCell>{u.CarreraNombre}</TableCell>

                      <TableCell>
                        <Tooltip title="Editar">
                          <IconButton color="primary" onClick={() => handleEditar(u)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Eliminar">
                          <IconButton color="error" onClick={() => handleEliminar(u.UsuarioId)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

              </Table>
            </TableContainer>
          </Paper>
        </>
      )}

      {/* ============================
            VISTA FORMULARIO
      ============================ */}
      {vista === "form" && (
        <FormularioUsuario
          usuarioEditar={usuarioEditar}
          onGuardado={handleGuardado}
          onCancelar={() => setVista("lista")}
        />
      )}
    </Box>
  );
}