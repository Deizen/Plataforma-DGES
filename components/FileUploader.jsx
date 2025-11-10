"use client";
import * as React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";

export default function FileUploader({ onUpload, showFiles = true }) {
  const [files, setFiles] = React.useState([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef(null);

  const updateParent = (updatedFiles) => {
    // envía al padre una lista con { name, url }
    if (onUpload) {
      const filesWithPreview = updatedFiles.map((f) => ({
        name: f.name,
        url: URL.createObjectURL(f),
      }));
      onUpload(filesWithPreview);
    }
  };

  const addFiles = (newFiles) => {
    setFiles((prev) => {
      const uniqueFiles = [...prev];
      newFiles.forEach((file) => {
        if (!uniqueFiles.some((f) => f.name === file.name && f.size === file.size)) {
          uniqueFiles.push(file);
        }
      });
      updateParent(uniqueFiles);
      return uniqueFiles;
    });
  };

  const handleFileChange = (event) => {
    const selected = Array.from(event.target.files || []);
    if (selected.length > 0) {
      addFiles(selected);
      event.target.value = "";
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(event.dataTransfer.files || []);
    if (dropped.length > 0) addFiles(dropped);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleRemoveFile = (index) => {
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      updateParent(updated);
      return updated;
    });
  };

  return (
    <Box
      sx={{
        bgcolor: isDragging
          ? "rgba(255,255,255,0.3)"
          : "rgba(255, 255, 255, 0.2)",
        border: isDragging ? "2px solid #2e7d32" : "2px dashed #fff",
        borderRadius: 2,
        p: 2,
        textAlign: "center",
        color: "white",
        cursor: "pointer",
        transition: "0.3s",
      }}
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* 📁 Icono y texto principal */}
      <UploadFileIcon sx={{ fontSize: 50, mb: 1 }} />
      <Typography variant="subtitle1" fontWeight="bold">
        Pulsa o arrastra archivos aquí
      </Typography>

      {/* 🧩 Input invisible */}
      <input
        type="file"
        multiple
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* 📄 Lista de archivos seleccionados */}
      {showFiles && files.length > 0 && (
        <List dense sx={{ mt: 2, maxHeight: 120, overflowY: "auto" }}>
          {files.map((file, index) => (
            <ListItem
              key={index}
              sx={{
                bgcolor: "rgba(255,255,255,0.9)",
                borderRadius: 1,
                mb: 0.5,
                boxShadow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <ListItemIcon>
                <InsertDriveFileIcon sx={{ color: "#2e7d32" }} />
              </ListItemIcon>
              <ListItemText
                primary={file.name}
                primaryTypographyProps={{
                  fontSize: 14,
                  color: "#1a1a1a",
                  sx: { wordBreak: "break-all" },
                }}
              />
              <IconButton
                edge="end"
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(index);
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}