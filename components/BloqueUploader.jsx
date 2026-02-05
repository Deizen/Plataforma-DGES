"use client";
import React from "react";
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Button } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FileUploader from "./FileUploader";

export default React.memo(function BloqueUploader({
  pendingFiles,
  setPendingFiles,
  handleUpload,
  clearUploader,
}) {


  return (
    <Box
      sx={{
        bgcolor: "#66bb6a",
        p: 3,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        textAlign: "center",
      }}
    >
      <FileUploader
        showFiles={false}
        clearSignal={clearUploader}
        onUpload={(files) => setPendingFiles(files)}
      />

      {pendingFiles.length > 0 && (
        <Box sx={{ width: "100%", mt: 2 }}>
          <Typography variant="subtitle2" sx={{ color: "#fff", mb: 1 }}>
            Archivos listos para subir:
          </Typography>

          <List dense>
            {pendingFiles.map((file, index) => (
              <ListItem key={index} sx={{ color: "#fff" }}>
                <ListItemIcon>
                  <InsertDriveFileIcon sx={{ color: "#2e7d32" }} />
                </ListItemIcon>
                <ListItemText primary={file.name} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        disabled={pendingFiles.length === 0}
        onClick={handleUpload}
      >
        Subir Archivos
      </Button>
    </Box>
  );
});