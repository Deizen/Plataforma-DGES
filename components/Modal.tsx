"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

interface ModalProps {
  open: boolean;
  onClose: () => void;     // Cuando cancela
  onConfirm: () => void;   // Cuando confirma
  fileName?: string;       // Opcional, por si quieres mostrar el nombre del archivo
}

export default function Modal({
  open,
  onClose,
  onConfirm,
  fileName,
}: ModalProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Confirmar eliminación</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Estás seguro que deseas eliminar el archivo{" "}
          <strong>{fileName}</strong>?
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="primary">
          No
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Sí
        </Button>
      </DialogActions>
    </Dialog>
  );
}