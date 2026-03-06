"use client";

import {
  Box,
  Typography,
  IconButton,
  TextField,
  Chip,
  Collapse,
  Divider
} from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { useState, useEffect } from "react";

const Campo = ({ titulo, children }) => (

  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 0.5
    }}
  >

        <Typography
        variant="caption"
        sx={{
            fontWeight: 700,
            color: "#333",
            fontSize: "0.8rem",
            letterSpacing: "0.3px"
        }}
        >
        {titulo}
        </Typography>

    {children}

  </Box>

);

export default function TablaTrayectorias({
  carreraId,
  modalidadId,
  semestreId,
  tipoPermiso,
}) {

  const [rows, setRows] = useState([]);
  const [guardados, setGuardados] = useState({});
  const [openRows, setOpenRows] = useState({});

  const soloLectura = tipoPermiso === 2;

  const toggleRow = (id) => {
    setOpenRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {

    const cargar = async () => {

      const res = await fetch("/api/trayectorias/obtener", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          carreraId,
          modalidadId,
          semestreId
        })
      });

      const data = await res.json();

      setRows(data);
      setGuardados({});

    };

    if (carreraId && modalidadId && semestreId) {
      cargar();
    }

  }, [carreraId, modalidadId, semestreId]);



  const handleChange = (index, field, value) => {

    const updated = [...rows];

    updated[index][field] = value;

    setRows(updated);

    setGuardados(prev => ({
      ...prev,
      [updated[index].Id]: false
    }));

  };



  const guardarFila = async (row) => {

    await fetch("/api/trayectorias/guardar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        materiaId: row.Id,
        carreraId,
        modalidadId,
        semestreId,

        totalAlumnos: row.TotalAlumnos,
        masculino: row.Masculino,
        femenino: row.Femenino,
        indiceDesercion: row.IndiceDesercion,
        indiceBajas: row.IndiceBajas,
        indiceReingreso: row.IndiceReingreso,
        materiasReprobadas: row.MateriasReprobadas,
        promedioGeneral: row.PromedioGeneral
      })
    });

    setGuardados(prev => ({
      ...prev,
      [row.Id]: true
    }));

  };



const campo = (row, index, field) => {

  const value = rows[index][field] ?? "";

  const onChange = (e) => {

    let val = e.target.value;

    if (val === "") {
      handleChange(index, field, "");
      return;
    }

    val = Number(val);

    // ❌ No permitir negativos
    if (val < 0) return;

    // ❌ Promedio máximo 10
    if (field === "PromedioGeneral" && val > 10) return;

    handleChange(index, field, val);
  };

  return (
    <TextField
      type="number"
      size="small"
      value={value}
      onChange={onChange}
      inputProps={{
        min: 0,
        max: field === "PromedioGeneral" ? 10 : undefined
      }}
      sx={{ width: "100%" }}
    />
  );

};



  return (

    <Box
      sx={{
        mt: 4,
        bgcolor: "#c8e6c9",
        borderRadius: 3,
        p: 3
      }}
    >

      <Typography gutterBottom>

        <Box fontWeight="bold" fontSize="1.2rem">
          Periodo 1
        </Box>

        <Box fontSize="0.9rem" color="text.secondary">
          Ciclo escolar 2025 - 2026
        </Box>

      </Typography>



      {/* HEADER */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            "50px 110px 1fr 140px 100px",
          px: 2,
          py: 1.5,
          bgcolor: "#a5d6a7",
          borderRadius: 2,
          fontWeight: 600
        }}
      >

        <Box />

        <Typography>CLAVE</Typography>
        <Typography>UNIDAD</Typography>
        <Typography>PLAN</Typography>
        <Typography align="center">ACCIONES</Typography>

      </Box>



      {rows.map((row, index) => {

        const guardado = guardados[row.Id];

        return (

          <Box key={row.Id} sx={{ mt: 1 }}>

            {/* FILA PRINCIPAL */}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "50px 110px 1fr 140px 100px",
                alignItems: "center",
                px: 2,
                py: 1.2,
                bgcolor: "#fff",
                borderRadius: 2
              }}
            >

              <IconButton
                size="small"
                onClick={() => toggleRow(row.Id)}
              >
                {openRows[row.Id]
                  ? <KeyboardArrowUpIcon/>
                  : <KeyboardArrowDownIcon/>
                }
              </IconButton>

              <Typography
                fontWeight={600}
                color="#1565c0"
              >
                {row.Clave}
              </Typography>

              <Typography>
                {row.Nombre}
              </Typography>

              <Chip
                label={`Plan ${row.Plan}`}
                size="small"
                variant="outlined"
              />

              <Box textAlign="center">

                {!soloLectura && (

                  <IconButton
                    color="primary"
                    onClick={() => guardarFila(row)}
                  >
                    <SaveIcon fontSize="small"/>
                  </IconButton>

                )}

                {guardado &&
                  <CheckCircleIcon
                    sx={{ color: "green", ml: 1 }}
                  />
                }

              </Box>

            </Box>



            {/* PANEL ESTADÍSTICO */}

<Collapse in={openRows[row.Id]}>

  <Box
    sx={{
      mt: 1,
      bgcolor: "#ffffff",
      borderRadius: 2,
      p: 3,
      border: "1px solid #e0e0e0"
    }}
  >

    <Typography
      fontWeight={600}
      sx={{
        mb: 2,
        color: "#2e7d32"
      }}
    >
      Indicadores académicos
    </Typography>

    {/* GRID RESPONSIVO */}
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2,1fr)",
          md: "repeat(4,1fr)"
        },
        gap: 2
      }}
    >

      <Campo titulo="Total Alumnos">
        {campo(row,index,"TotalAlumnos")}
      </Campo>

      <Campo titulo="Masculino">
        {campo(row,index,"Masculino")}
      </Campo>

      <Campo titulo="Femenino">
        {campo(row,index,"Femenino")}
      </Campo>

      <Campo titulo="Índice Deserción">
        {campo(row,index,"IndiceDesercion")}
      </Campo>

      <Campo titulo="Índice Bajas">
        {campo(row,index,"IndiceBajas")}
      </Campo>

      <Campo titulo="Índice Reingreso">
        {campo(row,index,"IndiceReingreso")}
      </Campo>

      <Campo titulo="Materias Reprobadas">
        {campo(row,index,"MateriasReprobadas")}
      </Campo>

      <Campo titulo="Promedio General">
        {campo(row,index,"PromedioGeneral")}
      </Campo>

    </Box>

  </Box>

</Collapse>

          </Box>

        );

      })}

    </Box>

  );

}