"use client";

import { Box, Typography, TextField, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";

export default function SeccionTexto({
  title,
  value,
  onChange,
  onSave,
  placeholder,
  minRows = 6,
  readOnly = false,
}) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    if (readOnly) return;
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave?.();
    setIsEditing(false);
  };

  return (
    <Box
      sx={{
        bgcolor: "#c8e6c9",
        p: 3,
        borderRadius: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>

        <Box>
          <IconButton
            size="small"
            onClick={handleEdit}
            disabled={isEditing || readOnly}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            size="small"
            onClick={handleSave}
            disabled={!isEditing || readOnly}  
          >
            <SaveIcon />
          </IconButton>
        </Box>
      </Box>

      {/* <TextField
        multiline
        fullWidth
        minRows={minRows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        variant="outlined"
        disabled={!isEditing || readOnly}
        sx={{
          bgcolor: "white",
          borderRadius: 1,
          flexGrow: 1,
        }}
      /> */}
      <TextField
        multiline
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        variant="outlined"
        disabled={!isEditing || readOnly}
        sx={{
          bgcolor: "white",
          borderRadius: 1,
          flex: 1,
          display: "flex",

          "& .MuiInputBase-root": {
            height: "100%",
            alignItems: "stretch",
          },

          "& textarea": {
            height: "100% !important",
            overflow: "auto !important",
          },
        }}
      />
    </Box>
  );
}