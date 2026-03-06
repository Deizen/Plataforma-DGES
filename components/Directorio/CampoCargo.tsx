"use client";

import { useEffect, useState } from "react";
import { Box, Autocomplete, TextField, Typography } from "@mui/material";
import { CargoDirectorio } from "@/types/directorio";


interface Cargo {
  id: number;
  nombre: string;
  tipo: "UNICO" | "AREA";
  usuarioId: number | null;
  usuarioNombre: string | null;
  numeroUsuario: number | null;
}

interface UsuarioOption {
  value: number;
  label: string;
}

interface Props {
  cargo: CargoDirectorio;
  unidadAcademicaId: number;
}


export default function CampoCargo({ cargo, unidadAcademicaId }: Props) {
  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    useState<UsuarioOption | null>(null);

  const [opciones, setOpciones] = useState<UsuarioOption[]>([]);

  // 🔹 Cargar usuario ya asignado
  useEffect(() => {
    if (cargo.usuarioId !== null) {
      setUsuarioSeleccionado({
        value: cargo.usuarioId,
        label: `${cargo.usuarioNombre} (${cargo.numeroUsuario})`,
      });
    } else {
      setUsuarioSeleccionado(null);
    }
  }, [cargo]);

  // 🔹 Buscar usuarios
  const buscarUsuarios = async (query: string) => {
    const res = await fetch(`/api/usuarios/buscar?q=${query}`);
    const data = await res.json();
    setOpciones(data);
  };

  // 🔹 Guardar asignación
  const guardarAsignacion = async (usuario: UsuarioOption | null) => {
    if (!usuario) return;

    await fetch("/api/directorio/asignar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        unidadAcademicaId,
        cargoId: cargo.id,
        usuarioId: usuario.value,
      }),
    });
  };

  return (
    <Box mb={2}>
      <Typography fontSize={14} fontWeight="bold" mb={0.5}>
        {cargo.nombre}
      </Typography>

      <Autocomplete
        options={opciones}
        value={usuarioSeleccionado}
        onOpen={() => buscarUsuarios("")}
        onInputChange={(event, value) => buscarUsuarios(value)}
        onChange={(event, newValue) => {
          setUsuarioSeleccionado(newValue);
          guardarAsignacion(newValue);
        }}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) =>
          option.value === value.value
        }
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            sx={{ bgcolor: "white" }}
          />
        )}
      />
    </Box>
  );
}