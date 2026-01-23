"use client";

import * as React from "react";
import { Grid, Box,Button, Typography,IconButton,List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
//import FileUploader from "./FileUploader";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import BlockIcon from "@mui/icons-material/Block";
import Select from "./Select";
import Modal from "@/components/Modal"
import { useCatalogos } from "@/hooks/useCatalogos"; 
import dynamic from "next/dynamic";



import { useAuth } from "@/hooks/useAuth";
import { permission } from "process";

function matchPermission(value, permisosArray, field) {
  // Admin → ve todo
  if (!permisosArray || permisosArray.length === 0) return true;

  // Extraemos los valores permitidos del campo (UnidadId, LocalidadId, ...)
  const permittedValues = permisosArray.map(p => p[field]);

  // Si contiene 0 → puede ver todo ese nivel
  if (permittedValues.includes(0)) return true;

  // Ver si el valor actual está dentro de lo permitido
  return permittedValues.includes(value);
}

export default function PaginaPrincipal() {
  // const [unidadesRegionales, setUnidadesRegionales] = React.useState([]); // Datos cargados desde el servidor
  const FileUploader = dynamic(() => import("./FileUploader"), {
    ssr: false,
  });

  const [uploadedFiles, setUploadedFiles] = React.useState([]); // JS puro, sin tipos
  const [pendingFiles, setPendingFiles] = React.useState([]); // Archivos seleccionados pero no subidos

  const [selectedUnidadRegional, setSelectedUnidadRegional] = React.useState(""); 
  const [selectedLocalidad, setSelectedLocalidad] = React.useState("");
  const [selectedEscuela, setSelectedEscuela] = React.useState("");
  const [selectedCarrera, setSelectedCarrera] = React.useState("");
  const [selectedModalidad, setSelectedModalidad] = React.useState(""); 

  const [clearUploader, setClearUploader] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [fileToDelete, setFileToDelete] = React.useState(null);
       
  const [usuario, setUsuario] = React.useState(null);
  const [permisos, setPermisos] = React.useState(null);
  const [rol, setRol] = React.useState(null);

  React.useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUsuario(parsedUser);
      setPermisos(parsedUser.permisos);
      setRol(parsedUser.rolid);
    }
  }, []);

  
  const { unidades, localidades, escuelas, carreras, modalidades } = useCatalogos();

  // Unidades
  const filteredUnidades = rol === 1
    ? unidades
    : unidades.filter(u => matchPermission(u.value , permisos, "UnidadId"));

  // Localidades
const filteredLocalidades =
  rol === 1
    ? localidades.filter(loc =>
        selectedUnidadRegional
          ? loc.UnidadRegionalId === selectedUnidadRegional
          : true
      )
    : localidades.filter(loc =>
        // 1Debe pertenecer a la unidad seleccionada
        (!selectedUnidadRegional ||
          loc.UnidadRegionalId === selectedUnidadRegional) &&
        // Debe estar en los permisos
        matchPermission(loc.value, permisos, "LocalidadId")
      );

  //Escuelas
const filteredEscuelas =
  rol === 1
    ? escuelas.filter(esc =>
        selectedLocalidad
          ? esc.LocalidadId === selectedLocalidad
          : true
      )
    : escuelas.filter(esc =>
        (!selectedLocalidad ||
          esc.LocalidadId === selectedLocalidad) &&
        matchPermission(esc.value, permisos, "EscuelaId")
      );

  //Carreras
const filteredCarreras =
  rol === 1
    ? carreras.filter(car =>
        selectedEscuela
          ? car.EscuelaId === selectedEscuela
          : true
      )
    : carreras.filter(car =>
        (!selectedEscuela ||
          car.EscuelaId === selectedEscuela) &&
        matchPermission(car.value, permisos, "CarreraId")
      );

  // const modalidadesCarrera = filteredCarreras
  // .filter(car => car.label === selectedCarrera)
  // .map(car => modalidades.find(m => m.value === car.ModalidadId));

  const carrerasUnicas = Object.values(
    filteredCarreras.reduce((acc, car) => {
      acc[car.label] = { 
        label: car.label, 
        value: car.label 
      };
      return acc;
    }, {})
  );

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
  const usuarioId = usuario?.usuario;

  // Función para subir y guardar archivos
  const handleUpload = async () => {
  const formData = new FormData();
    
  pendingFiles.forEach((item) => {
    formData.append("files", item.file);
  });


  // Subir archivo físicamente al servidor
  const uploadRes = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const uploadResult = await uploadRes.json();
  const archivosConID = [];

  // Guardar cada archivo en MySQL y obtener su ID
  for (const file of uploadResult.files) {
    const saveRes = await fetch("/api/archivos/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: file.nombreOriginal,   // usar el nombre real
        ruta: file.ruta,               // "uploads/..."
        unidad: selectedUnidadRegional,
        localidad: selectedLocalidad,
        escuela: selectedEscuela,
        carrera: carreraId,
        modalidad: selectedModalidad,
        usuario: usuarioId,
      }),
    });

    const saved = await saveRes.json();

      archivosConID.push({
        id: saved.id,
        name: file.nombreOriginal,
        url: `/api/archivos/descargar?ruta=${encodeURIComponent(file.ruta)}`
      });
  }

    // Actualizar UI
    setUploadedFiles((prev) => [...prev, ...archivosConID]);
    setPendingFiles([]);
      
    // LIMPIAR FILEUPLOADER
    setClearUploader(true);
    setTimeout(() => setClearUploader(false), 50);
  };

  // Funcionalidad para recargar archivos al cambiar filtros
  React.useEffect(() => {
    if (
      selectedUnidadRegional   &&
      selectedLocalidad &&
      selectedEscuela &&
      selectedCarrera &&
      selectedModalidad &&
      carreraId
    ) {
      // Esta parte llama al backend
      cargarArchivosSubidos();
    }
  }, [
    selectedUnidadRegional,
    selectedLocalidad,
    selectedEscuela,
    selectedCarrera,
    selectedModalidad,
    carreraId
  ]);

  // Función para cargar archivos ya subidos desde el servidor
  const cargarArchivosSubidos = async () => {
    try {
      const res = await fetch("/api/archivos/obtener", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unidad: selectedUnidadRegional,
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

      const mapped = data.archivos.map(a => ({
        id: a.Id,
        name: a.Nombre,
        url: `/api/archivos/descargar?ruta=${encodeURIComponent(a.Ruta)}`
      }));

      // // Transformar archivos a lo que usa tu frontend
      // const mapped = data.archivos.map((a) => ({
      //   id: a.Id,
      //   name: a.Nombre,
      //   url: a.Ruta,
      // }));

      setUploadedFiles(mapped);
      setPendingFiles([]);
    } catch (error) {
      console.error("Error cargando archivos:", error);
    }
  };

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
        eliminarArchivo(fileToDelete); // Ejecuta tu API
      }

      setModalOpen(false);  // Cerramos el modal
      setFileToDelete(null); // Limpiamos
    };

  return (
    <Box sx={{ width: "100%", background: "linear-gradient(to right, #1d70b8, #0c3b74)", m: 0, p: 0 }}>
      {/* Bloques 2 */}
      <Grid container spacing={1} sx={{ background: "linear-gradient(to right, #1d70b8, #0c3b74)", p: 3, borderRadius: 3, mb: 1 }}>
        <Grid item xs={12} sm={3}>
          <Box sx={{ bgcolor: "#e9e9f5", p: 2, borderRadius: 2 }}>
                <Select
                    options={filteredUnidades}
                    value={selectedUnidadRegional}
                    onChange={(value) => {
                    setSelectedUnidadRegional(value);
                    setSelectedLocalidad(""); // reset siguientes niveles
                    setSelectedEscuela("");
                    setSelectedCarrera("");
                    setSelectedModalidad("");
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
                    setSelectedModalidad("");
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
                    setSelectedModalidad("");
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

          {/* Bloque de selección de archivos */}
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
            {/*Uploader (solo selección, no subida automática) */}
            <FileUploader
              showFiles={false}
              clearSignal={clearUploader}
              onUpload={(files) => {
                setPendingFiles(files); // guarda temporalmente
              }}
            />

            {/* Lista de archivos listos para subir */}
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

            {/* Botón separado (activo solo si hay archivos) */}
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

          {/* Bloque de archivos subidos */}
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
                          // onClick={() => eliminarArchivo(file.id)}
                            onClick={() => {
                              setFileToDelete(file.id);   // Guardamos qué archivo vamos a borrar
                              setModalOpen(true);         // Abrimos el modal
                            }}
                        >
                          ✕
                        </IconButton>
                        <Modal
                          open={modalOpen}
                          onClose={() => setModalOpen(false)}
                          onConfirm={confirmarEliminacion}
                          fileName={uploadedFiles.find(f => f.id === fileToDelete)?.nombre}
                        />
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
