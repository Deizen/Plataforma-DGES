"use client";

import {
  Box,
  Typography,
  IconButton,
  Select,
  MenuItem,
  Button,
  Chip,
} from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import CommentIcon from "@mui/icons-material/Comment";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useState, useEffect } from "react";

import ModalPlanEstudio from "./ModalPlanEstudio";
import ModalComentario from "./ModalComentario";
import ModalObservacion from "./ModalObservacion";

const getStatusColor = (status) => {
  switch (status) {
    case 1:
      return "#fdd835"; // enviado
    case 2:
      return "#fb8c00"; // revisión
    case 3:
      return "#e53935"; // rechazado
    case 4:
      return "#43a047"; // aprobado
    default:
      return "#bdbdbd";
  }
};

export default function TablaUnidadesSemestre({
  carreraId,
  modalidadId,
  semestreId,
  tipoPermiso,
  esAdmin
}) {
  const [rows, setRows] = useState([]);
  const [responsablesCatalogo, setResponsablesCatalogo] = useState([]);

  const [planRow, setPlanRow] = useState(null);
  const [comentRow, setComentRow] = useState(null);
  const [obsRow, setObsRow] = useState(null);

  // 🔥 Cargar materias desde API
  useEffect(() => {
    const cargarMaterias = async () => {
      const res = await fetch("/api/unidades/obtenermaterias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carreraId,
          modalidadId,
          semestreId,
        }),
      });

      const data = await res.json();

      const materiasFormateadas = data.map((m) => ({
        ...m,
        tipo: "Elaboración",       // 👈 DEFAULT
        responsables: [],
        status: 0,
      }));

      setRows(materiasFormateadas);
    };

    if (carreraId && modalidadId && semestreId) {
      cargarMaterias();
    }
  }, [carreraId, modalidadId, semestreId]);

  // Cargar catálogo de responsables
  useEffect(() => {
    const cargarResponsables = async () => {
      try {
        const res = await fetch("/api/unidades/obtenerresponsables");
        const data = await res.json();
        setResponsablesCatalogo(data);
      } catch (error) {
        console.error("Error cargando responsables:", error);
      }
    };

    cargarResponsables();
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const guardarFila = async (row) => {
    await fetch("/api/unidades/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
    });
  };

  const enviarFila = async (row) => {
    await fetch("/api/unidades/enviar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
    });
  };


  return (
    <Box
      sx={{
        mt: 4,
        bgcolor: "#c8e6c9",
        borderRadius: 2,
        p: 3,
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        Unidades por semestre
      </Typography>

      {/* HEADER */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            "2fr .6fr 1.2fr 2fr .6fr 1.2fr .6fr .6fr",
          gap: 2,
          alignItems: "center",
          px: 3,
          py: 2,
          bgcolor: "#a5d6a7",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderBottom: "3px solid #66bb6a",
          fontWeight: 800,
          color: "#0d4d1f",
          letterSpacing: 0.5,
        }}
      >
        <Typography>UNIDAD DE APRENDIZAJE</Typography>
        <Typography textAlign="center">PLAN</Typography>
        <Typography textAlign="center">ELAB. / ACT.</Typography>
        <Typography textAlign="center">RESPONSABLES</Typography>
        <Typography textAlign="center">COMENT.</Typography>
        <Typography textAlign="center">ACCIONES</Typography>
        <Typography textAlign="center">STATUS</Typography>
        <Typography textAlign="center">OBSERV</Typography>
      </Box>

      {rows.map((row, index) => (
        <Box
          key={index}
          sx={{
            display: "grid",
            gridTemplateColumns:
              "2fr .6fr 1.2fr 2fr .6fr 1.2fr .6fr .6fr",
            gap: 2,
            alignItems: "center",
            p: 2,
            bgcolor: "#ffffff",
            borderRadius: 1,
            mb: 1,
          }}
        >
          {/* Unidad */}
          <Typography sx={{ color: "#151715", fontWeight: 600 }}>
            {row.unidadAprendizaje}
          </Typography>

          {/* Plan de estudios */}
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setPlanRow(row);
            }}
          >
            <UploadFileIcon />
          </IconButton>

          {/* Tipo */}
          <Select
            size="small"
            value={row.tipo ?? "Elaboración"}
            onChange={(e) =>
              handleChange(index, "tipo", e.target.value)
            }
          >
            <MenuItem value="Elaboración">Elaboración</MenuItem>
            <MenuItem value="Actualización">Actualización</MenuItem>
          </Select>

          {/* Responsables */}
            <Select
              size="small"
              multiple
              value={row.responsables || []}
              onChange={(e) =>
                handleChange(index, "responsables", e.target.value)
              }
              renderValue={(selected) => (
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {selected.map((id) => {
                    const r = responsablesCatalogo.find(
                      (x) => x.Id === id
                    );
                    return <Chip key={id} label={r?.Nombre} />;
                  })}
                </Box>
              )}
            >
              {responsablesCatalogo.map((r) => (
                <MenuItem key={r.Id} value={r.Id}>
                  {r.Nombre}
                </MenuItem>
              ))}
            </Select>

          {/* Comentario */}
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setComentRow(row);
            }}
          >
            <CommentIcon />
          </IconButton>

          {/* Guardar / Enviar */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => guardarFila(row)}
            >
              Guardar
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => enviarFila(row)}
            >
              Enviar
            </Button>
          </Box>

          {/* Status */}
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              bgcolor: getStatusColor(row.status),
            }}
          />
          {/* Observación admin */}
          {esAdmin ? (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setObsRow(row);
              }}
            >
              <VisibilityIcon />
            </IconButton>
          ) : (
            <Box />
          )}
        </Box>
      ))}

      {/* Modales */}
      <ModalPlanEstudio
        open={!!planRow}
        onClose={() => setPlanRow(null)}
        data={planRow}
      />

      <ModalComentario
        open={!!comentRow}
        onClose={() => setComentRow(null)}
        data={comentRow}
      />

      <ModalObservacion
        open={!!obsRow}
        onClose={() => setObsRow(null)}
        data={obsRow}
      />
    </Box>
  );
}


