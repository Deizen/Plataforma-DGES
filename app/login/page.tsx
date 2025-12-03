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

  // const handleLogin = () => {
  //   if (user === "admin" && pass === "1234567890") {

  //     localStorage.setItem("auth", "ok");
  //     document.cookie = "token=ok; path=/;";
  //     router.push("/principal");
  //   } else {
  //     alert("Credenciales incorrectas");
  //   }
  // };
//   const handleLogin = async () => {
//   try {
//     const res = await fetch("/api/login", {
//       method: "POST",
//       body: JSON.stringify({ user, pass })
//     });

//     if (!res.ok) {
//       alert("Credenciales incorrectas");
//       return;
//     }

//     const data = await res.json();



//     localStorage.setItem("user", JSON.stringify({
//       id: data.id,
//       nombre: data.nombre,
//       usuario: data.usuario,
//       rolid: data.rolid,
//       permisos: data.permisos
//     }));


//     router.push("/principal");

//   } catch (error) {

//     alert("Error al iniciar sesión");
//   }
// };
  const handleLogin = async () => {
    setError("");
    
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          usuario: user, 
          password: pass 
        })
      });

      const data = await res.json();

      if (!data.ok) {
        setError(data.message);
        return;
      }

      // Guarda al usuario en localStorage (opcional pero útil)
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/principal");
    } catch {
      setError("Error al conectar con el servidor");
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