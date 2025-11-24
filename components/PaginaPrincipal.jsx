"use client";

import * as React from "react";
import { Grid, Box,Button, Typography,IconButton,List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import FileUploader from "./FileUploader";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import BlockIcon from "@mui/icons-material/Block";
import imagenUas from "../public/images/logo_uas2.png";
import logoDGES from "../public/images/logo_dges.png";
import logoVision from "../public/images/logo_administracion.png";
import Image from "next/image";
import Select from "./Select";
import { dumy, facultades, carreras, localidades } from "../data/catalogos2";
// import { obtenerUnidadesRegionales } from "@/data/catalogos";
import { useCatalogos } from "@/hooks/useCatalogos"; // Para traer los 4 catalogos
// import { fetchCatalogo } from "@/lib/fetchCatalogo";
import Header from "./Header";


export default function PaginaPrincipal() {

  // const [unidadesRegionales, setUnidadesRegionales] = React.useState([]); // Datos cargados desde el servidor
  
  const [uploadedFiles, setUploadedFiles] = React.useState([]); // JS puro, sin tipos
  const [pendingFiles, setPendingFiles] = React.useState([]); // Archivos seleccionados pero no subidos

    const [selectedUnidadadRegional, setSelectedUnidadRegional] = React.useState(""); 
    const [selectedLocalidad, setSelectedLocalidad] = React.useState("");
    const [selectedEscuela, setSelectedEscuela] = React.useState("");
    const [selectedCarrera, setSelectedCarrera] = React.useState("");
    const [selectedModalidad, setSelectedModalidad] = React.useState(""); 
        
    
  const { unidades, localidades, escuelas, carreras, modalidades } = useCatalogos();

  const filteredLocalidades = localidades.filter(
    (loc) => loc.UnidadRegionalId  === selectedUnidadadRegional
  );

  const filteredEscuelas = escuelas.filter(
    (esc) => esc.LocalidadId === selectedLocalidad
  );

  const filteredCarreras = carreras.filter(
    (car) => car.EscuelaId === selectedEscuela
  );
  
  const carrerasUnicas = Object.values(
    filteredCarreras.reduce((acc, car) => {
      acc[car.label] = { 
        label: car.label, 
        value: car.label 
      };
      return acc;
    }, {})
  );

  // const modalidadesCarrera = filteredCarreras
  // .filter(car => car.label === selectedCarrera)
  // .map(car => modalidades.find(m => m.value === car.ModalidadId));

  const modalidadesCarrera = Object.values(
  filteredCarreras
    .filter(car => car.label === selectedCarrera)
   //.map(car => modalidades.find(m => m.value === car.ModalidadId))
   // Aquí pueden haber duplicados
   .reduce((acc, car) => {
     const modalidad = modalidades.find(m => m.value === car.ModalidadId);
     if (modalidad) acc[modalidad.value] = modalidad;  // ← evita duplicados
     return acc;
   }, {})
);


  const carreraSeleccionada = filteredCarreras.find(
    (car) => car.label === selectedCarrera && car.ModalidadId === selectedModalidad
  );

  const carreraId = carreraSeleccionada?.value; // este es el ID de la carrera

  // 🔹 Función para confirmar subida (simulada) --Cosas de archivo
  const handleUpload = async () => {
    const formData = new FormData();

    pendingFiles.forEach((item) => {
      formData.append("files", item.file);
    });

    // 1️⃣ Subir archivo físicamente al servidor
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
      carrera: carreraId,
          modalidad: selectedModalidad,
    });

    const result = await res.json(); 
    // result.files = [{ fileName, filePath }]

    // 2️⃣ Guardar cada archivo en MySQL
    for (const file of result.files) {
      await fetch("/api/archivos/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: file.name,
          ruta: file.url, // ej: "/uploads/archivo.pdf"
          unidad: selectedUnidadadRegional,
          localidad: selectedLocalidad,
          escuela: selectedEscuela,
          carrera: carreraId,
          modalidad: selectedModalidad,
          usuario: 1111, // ID de usuario fijo por ahora
        }),
      });
    }


    // 3️⃣ Actualizar UI
    setUploadedFiles((prev) => [...prev, ...result.files]);
    setPendingFiles([]);
  };

  React.useEffect(() => {
    if (
      selectedUnidadadRegional &&
      selectedLocalidad &&
      selectedEscuela &&
      selectedCarrera &&
      selectedModalidad &&
      carreraId
    ) {
      // ahora sí llamar al backend
      cargarArchivosSubidos();
    }
  }, [
    selectedUnidadadRegional,
    selectedLocalidad,
    selectedEscuela,
    selectedCarrera,
    selectedModalidad,
    carreraId
  ]);

  // 🔹 Función para cargar archivos ya subidos desde el servidor
  const cargarArchivosSubidos = async () => {
    try {
      const res = await fetch("/api/archivos/obtener", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unidad: selectedUnidadadRegional,
          localidad: selectedLocalidad,
          escuela: selectedEscuela,
          carrera: carreraId,
          modalidad: selectedModalidad,
        }),
      });

      const data = await res.json();
      if (data.error) {
        console.error("Error:", data.error);
        return;
      }

      // Transformar archivos a lo que usa tu frontend
      const mapped = data.archivos.map((a) => ({
        id: a.Id,
        name: a.Nombre,
        url: a.Ruta,
      }));

      setUploadedFiles(mapped);
      setPendingFiles([]);
    } catch (error) {
      console.error("❌ Error cargando archivos:", error);
    }
  };

  return (
    <Box sx={{ width: "100%", background: "linear-gradient(to right, #1d70b8, #0c3b74)", m: 0, p: 0 }}>
      <Header />
      {/* Bloques 2 */}
      <Grid container spacing={1} sx={{ background: "linear-gradient(to right, #1d70b8, #0c3b74)", p: 3, borderRadius: 3, mb: 1 }}>
        <Grid item xs={12} sm={3}>
          <Box sx={{ bgcolor: "#e9e9f5", p: 2, borderRadius: 2 }}>
                <Select
                    options={unidades}
                    value={selectedUnidadadRegional}
                    onChange={(value) => {
                    setSelectedUnidadRegional(value);
                    setSelectedLocalidad(""); // reset siguientes niveles
                    setSelectedEscuela("");
                    setSelectedCarrera("");
                    }}
                    label="Selecciona una unidad regional..."
                />
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box sx={{ bgcolor: "#e9e9f5", p: 2, borderRadius: 2 }}>
                <Select
                    options={filteredLocalidades}
                    value={selectedLocalidad}
                    onChange={(value) => {
                    setSelectedLocalidad(value);
                    setSelectedEscuela("");
                    setSelectedCarrera("");
                    }}
                    label="Selecciona una localidad..."
                />
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box sx={{ bgcolor: "#e9e9f5", p: 2, borderRadius: 2 }}>
                <Select
                    options={filteredEscuelas}
                    value={selectedEscuela}
                    onChange={(value) => {
                    setSelectedEscuela(value);
                    setSelectedCarrera("");
                    }}
                    label="Selecciona una facultad..."
                />
          </Box>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box sx={{ bgcolor: "#e9e9f5", p: 2, borderRadius: 2 }}>
                <Select
                    options={carrerasUnicas}
                    value={selectedCarrera}
                    onChange={(value) => {
                    setSelectedCarrera(value);
                    setSelectedModalidad("");
                    }}
                    label="Selecciona una carrera..."
                />
          </Box>
        </Grid>
        <Grid item xs={12} sm={5}>
          {selectedCarrera ? (
            <Box sx={{ bgcolor: "#e9e9f5", p: 2, borderRadius: 2 }}>
                <Select
                    options={modalidadesCarrera}
                    value={selectedModalidad}
                    onChange={(value) => {
                      setSelectedModalidad(value);
                      setUploadedFiles([]); // Limpia inmediatamente
                    }}
                    label="Selecciona una modalidad..."
                />
            </Box>
          ) : null}
        </Grid>
      </Grid>

      {/* Bloques 3 */}
      {!selectedModalidad ? (
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "#e8f5e9",
            borderRadius: 0.5,
            mt: 2,
          }}
        >
          <BlockIcon sx={{ fontSize: 60, color: "#0c3b74" }} />
          <Typography variant="h6" sx={{ color: "#1d70b8", fontWeight: "bold", mt: 2 }}>
            Sección bloqueada
          </Typography>
          <Typography variant="body2" sx={{ color: "#1d70b8" }}>
            Selecciona todos los filtros para mostrar la sección de archivos.
          </Typography>
        </Box>
      ) : (
        <>
        <Grid
          container
          spacing={2}
          sx={{ bgcolor: "#e8f5e9", p: 3, borderRadius: 0.5, mb: 4   }}
        >

          {/* 🟢 Bloque de selección de archivos */}
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              bgcolor: "#66bb6a",
              p: 3,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              textAlign: "center",
            }}
          >
            {/* 📁 Uploader (solo selección, no subida automática) */}
            <FileUploader
              showFiles={false}
              onUpload={(files) => {
                setPendingFiles(files); // guarda temporalmente
              }}
            />

            {/* 🗂️ Lista de archivos listos para subir */}
            {pendingFiles.length > 0 && (
              <Box
                sx={{
                  width: "100%",
                  mt: 2,
                  bgcolor: "rgba(255,255,255,0.2)",
                  borderRadius: 2,
                  p: 1,
                }}
              >
                <Typography variant="subtitle2" sx={{ color: "#fff", mb: 1 }}>
                  Archivos listos para subir:
                </Typography>
                <List dense>
                  {pendingFiles.map((file, index) => (
                    <ListItem key={index} sx={{ color: "#fff" }}>
                      <ListItemIcon>
                        <InsertDriveFileIcon sx={{ color: "#2e7d32" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={file.name}
                        primaryTypographyProps={{
                          fontSize: 13,
                          sx: { color: "#fff", wordBreak: "break-all" },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* 🟢 Botón separado (activo solo si hay archivos) */}
            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                py: 1.2,
                fontWeight: "bold",
                bgcolor: pendingFiles.length > 0 ? "#2e7d32" : "#9e9e9e",
                boxShadow: pendingFiles.length > 0 ? "0px 0px 10px rgba(46,125,50,0.6)" : "none",
                transform: pendingFiles.length > 0 ? "scale(1.03)" : "scale(1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: pendingFiles.length > 0 ? "#1b5e20" : "#9e9e9e",
                  transform: pendingFiles.length > 0 ? "scale(1.06)" : "scale(1)",
                },
              }}
              disabled={pendingFiles.length === 0}
              onClick={handleUpload}
            >
              Subir Archivos
            </Button>
          </Box>
        </Grid>

          {/* 🟢 Bloque de archivos subidos */}
          <Grid item xs={12} md={6}>
            <Box sx={{ bgcolor: "#81c784", p: 3, borderRadius: 2 }}>
              <Typography variant="h5" fontWeight="bold" mb={2}>
                Archivos Subidos
              </Typography>

              {uploadedFiles.length > 0 ? (
                <Box
                  component="ul"
                  sx={{
                    listStyle: "none",
                    m: 0,
                    p: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  {uploadedFiles.map((file, index) => (
                    <Box
                      key={index}
                      component="li"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        bgcolor: "white",
                        borderRadius: 1,
                        p: 1.2,
                        boxShadow: 1,
                        transition: "0.3s",
                        "&:hover": {
                          bgcolor: "#f1f8e9",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <InsertDriveFileIcon sx={{ color: "#388e3c", mr: 1 }} />
                      <Typography
                        component="a"
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: "#2e7d32",
                          textDecoration: "none",
                          fontWeight: 500,
                          flexGrow: 1,
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        {file.name}
                      </Typography>
                      <IconButton
                        size="small"
                        sx={{ color: "#e53935" }}
                        onClick={() =>
                          setUploadedFiles((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                      >
                        ✕
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2">
                  No hay archivos subidos aún.
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
        </>
        )}
    </Box>
  );
}
