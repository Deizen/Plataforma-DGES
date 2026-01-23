"use client";
import { useState } from "react";
import {
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, CircularProgress
} from "@mui/material";
import { useUsuarios } from "@/hooks/useUsuarios";
import DialogUsuario from "./DialogUsuario";

export default function TablaUsuarios() {

  const { usuarios, loading, cargarUsuarios } = useUsuarios();
  const [open, setOpen] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);

  const handleNuevo = () => {
    setUsuarioEditar(null);
    setOpen(true);
  };

  const handleEditar = (usuario) => {
    setUsuarioEditar(usuario);
    setOpen(true);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Button
        variant="contained"
        color="success"
        sx={{ mb: 2 }}
        onClick={handleNuevo}
      >
        Nuevo Usuario
      </Button>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: "#e8f5e9" }}>
                <TableCell>Nombre</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Unidad</TableCell>
                <TableCell>Localidad</TableCell>
                <TableCell>Escuela</TableCell>
                <TableCell>Carrera</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {usuarios.map((u) => (
                <TableRow key={u.UsuarioId}>
                  <TableCell>{u.Nombre}</TableCell>
                  <TableCell>{u.Usuario}</TableCell>
                  <TableCell>{u.RolNombre}</TableCell>
                  <TableCell>{u.UnidadId}</TableCell>
                  <TableCell>{u.LocalidadId}</TableCell>
                  <TableCell>{u.EscuelaId}</TableCell>
                  <TableCell>{u.CarreraId}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEditar(u)}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </TableContainer>
      )}

      <DialogUsuario
        open={open}
        onClose={() => setOpen(false)}
        usuario={usuarioEditar}
        recargar={cargarUsuarios}
      />
    </Box>
  );
}