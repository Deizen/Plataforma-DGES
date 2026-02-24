  "use client";

  import { Box, Typography, IconButton } from "@mui/material";
  import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
  import BlockIcon from "@mui/icons-material/Block";
  import ModalConfirm from "@/components/ModalConfirm";
  import BloqueUploader from "@/components/BloqueUploader";
  import SeccionTexto from "@/components/SeccionTexto";
  import { useState } from "react";

  export default function CargaArchivosSemestre({
    filtrosCompletos,
    soloLectura,
    rol,
    pendingFiles,
    setPendingFiles,
    handleUpload,
    clearUploader,
    uploadedFiles,
    setUploadedFiles,
    comentarios,
    setComentarios,
    observaciones,
    setObservaciones,
    handleGuardarComentario,
    handleGuardarObservacion
  }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState(null);
    const eliminarArchivo = async (id) => {
      try {
        const res = await fetch("/api/archivos/eliminar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        const data = await res.json();

        if (data.ok) {
          // Sacarlo del estado local
          setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
        } else {
          console.error("Error eliminando:", data.error);
        }
      } catch (error) {
        console.error("Error eliminando archivo:", error);
      }
    };

    const confirmarEliminacion = () => {
      if (fileToDelete !== null) {
        eliminarArchivo(fileToDelete); 
      }

      setModalOpen(false);  // Cerramos el modal
      setFileToDelete(null); // Limpiamos
    };
    

    if (!Boolean(filtrosCompletos)) {
      return (
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "#e8f5e9",
            borderRadius: 1,
            mt: 2,
          }}
        >
          <BlockIcon sx={{ fontSize: 60, color: "#0c3b74" }} />
          <Typography variant="h6" sx={{ color: "#1d70b8", fontWeight: "bold", mt: 2 }}>
            Sección bloqueada
          </Typography>
          <Typography variant="body2" sx={{ color: "#1d70b8" }}>
            Selecciona todos los filtros para mostrar la sección.
          </Typography>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
          bgcolor: "#e8f5e9",
          p: 3,
          borderRadius: 1,
          mb: 4,
        }}
      >
        {!soloLectura && (
          <BloqueUploader
            pendingFiles={pendingFiles}
            setPendingFiles={setPendingFiles}
            handleUpload={handleUpload}
            clearUploader={clearUploader}
          />
        )}

        {/* Programas Subidos */}
        <Box sx={{ bgcolor: "#81c784", p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Programas Subidos
          </Typography>

          {uploadedFiles.length > 0 ? (
            uploadedFiles.map((file) => (
              <Box
                key={file.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "white",
                  borderRadius: 1,
                  p: 1.2,
                  mb: 1,
                  boxShadow: 1,
                }}
              >
                <InsertDriveFileIcon sx={{ color: "#388e3c", mr: 1 }} />
                <Typography
                  component="a"
                  href={file.url}
                  target="_blank"
                  sx={{
                    flexGrow: 1,
                    textDecoration: "none",
                    color: "#2e7d32",
                  }}
                >
                  {file.name}
                </Typography>

                {!soloLectura && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      setFileToDelete(file.id);
                      setModalOpen(true);
                    }}
                  >
                    ✕
                  </IconButton>
                )}
              </Box>
            ))
          ) : (
            <Typography variant="body2">
              No hay programas subidos aún.
            </Typography>
          )}
        </Box>

        {/* Comentarios */}
        <SeccionTexto
          title="Comentarios"
          value={comentarios}
          onChange={setComentarios}
          placeholder="Escribe aquí los comentarios..."
          onSave={handleGuardarComentario}
          readOnly={soloLectura}
        />

        {/* Observaciones */}
        <SeccionTexto
          title="Observaciones"
          value={observaciones}
          onChange={setObservaciones}
          placeholder="Escribe aquí observaciones..."
          onSave={handleGuardarObservacion}
          readOnly={rol !== 1 || soloLectura}
        />

        <ModalConfirm
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={confirmarEliminacion}
        />
      </Box>
    );
  }