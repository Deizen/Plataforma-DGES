"use client";

import * as React from "react";
import { Grid, Box,Button, Typography,IconButton,List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
//import FileUploader from "./FileUploader";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import BlockIcon from "@mui/icons-material/Block";
import Select from "./Select";
import Modal from "@/components/ModalConfirm"
import { useCatalogos } from "@/hooks/useCatalogos"; 
import dynamic from "next/dynamic";
import BloqueUploader from "@/components/BloqueUploader";
import SeccionTexto from "@/components/SeccionTexto";
import CargaArchivosSemestre from "@/components/CargaArchivosSemestre";
import TablaUnidadesSemestre from "@/components/TablaUnidadesSemestre";
import Trayectorias from "@/components/Trayectorias";
import BloqueSeccion from "@/components/BloqueSeccion";

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
// export default function PaginaPrincipal() {
export default function PaginaPrincipal({ tipoModulo = "archivos" }) {
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
  const [selectedSemestre, setSelectedSemestre] = React.useState("");

  const [clearUploader, setClearUploader] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [fileToDelete, setFileToDelete] = React.useState(null);
       
  const [usuario, setUsuario] = React.useState(null);
  const [permisos, setPermisos] = React.useState(null);
  const [rol, setRol] = React.useState(null);

  const [autoLoaded, setAutoLoaded] = React.useState(false);
  const [comentarios, setComentarios] = React.useState("");
  const [observaciones, setObservaciones] = React.useState("");  

  const semestresCarrera = [
    { label: "Semestre 6", value: 6 },
    ];

    React.useEffect(() => {
      const userData = localStorage.getItem("user");

      if (userData) {
        const parsedUser = JSON.parse(userData);

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

   .reduce((acc, car) => {
     const modalidad = modalidades.find(m => m.value === car.ModalidadId);
     if (modalidad) acc[modalidad.value] = modalidad;  
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
        setObservaciones(data[0].Contenido); 
      } else {
        setObservaciones("");
      }
    };

    const confirmarEliminacion = () => {
      if (fileToDelete !== null) {
        eliminarArchivo(fileToDelete); 
      }

      setModalOpen(false);  // Cerramos el modal
      setFileToDelete(null); // Limpiamos
    };

    const camposSeleccionados = {
      unidad: selectedUnidadRegional,
      localidad: selectedLocalidad,
      escuela: selectedEscuela,
      carrera: selectedCarrera,
      modalidad: selectedModalidad,
    };

    const filtrosCompletos = Object.values(camposSeleccionados).every(v => v);
    
    const cardStyle = {
      bgcolor: "rgba(255,255,255,0.95)",
      p: 2.5,
      borderRadius: 3,
      boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-3px)",
        boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
      },
    };

  return (
    <Box sx={{ width: "100%", background: "linear-gradient(to right, #1d70b8, #0c3b74)", m: 0, p: 0 }}>
      <Box
        sx={{
          width: "100%",
          background: "linear-gradient(to right, #1d70b8, #0c3b74)",
          position: "relative",
        }}
      >
        {/* ===== RENGLÓN 1 ========= */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            backdropFilter: "blur(6px)",
            background: "linear-gradient(to right, #1d70b8, #0c3b74)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          <Grid container spacing={3} sx={{ p: 3 }}>
            <Grid item xs={12} md={4}>
              <Box sx={cardStyle}>
                <Select
                  options={filteredUnidades}
                  value={selectedUnidadRegional}
                  onChange={(value) => {
                    setSelectedUnidadRegional(value);
                    setSelectedLocalidad("");
                    setSelectedEscuela("");
                    setSelectedCarrera("");
                    setSelectedModalidad("");
                    setSelectedSemestre("");
                  }}
                  label="Selecciona una unidad regional..."
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={cardStyle}>
                <Select
                  options={filteredLocalidades}
                  value={selectedLocalidad}
                  onChange={(value) => {
                    setSelectedLocalidad(value);
                    setSelectedEscuela("");
                    setSelectedCarrera("");
                    setSelectedModalidad("");
                    setSelectedSemestre("");
                  }}
                  label="Selecciona una localidad..."
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={cardStyle}>
                <Select
                  options={filteredEscuelas}
                  value={selectedEscuela}
                  onChange={(value) => {
                    setSelectedEscuela(value);
                    setSelectedCarrera("");
                    setSelectedModalidad("");
                    setSelectedSemestre("");
                  }}
                  label="Selecciona una facultad..."
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* ========================= */}
        {/* ===== RENGLÓN 2 ========= */}
        {/* ========================= */}
        <Box
          sx={{
            overflow: "hidden",
            transition: "all 0.4s ease",
            opacity: selectedEscuela ? 1 : 0,
            transform: selectedEscuela
              ? "translateY(0px)"
              : "translateY(-15px)",
            maxHeight: selectedEscuela ? "500px" : "0px",
          }}
        >
          <Grid container spacing={3} sx={{ px: 3, pb: 4 }}>
            <Grid item xs={12} md={4}>
              <Box sx={cardStyle}>
                <Select
                  options={carrerasUnicas}
                  value={selectedCarrera}
                  onChange={(value) => {
                    setSelectedCarrera(value);
                    setSelectedModalidad("");
                    setSelectedSemestre("");
                  }}
                  label="Selecciona una carrera..."
                />
              </Box>
            </Grid>

            {selectedCarrera && (
              <>
                <Grid item xs={12} md={4}>
                  <Box sx={cardStyle}>
                    <Select
                      options={modalidadesCarrera}
                      value={selectedModalidad}
                      onChange={(value) => {
                        setSelectedModalidad(value);
                        setUploadedFiles([]);
                      }}
                      label="Selecciona una modalidad..."
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box sx={cardStyle}>
                    <Select
                      options={semestresCarrera}
                      value={selectedSemestre}
                      onChange={(value) => {
                        setSelectedSemestre(value);
                      }}
                      label="Selecciona un semestre..."
                    />
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </Box>

      {/* Bloque 3 */}
        <BloqueSeccion
          visible={
            !carreraId ||
            !selectedModalidad ||
            !selectedSemestre
          }
        />

        {/* TABLA */}
        {carreraId && selectedModalidad && selectedSemestre && (
          <>
            {tipoModulo === "archivos" && (
              <TablaUnidadesSemestre
                carreraId={carreraId}
                modalidadId={selectedModalidad}
                semestreId={selectedSemestre}
                tipoPermiso={tipoPermiso}
                esAdmin={rol === 1}
              />
            )}

            {(tipoModulo === "planDesarrollo" ||
              tipoModulo === "planeacion") && (
                <CargaArchivosSemestre
                  filtrosCompletos={
                    carreraId &&
                    selectedModalidad &&
                    selectedSemestre
                  }
                  soloLectura={soloLectura}
                  rol={rol}
                  pendingFiles={pendingFiles}
                  setPendingFiles={setPendingFiles}
                  handleUpload={handleUpload}
                  clearUploader={clearUploader}
                  uploadedFiles={uploadedFiles}
                  setUploadedFiles={setUploadedFiles}
                  comentarios={comentarios}
                  setComentarios={setComentarios}
                  observaciones={observaciones}
                  setObservaciones={setObservaciones}
                  handleGuardarComentario={handleGuardarComentario}
                  handleGuardarObservacion={handleGuardarObservacion}
                  confirmarEliminacion={confirmarEliminacion}
                />

            )}
            {tipoModulo === "trayectorias" && (
              <Trayectorias
                filtrosCompletos={
                  carreraId &&
                  selectedModalidad &&
                  selectedSemestre
                }
                soloLectura={soloLectura}
              />
            )}
          </>
        )}

        {/* {carreraId && selectedModalidad && selectedSemestre && (
          <TablaUnidadesSemestre
            carreraId={carreraId}
            modalidadId={selectedModalidad}
            semestreId={selectedSemestre}
            tipoPermiso={tipoPermiso}
            esAdmin={rol === 1}
          />
        )} */}
     {/* {selectedSemestre && (
        <TablaUnidadesSemestre
          carreraId={carreraId}
          modalidadId={selectedModalidad}
          semestreId={selectedSemestre}
          tipoPermiso={tipoPermiso}
          esAdmin={rol === 1}
        />
      )} */}
    </Box>
  );
}
