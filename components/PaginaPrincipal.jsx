"use client";
import * as React from "react";
import { Grid, Box,Button, Typography,IconButton,List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import FileUploader from "./FileUploader";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import imagenUas from "../public/Images/logo_uas2.png";
import logoDGES from "../public/Images/logo_dges.png";
import logoVision from "../public/Images/logo_administracion.png";
import Image from "next/image";
import Select from "./Select";
import { unidadesRegionales, facultades, carreras, localidades } from "../data/catalogos";


export default function PaginaPrincipal() {
  const [uploadedFiles, setUploadedFiles] = React.useState([]); // JS puro, sin tipos
  const [pendingFiles, setPendingFiles] = React.useState([]); // Archivos seleccionados pero no subidos
  const [selectedUnidadadRegional, setSelectedUnidadRegional] = React.useState(""); 
  const [selectedLocalidad, setSelectedLocalidad] = React.useState("");
  const [selectedFacultad, setSelectedFacultad] = React.useState("");
  const [selectedCarrera, setSelectedCarrera] = React.useState("");
        

  // 🔹 Función para confirmar subida (simulada)
  const handleUpload = () => {
    setUploadedFiles((prev) => [...prev, ...pendingFiles]);
    setPendingFiles([]);
  };
  
  return (
    <Box sx={{ width: "100%", background: "linear-gradient(to right, #1d70b8, #0c3b74)", m: 0, p: 0 }}>
    {/* Sección superior con logos y texto */}
    <Grid
        container
        alignItems="center"
        sx={{
        background: "linear-gradient(to right, #1d70b8, #0c3b74)",
        p: 0,
        height: "115px", // altura total de la franja superior
        position: "relative", // ¡CLAVE para que el 'absolute' funcione!
        }}
    >
        {/* --- IZQUIERDA: Logo UAS (md={2}) --- */}
        <Grid
        item
        xs={12}
        md={2}
        display="flex"
        justifyContent="flex-start"
        alignItems="stretch"
        sx={{
            pl: 0,
            overflow: "hidden",
        }}
        >
        <Box
            sx={{
            height: "100%",
            display: "flex",
            alignItems: "stretch",
            justifyContent: "center",
            }}
        >
            <Image
            src={imagenUas}
            alt="Logo UAS"
            style={{
                height: "100%",
                width: "auto",
                objectFit: "contain",
            }}
            />
        </Box>
        </Grid>


    {/* --- CENTRO: Texto (md={10}) --- */}
    <Grid
        item
        xs={12}
        md={10} 
        display="flex"
        justifyContent="flex-start"  // **CLAVE 1: Alineamos a la izquierda** para que el texto inicie después del margen
        alignItems="center"
        sx={{ 
            ml: { md: 3 }, // Ajusta este valor (3, 4, 5, etc.) para la separación ideal
            pr: { md: '300px' }, 
            mb:3,
        }} 
        >
        <Box 
            sx={{ 
                color: "white", 
                fontWeight: "bold", 
                // El bloque de texto en sí está alineado a la izquierda
                textAlign: "left", 
                lineHeight: 1.1, 
            }}
        >
            {/* Línea 1: DIRECCIÓN GENERAL DE */}
            <Typography
            variant="h5" // Usamos un tamaño grande
            sx={{
                color: "white",
                fontWeight: "bold",
                textAlign: "left", 
                letterSpacing: 1,
                // Ajuste manual para el tamaño de la primera línea
                fontSize: { xs: '1.3rem', md: '2.0rem' }, 
                lineHeight: 1,
            }}
            >
            DIRECCIÓN GENERAL DE
            </Typography>

            {/* Línea 2: EDUCACIÓN SUPERIOR */}
            <Typography
            variant="h5" // Usamos un tamaño ligeramente menor
            sx={{
                color: "white",
                fontWeight: "bold",
                textAlign: "left", 
                letterSpacing: 1,
                // Ajuste manual para el tamaño de la segunda línea
                fontSize: { xs: '1.3rem', md: '2.0rem' }, 
                lineHeight: 1,
                mt: 0.5, // Pequeño margen superior para separar de la primera línea
            }}
            >
            EDUCACIÓN SUPERIOR
            </Typography>
        </Box>
    </Grid>

    {/* --- DERECHA EXTREMA: GRUPO DGES y VISIÓN (Posicionamiento Absoluto) --- */}
    <Box
      sx={{
        // ** CLAVE: Saca los logos del flujo del Grid **
        position: "absolute",
        right: 10, 
        top: 0,
        height: "100%", 
        display: "flex",
        justifyContent: "flex-end", 
        alignItems: "flex-start", 
      }}
    >
      {/* Contenedor Flex interno para los dos logos */}
      <Box
        sx={{
          display: "flex",
          height: "100%",
          alignItems: "flex-start",
        }}
      >
        {/* Logo DGES */}
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <Image
            src={logoDGES}
            alt="Logo DGES"
            style={{
              height: "100%",
              width: "auto",
              objectFit: "contain",
            }}
          />
        </Box>

        {/* Logo Visión */}
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "flex-start",
            ml: 1, // Pequeño margen para separar de DGES
          }}
        >
          <Image
            src={logoVision}
            alt="Logo Vision"
            style={{
              height: "100%", // Puedes ajustar este porcentaje
              width: "auto",
              objectFit: "contain",
            }}
          />
        </Box>
      </Box>
    </Box>
  </Grid>

  {/* Franja inferior UAS*/}
  <Box
    sx={{
      background: "linear-gradient(to right, #195fa5, #0c3b74)",
      height: "35px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      letterSpacing: "0.8rem",
    }}
  >
    <Typography
      variant="subtitle1"
      sx={{
        color: "white",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "1.8rem",
      }}
    >
      Universidad Autónoma de Sinaloa
    </Typography>
  </Box>

      {/* Bloques 2 */}
      <Grid container spacing={1} sx={{ background: "linear-gradient(to right, #1d70b8, #0c3b74)", p: 3, borderRadius: 3, mb: 1 }}>
        <Grid item xs={12} sm={3}>
          <Box sx={{ bgcolor: "#e9e9f5", p: 2, borderRadius: 2 }}>
                <Select
                    options={unidadesRegionales}
                    value={selectedUnidadadRegional}
                    onChange={(value) => {
                    setSelectedUnidadRegional(value);
                    console.log("Seleccionaste:", value);
                    }}
                    label="Selecciona una unidad regional..."
                />
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box sx={{ bgcolor: "#e9e9f5", p: 2, borderRadius: 2 }}>
                <Select
                    options={localidades}
                    value={selectedLocalidad}
                    onChange={(value) => {
                    setSelectedLocalidad(value);
                    console.log("Seleccionaste:", value);
                    }}
                    label="Selecciona una localidad..."
                />
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box sx={{ bgcolor: "#e9e9f5", p: 2, borderRadius: 2 }}>
                <Select
                    options={facultades}
                    value={selectedFacultad}
                    onChange={(value) => {
                    setSelectedFacultad(value);
                    console.log("Seleccionaste:", value);
                    }}
                    label="Selecciona una facultad..."
                />
          </Box>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box sx={{ bgcolor: "#e9e9f5", p: 2, borderRadius: 2 }}>
                <Select
                    options={carreras}
                    value={selectedCarrera}
                    onChange={(value) => {
                    setSelectedCarrera(value);
                    console.log("Seleccionaste:", value);
                    }}
                    label="Selecciona una carrera..."
                />
          </Box>
        </Grid>
      </Grid>

      {/* Bloques 3 */}
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
            console.log("Archivos seleccionados:", files);
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

    </Box>
  );
}
