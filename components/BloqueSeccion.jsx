"use client";

import { Box, Typography } from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";

export default function BloqueSeccion({ visible }) {
  if (!visible) return null;

  return (
    <Box
      sx={{
        bgcolor: "#e8f5e9",
        border: "1px solid #a5d6a7",
        borderRadius: 2,
        p: 4,
        mt: 4,
        textAlign: "center",
      }}
    >
      <BlockIcon sx={{ fontSize: 50, color: "#2e7d32" }} />
      <Typography
        variant="h6"
        sx={{ mt: 2, fontWeight: "bold", color: "#1b5e20" }}
      >
        Sección bloqueada
      </Typography>
      <Typography sx={{ color: "#2e7d32" }}>
        Selecciona todos los filtros para mostrar la sección.
      </Typography>
    </Box>
  );
}