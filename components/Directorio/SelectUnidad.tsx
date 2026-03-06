"use client";

import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

interface Escuela {
  value: number;
  label: string;
}

interface Props {
  escuelas: Escuela[];
  value: number | null;
  onChange: (value: number) => void;
}

export default function SelectUnidad({ escuelas, value, onChange }: Props) {
  return (
    <FormControl fullWidth>
      <InputLabel>Unidad Académica</InputLabel>
      <Select
        value={value ?? ""}
        label="Unidad Académica"
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {escuelas.map((escuela) => (
          <MenuItem key={escuela.value} value={escuela.value}>
            {escuela.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}