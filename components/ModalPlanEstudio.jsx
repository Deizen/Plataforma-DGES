"use client";

import { Box, Typography, Button, List, ListItem, ListItemText, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModalBase from "@/components/ModalBase";
import ModalConfirm from "@/components/ModalConfirm";
import FileUploader from "@/components/FileUploader";
import { useState, useEffect } from "react";

export default function ModalPlanEstudio({ open, onClose, data }) {
  const [pendingFiles, setPendingFiles] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (open) cargarArchivo();
  }, [open]);

  const cargarArchivo = async () => {
    const res = await fetch("/api/plan/obtener", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    setUploadedFile(result.archivo || null);
  };

  const subirArchivo = async () => {
    const formData = new FormData();
    pendingFiles.forEach(f => formData.append("files", f.file));

    await fetch("/api/upload", { method: "POST", body: formData });
    await fetch("/api/plan/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setPendingFiles([]);
    cargarArchivo();
  };

  const eliminarArchivo = async () => {
    await fetch("/api/plan/eliminar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setUploadedFile(null);
    setConfirmDelete(false);
  };

return (
  <ModalBase open={open} onClose={onClose}>
    <Box
      sx={{
        bgcolor: "#e8f5e9",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: "#2e7d32",
          color: "white",
          px: 3,
          py: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Plan de Estudios
        </Typography>
      </Box>

      {/* Contenido */}
      <Box sx={{ p: 4 }}>
        {!uploadedFile ? (
          <>
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                p: 3,
                border: "2px dashed #a5d6a7",
              }}
            >
              <FileUploader showFiles={false} onUpload={setPendingFiles} />
            </Box>

            <Button
              sx={{
                mt: 3,
                bgcolor: "#2e7d32",
                "&:hover": { bgcolor: "#1b5e20" },
              }}
              disabled={!pendingFiles.length}
              onClick={subirArchivo}
              variant="contained"
              fullWidth
            >
              Subir archivo
            </Button>
          </>
        ) : (
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: 2,
              p: 2,
              border: "1px solid #c8e6c9",
            }}
          >
            <List>
              <ListItem
                secondaryAction={
                  <IconButton onClick={() => setConfirmDelete(true)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={uploadedFile.nombre}
                  primaryTypographyProps={{ fontWeight: "bold" }}
                />
              </ListItem>
            </List>
          </Box>
        )}
      </Box>

      <ModalConfirm
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={eliminarArchivo}
        fileName={uploadedFile?.nombre}
      />
    </Box>
  </ModalBase>
);
}