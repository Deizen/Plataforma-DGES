"use client"; // 👈 Importante para usar componentes interactivos en Next.js (App Router)
import * as React from "react";
import { MenuItem, ListSubheader } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export default function MySelect() {
  const [value, setValue] = React.useState<string>("");

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      displayEmpty
      fullWidth
      sx={{ minWidth: 200, bgcolor: "rgba(100, 149, 237, 0.1)" }}
    >
      <ListSubheader>Group 1</ListSubheader>
      <MenuItem value="1">Option 1</MenuItem>
      <MenuItem value="2">Option 2</MenuItem>

      <ListSubheader>Group 2</ListSubheader>
      <MenuItem value="3">Option 3</MenuItem>
      <MenuItem value="4">Option 4</MenuItem>
    </Select>
  );
}