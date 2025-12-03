"use client";

import { useState } from "react";
import * as React from "react";
import Header from "@/components/Header";
import Registro from "@/components/RegistroUsuarios";
import Archivos from "@/components/PaginaPrincipal";
import { Box, Button } from "@mui/material";

export default function Principal() {
  const [modulo, setModulo] = useState<"archivos" | "registro">("archivos");
    const [rol, setRol] = React.useState(null);
  
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
          fontSize: "1.1rem",
          fontWeight: 500,
          color: "white", // Esto aplica al texto dentro de Box
            "& .MuiButton-root": {
            color: "white", // Esto fuerza que los botones tengan texto blanco
    },
        }}
      >
        {rol===1?
        <>
          <Button onClick={() => setModulo("archivos")}>Archivos</Button>
          <Button onClick={() => setModulo("registro")}>Registrar Usuario</Button>
          </>
          :null
        }
        

      </Box>

      {/* Contenido dinámico */}
      <Box sx={{ paddingTop: "5px", background: "white" }}>
        {modulo === "archivos" && <Archivos />}
        {modulo === "registro" && <Registro />}
      </Box>
    </Box>
  );
}