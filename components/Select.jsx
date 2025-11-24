import React from "react";
import { Autocomplete, TextField } from "@mui/material";

export default function Select({
  options = [],
  value = null,
  onChange,
  label = "Selecciona una opcion...",
}) {
  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.label || ""}
      value={options.find((opt) => opt.value === value) || null}
      onChange={(_, newValue) => onChange(newValue ? newValue.value : "")}
      //onChange={(_, newValue) => onChange(newValue || null)}
      
      sx={{
        minWidth: 250,
        "& .MuiOutlinedInput-root": {
          borderRadius: "10px",
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          fullWidth
          sx={{
            "& .MuiInputLabel-root": { color: "#1d70b8" },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#1d70b8",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#195fa5",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#195fa5",
            },
          }}
        />
      )}
    />
  );
}