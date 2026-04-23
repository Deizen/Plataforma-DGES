"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Autocomplete,
  TextField,
} from "@mui/material";

import PersonAddIcon from "@mui/icons-material/PersonAdd";

import ModalPersona from "./ModalPersona";
import SeccionCargos from "./SeccionCargos";
import { useCatalogos } from "@/hooks/useCatalogos";

export default function DirectorioModulo() {
  const { unidades, escuelas } = useCatalogos();

  const [unidadRegionalSeleccionada, setUnidadRegionalSeleccionada] =
    useState<number | null>(null);

  const [escuelaSeleccionada, setEscuelaSeleccionada] =
    useState<number | null>(null);

  const [openModalPersona, setOpenModalPersona] = useState(false);

  return (
    <Box sx={{ p: 4 }}>
      {/* TITULO */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Directorio
        </Typography>

        <Tooltip title="Agregar persona al directorio">
          <IconButton
            color="primary"
            onClick={() => setOpenModalPersona(true)}
          >
            <PersonAddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* CARD FILTROS */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography mb={2}>
            Seleccione una Unidad Regional y Unidad Académica:
          </Typography>

          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            
            {/* UNIDAD REGIONAL */}
            <Autocomplete
              options={unidades}
              value={
                unidades.find(
                  (u: any) => u.value === unidadRegionalSeleccionada
                ) || null
              }
              onChange={(event, newValue: any) => {
                setUnidadRegionalSeleccionada(newValue?.value || null);
              }}
              getOptionLabel={(option: any) => option.label}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Unidad Regional"
                  size="small"
                />
              )}
            />

            {/* UNIDAD ACADÉMICA */}
            <Autocomplete
              options={escuelas}
              value={
                escuelas.find(
                  (e: any) => e.value === escuelaSeleccionada
                ) || null
              }
              onChange={(event, newValue: any) => {
                setEscuelaSeleccionada(newValue?.value || null);
              }}
              getOptionLabel={(option: any) => option.label}
              sx={{ width: 400 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Unidad Académica"
                  size="small"
                />
              )}
            />
          </Box>
        </CardContent>
      </Card>

      {/* CARGOS */}
      {escuelaSeleccionada && (
        <SeccionCargos unidadAcademicaId={escuelaSeleccionada} />
      )}

      {/* MODAL PERSONA */}
      <ModalPersona
        open={openModalPersona}
        onClose={() => setOpenModalPersona(false)}
      />
    </Box>
  );
}