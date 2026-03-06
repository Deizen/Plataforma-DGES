"use client";

import { useState } from "react";
import * as React from "react";
import Header from "@/components/Header";
import Registro from "@/components/Registro";
import Archivos from "@/components/PaginaPrincipal";
import Directorio from "@/components/Directorio";

import { Box, Button } from "@mui/material";

type Modulo =
  | "archivos" // Programa de Estudios
  | "planDesarrollo" // Plan de desarrollo
  | "planeacion" // Planeación Docente
  | "trayectorias" 
  | "directorio"
  | "registro";

export default function Principal() {
  const [modulo, setModulo] = useState<Modulo>("planeacion");
  const [rol, setRol] = React.useState<number | null>(null);

  React.useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      const parsedUser = JSON.parse(userData);
      setRol(parsedUser.rolid);
    }
  }, []);

  return (
    <Box>
      {/* Header global */}
      <Header />

      {/* Menú de navegación interno */}
      <Box
        sx={{
          background: "linear-gradient(to right, #1d70b8, #0c3b74)",
          padding: "10px 20px",
          display: "flex",
          gap: "5px",
          fontSize: "1.05rem",
          fontWeight: 500,
        }}
      >
        {rol === 1 ? (
          <>
            <Button
              onClick={() => setModulo("archivos")}
              sx={{
                color: "white",
                position: "relative",
                backgroundColor:
                  modulo === "archivos" ? "rgba(255,255,255,0.15)" : "transparent",
                borderBottom:
                  modulo === "archivos" ? "3px solid #81c784" : "3px solid transparent",
                borderRadius: 1,
                transition: "0.3s",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.15)",
                },
              }}
            >
              Programa de Estudios
            </Button>

            <Button
              onClick={() => setModulo("planDesarrollo")}
              sx={{
                color: "white",
                backgroundColor:
                  modulo === "planDesarrollo"
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",
                borderBottom:
                  modulo === "planDesarrollo"
                    ? "3px solid #81c784"
                    : "3px solid transparent",
                borderRadius: 1,
                transition: "0.3s",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.15)",
                },
              }}
            >
              Plan de desarrollo
            </Button>

            <Button
              onClick={() => setModulo("planeacion")}
              sx={{
                color: "white",
                backgroundColor:
                  modulo === "planeacion"
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",
                borderBottom:
                  modulo === "planeacion"
                    ? "3px solid #81c784"
                    : "3px solid transparent",
                borderRadius: 1,
                transition: "0.3s",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.15)",
                },
              }}
            >
              Planeación Docente
            </Button>

            <Button
              onClick={() => setModulo("trayectorias")}
              sx={{
                color: "white",
                backgroundColor:
                  modulo === "trayectorias"
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",
                borderBottom:
                  modulo === "trayectorias"
                    ? "3px solid #81c784"
                    : "3px solid transparent",
                borderRadius: 1,
                transition: "0.3s",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.15)",
                },
              }}
            >
              Trayectorias
            </Button>

            <Button
              onClick={() => setModulo("directorio")}
              sx={{
                color: "white",
                backgroundColor:
                  modulo === "directorio"
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",
                borderBottom:
                  modulo === "directorio"
                    ? "3px solid #81c784"
                    : "3px solid transparent",
                borderRadius: 1,
                transition: "0.3s",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.15)",
                },
              }}
            >
              Directorio
            </Button>

            <Button
              onClick={() => setModulo("registro")}
              sx={{
                color: "white",
                backgroundColor:
                  modulo === "registro"
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",
                borderBottom:
                  modulo === "registro"
                    ? "3px solid #81c784"
                    : "3px solid transparent",
                borderRadius: 1,
                transition: "0.3s",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.15)",
                },
              }}
            >
              Registrar Usuario
            </Button>
          </>
        ) : null}
      </Box>

      {/* Contenido dinámico */}
      <Box sx={{ paddingTop: "5px", background: "white" }}>
        {modulo === "archivos" && (
          <Archivos tipoModulo="archivos" />
        )}

        {modulo === "planDesarrollo" && (
          <Archivos tipoModulo="planDesarrollo" />
        )}

        {modulo === "planeacion" && (
          <Archivos tipoModulo="planeacion" />
        )}

        {modulo === "trayectorias" && (
          <Archivos tipoModulo="trayectorias" />
        )}
        {modulo === "directorio" && <Directorio />}

        {modulo === "registro" && <Registro />}
      </Box>
    </Box>
  );
}
