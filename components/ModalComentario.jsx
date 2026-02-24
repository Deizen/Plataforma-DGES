"use client";

import Modal from "@/components/ModalConfirm";
import SeccionTexto from "@/components/SeccionTexto";
import { useState, useEffect } from "react";

export default function ModalComentario({ open, onClose, data }) {
  const [comentario, setComentario] = useState("");

  useEffect(() => {
    if (open) obtener();
  }, [open]);

  const obtener = async () => {
    const res = await fetch(`/api/comentarios/obtener?...`);
    const d = await res.json();
    setComentario(d[0]?.Contenido || "");
  };

  const guardar = async () => {
    await fetch("/api/comentarios/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, contenido: comentario }),
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <SeccionTexto
        title="Comentario"
        value={comentario}
        onChange={setComentario}
        onSave={guardar}
      />
    </Modal>
  );
}