"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import Image from "next/image";
import Logo_DGES from "../../public/images/DGES_2025.png";

export default function LoginPage() {
  const router = useRouter();

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (user === "admin" && pass === "1234") {
      localStorage.setItem("auth", "ok");
      router.push("/principal");
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #1d70b8, #0c3b74)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 4,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
<Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
  <Image
    src={Logo_DGES}
    alt="Logo DGES"
    style={{
      width: "auto",      // Tamaño controlado
      height: "100%",
      objectFit: "contain",
      display: "block",    // Asegura centrado
    }}
  />
</Box>

        <TextField
          label="Usuario"
          fullWidth
          value={user}
          onChange={(e) => setUser(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          sx={{ mb: 2 }}
        />

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{ py: 1.2, bgcolor: "#2e7d32" }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Paper>
    </Box>
  );
}