import { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function TablaUsuarios({
  usuarios,
  onEditar,
  onNuevo,
  onEliminar,
}) {
  const [busqueda, setBusqueda] = useState("");

  const usuariosFiltrados = usuarios.filter((u) => {
    const texto = busqueda.toLowerCase();
    return (
      u.Nombre.toLowerCase().includes(texto) ||
      String(u.Usuario).includes(texto)
    );
  });

  return (
    <Box>
      {/* BUSCADOR + NUEVO */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <TextField
          size="small"
          label="Buscar por nombre o usuario"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <Tooltip title="Agregar nuevo usuario">
          <IconButton color="primary" onClick={onNuevo}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Usuario</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Permisos</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {usuariosFiltrados.map((u) => (
            <TableRow key={u.UsuarioId}>
              <TableCell>{u.Nombre}</TableCell>
              <TableCell>{u.Usuario}</TableCell>
              <TableCell>{u.RolNombre}</TableCell>

              <TableCell>
                {u.Permisos?.map((p, i) => (
                  <Chip
                    key={`${u.UsuarioId}-${i}`}
                    label={`U:${p.UnidadId} L:${p.LocalidadId} E:${p.EscuelaId} C:${p.CarreraId}`}
                    size="small"
                    sx={{ mr: 0.5 }}
                  />
                ))}
              </TableCell>

              <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton color="secondary" onClick={() => onEditar(u)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton color="error" onClick={() => onEliminar(u)}>
                    <DeleteIcon />
                  </IconButton>
                  </Tooltip>


              </TableCell>
            </TableRow>
          ))}

          {usuariosFiltrados.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No se encontraron usuarios
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
}