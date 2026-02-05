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
import BloqueUploader from "@/components/BloqueUploader";
import SeccionTexto from "@/components/SeccionTexto";

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

function obtenerTipoPermiso(permisos, filtros) {
  if (!permisos || permisos.length === 0) return 2;

  const match = permisos.find((p) =>
    // Unidad
    (Number(p.UnidadId) === 0 ||
      Number(p.UnidadId) === Number(filtros.unidad)) &&

    // Localidad
    (Number(p.LocalidadId) === 0 ||
      Number(p.LocalidadId) === Number(filtros.localidad)) &&

    // Escuela
    (Number(p.EscuelaId) === 0 ||
      Number(p.EscuelaId) === Number(filtros.escuela)) &&

    // Carrera
    (Number(p.CarreraId) === 0 ||
      Number(p.CarreraId) === Number(filtros.carrera))
  );

  return match ? Number(match.TipoPermiso) : 2;
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

  const [autoLoaded, setAutoLoaded] = React.useState(false);
  const [comentarios, setComentarios] = React.useState("");
  const [observaciones, setObservaciones] = React.useState("");  

  // React.useEffect(() => {
  //   const userData = localStorage.getItem("user");

  //   if (userData) {
  //     const parsedUser = JSON.parse(userData);
  //     console.log("Usuario cargado desde localStorage:", parsedUser);
  //     setUsuario(parsedUser);
  //     setPermisos(parsedUser.permisos);
  //     setRol(parsedUser.rolid);
  //   }
  // }, []);

    React.useEffect(() => {
      const userData = localStorage.getItem("user");

      if (userData) {
        const parsedUser = JSON.parse(userData);
        // console.log("Usuario cargado desde localStorage:", parsedUser);

        setUsuario(parsedUser);
        setRol(parsedUser.rolid);

        if (parsedUser.rolid === 1) {
          const permisosAdmin = [
            {
              UnidadId: 0,
              LocalidadId: 0,
              EscuelaId: 0,
              CarreraId: 0,
              TipoPermiso: 1, 
            },
          ];

          setPermisos(permisosAdmin);
        } else {
          setPermisos(parsedUser.permisos);
        }
      }
    }, []);
  
  
  const { unidades, localidades, escuelas, carreras, modalidades } = useCatalogos();

  React.useEffect(() => {
        // Admin no auto-selecciona
        if (rol === 1) return;

        // Evitar re-ejecuciones
        if (
          autoLoaded ||
          selectedUnidadRegional ||
          !rol ||
          !permisos ||
          !unidades.length
        ) {
          return;
        }

      // Unidad
      const unidadesPermitidas =
        rol === 1
          ? unidades
          : unidades.filter(u =>
              matchPermission(u.value, permisos, "UnidadId")
            );

      if (!unidadesPermitidas.length) return;

      const unidad = unidadesPermitidas[0];
      setSelectedUnidadRegional(unidad.value);

      // Localidad
      const localidadesPermitidas = localidades.filter(loc =>
        loc.UnidadRegionalId === unidad.value &&
        (rol === 1 ||
          matchPermission(loc.value, permisos, "LocalidadId"))
      );

      if (!localidadesPermitidas.length) return;

      const localidad = localidadesPermitidas[0];
      setSelectedLocalidad(localidad.value);

      // Escuela
      const escuelasPermitidas = escuelas.filter(esc =>
        esc.LocalidadId === localidad.value &&
        (rol === 1 ||
          matchPermission(esc.value, permisos, "EscuelaId"))
      );

      if (!escuelasPermitidas.length) return;

      const escuela = escuelasPermitidas[0];
      setSelectedEscuela(escuela.value);

      // Carrera
      const carrerasPermitidas = carreras.filter(car =>
        car.EscuelaId === escuela.value &&
        (rol === 1 ||
          matchPermission(car.value, permisos, "CarreraId"))
      );

      if (!carrerasPermitidas.length) return;

      const carrera = carrerasPermitidas[0];
      setSelectedCarrera(carrera.label);

      // Modalidad
      const modalidad = modalidades.find(
        m => m.value === carrera.ModalidadId
      );

      if (modalidad) {
        setSelectedModalidad(modalidad.value);
      }

    }, [
      rol,
      permisos,
      unidades,
      localidades,
      escuelas,
      carreras,
      modalidades
    ]);

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
        // Debe pertenecer a la unidad seleccionada
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

  const tipoPermiso = obtenerTipoPermiso(permisos, {
    unidad: selectedUnidadRegional,
    localidad: selectedLocalidad,
    escuela: selectedEscuela,
    carrera: carreraSeleccionada?.value,
  });

  const soloLectura = tipoPermiso === 2; // Si es solo lectura o no es admin

  console.log("Tipo Permiso:", tipoPermiso, "Solo Lectura:", soloLectura);

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
        ruta: file.ruta,               
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
      obtenerComentarios();
      obtenerObservaciones();
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

    // guardar comentario
    const handleGuardarComentario = async () => {
      if (!comentarios.trim()) return;

      const res = await fetch("/api/comentarios/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contenido: comentarios,
          unidad: selectedUnidadRegional,
          localidad: selectedLocalidad,
          escuela: selectedEscuela,
          carrera: carreraId,
          modalidad: selectedModalidad,
          usuario: usuarioId,
        }),
      });


        const data = await res.json();

        if (data.success) {
          obtenerComentarios();
        }
    };

    // guardar observacion
    const handleGuardarObservacion = async () => {
      if (!observaciones.trim()) return;

      const res = await fetch("/api/observaciones/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contenido: observaciones,
          unidad: selectedUnidadRegional,
          localidad: selectedLocalidad,
          escuela: selectedEscuela,
          carrera: carreraId,
          modalidad: selectedModalidad,
          usuario: usuarioId,
        }),
      });


      const data = await res.json();

      if (data.success) {
        obtenerObservaciones();
      }
    };

    // obtener comentarios
    const obtenerComentarios = async () => {
      const res = await fetch(
        `/api/comentarios/obtener?unidad=${selectedUnidadRegional}&localidad=${selectedLocalidad}&escuela=${selectedEscuela}&carrera=${carreraId}&modalidad=${selectedModalidad}`
      );

      const data = await res.json();

      if (data.length > 0) {
        setComentarios(data[0].Contenido); // 👈 SOLO STRING
      } else {
        setComentarios("");
      }
    };

    // obtener observaciones
    const obtenerObservaciones = async () => {
      const res = await fetch(
        `/api/observaciones/obtener?unidad=${selectedUnidadRegional}&localidad=${selectedLocalidad}&escuela=${selectedEscuela}&carrera=${carreraId}&modalidad=${selectedModalidad}`
      );

      const data = await res.json();

      if (data.length > 0) {
        setObservaciones(data[0].Contenido); // 👈 SOLO STRING
      } else {
        setObservaciones("");
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
      <Grid container spacing={1} sx={{ background: "linear-gradient(to right, #1d70b8, #0c3b74)", p: 3, borderRadius: 3, mb: 1 }}>
        <Grid item xs={12} sm={2}>
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
        <Grid item xs={12} sm={2}>
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
        <Grid item xs={12} sm={3}>
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
        <Grid item xs={12} sm={2}>
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
        {/* <Grid
          container
          spacing={2}
          alignItems="stretch"
          sx={{
            bgcolor: "#e8f5e9",
            p: 3,
            borderRadius: 0.5,
            outline: "2px solid red",
            mb: 4,
            width: "100%",
            m: 0,           
          }}
        > */}
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
            borderRadius: 0.5,
            mb: 4,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Bloque de selección de archivos */}
        {/* <Grid item xs={12} md={3}> */}
        {!soloLectura && (
          <BloqueUploader
            pendingFiles={pendingFiles}
            setPendingFiles={setPendingFiles}
            handleUpload={handleUpload}
            clearUploader={clearUploader}
          />
        )}
          
        {/* </Grid> */}

          {/* Bloque de archivos subidos */}
          {/* <Grid item xs={12} md={3}> */}
            <Box sx={{ bgcolor: "#81c784", p: 3, borderRadius: 2,alignSelf: "start", }}>
          {/* <Grid item xs={12} md={3}>
            <Box sx={{ bgcolor: "#81c784", p: 3, borderRadius: 2 }}> */}
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
                        {!soloLectura && (
                          <IconButton
                            size="small"
                            sx={{ color: "#e53935" }}
                            // onClick={() => eliminarArchivo(file.id)}
                              onClick={() => {
                                setFileToDelete(file.id);   // Guardamos qué archivo vamos a borrar
                                setModalOpen(true);         // Abrimos el modal
                              }}
                            disabled={soloLectura}
                          >
                            ✕
                          </IconButton>
                        )}
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
          {/* </Grid> */}
          {/* Comentarios */}
          {/* <Grid item xs={12} md={3}> */}
            <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
              <SeccionTexto
                title="Comentarios"
                value={comentarios}
                onChange={setComentarios}
                placeholder="Escribe aquí los comentarios del archivo..."
                onSave={handleGuardarComentario}
                readOnly={soloLectura}
              />
            </Box>
          {/* </Grid> */}

          {/* Observaciones */}
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
              <SeccionTexto
                title="Observaciones"
                value={observaciones}
                onChange={setObservaciones}
                placeholder="Escribe aquí observaciones adicionales..."
                onSave={handleGuardarObservacion}
                readOnly={rol !== 1 || soloLectura}
              />
            </Box>
        </Box>
        </>
        )}
    </Box>
  );
}
