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

export default function FileUploader({ onUpload, clearSignal, showFiles = true }) {
  const [files, setFiles] = React.useState([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef(null);

  // 🔹 Cuando el padre diga “limpia todo”
  React.useEffect(() => {
    if (clearSignal === true) {
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [clearSignal]);

  // 🔹 Notificar al padre cada vez que cambia la lista
  React.useEffect(() => {
    if (onUpload) {
      const filesToSend = files.map(f => ({
        name: f.name,
        file: f,
        url: URL.createObjectURL(f)
      }));
      onUpload(filesToSend);
    }
  }, [files]);

  const addFiles = (newFiles) => {
    setFiles((prev) => {
      const unique = [...prev];
      newFiles.forEach((file) => {
        if (!unique.some((f) => f.name === file.name && f.size === file.size)) {
          unique.push(file);
        }
      });
      return unique;
    });
  };

  const handleFileChange = (event) => {
    const selected = Array.from(event.target.files || []);
    if (selected.length > 0) {
      addFiles(selected);
      event.target.value = ""; // ✔ evita reenvío de antiguos
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(event.dataTransfer.files || []));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box
      sx={{
        bgcolor: isDragging ? "rgba(255,255,255,0.3)" : "rgba(255, 255, 255, 0.2)",
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
      <UploadFileIcon sx={{ fontSize: 50, mb: 1 }} />
      <Typography variant="subtitle1" fontWeight="bold">
        Pulsa o arrastra archivos aquí
      </Typography>

      <input
        type="file"
        multiple
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

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