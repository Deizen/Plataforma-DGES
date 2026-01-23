"use client";

import { useState, useEffect } from "react";
import TablaUsuarios from "./TablaUsuarios";
import FormularioUsuario from "./FormularioUsuario";
import Modal from "../Modal";
import { Box, CircularProgress } from "@mui/material";

export default function RegistroUsuarios() {
  const [vista, setVista] = useState("lista");
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [usuarioEliminar, setUsuarioEliminar] = useState(null);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/usuarios/obtener");
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleGuardado = () => {
    setVista("lista");
    setUsuarioEditar(null);
    cargarUsuarios();
  };

  const handleNuevo = () => {
    setUsuarioEditar(null);
    setVista("formulario");
  };

  const handleEditar = (usuario) => {
    setUsuarioEditar(usuario);
    setVista("formulario");
  };

  const handleEliminar = (usuario) => {
    setUsuarioEliminar(usuario);
    setOpenModal(true);
  };

  const confirmarEliminar = async () => {
    if (!usuarioEliminar) return;

    await fetch("/api/usuarios/eliminar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        UsuarioId: usuarioEliminar.UsuarioId,
      }),
    });

    setOpenModal(false);
    setUsuarioEliminar(null);
    cargarUsuarios();
  };

  return (
    <Box sx={{ padding: "20px" }}>
      {loading ? (
        <CircularProgress />
      ) : vista === "lista" ? (
        <TablaUsuarios
          usuarios={usuarios}
          onEditar={handleEditar}
          onNuevo={handleNuevo}
          onEliminar={handleEliminar}
        />
      ) : (
        <FormularioUsuario
          usuarioEditar={usuarioEditar}
          onGuardado={handleGuardado}
          onCancelar={() => setVista("lista")}
        />
      )}

      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setUsuarioEliminar(null);
        }}
        onConfirm={confirmarEliminar}
        fileName={usuarioEliminar?.Nombre}
      />
    </Box>
  );
}