"use client";

import Modal from "@/components/ModalConfirm";
import SeccionTexto from "@/components/SeccionTexto";
import { useState, useEffect } from "react";

export default function ModalObservacion({ open, onClose, data }) {
  const [obs, setObs] = useState("");

  useEffect(() => {
    if (open) obtener();
  }, [open]);

  const obtener = async () => {
    const res = await fetch(`/api/observaciones/obtener?...`);
    const d = await res.json();
    setObs(d[0]?.Contenido || "");
  };

  const guardar = async () => {
    await fetch("/api/observaciones/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, contenido: obs }),
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <SeccionTexto
        title="Observación"
        value={obs}
        onChange={setObs}
        onSave={guardar}
      />
    </Modal>
  );
}