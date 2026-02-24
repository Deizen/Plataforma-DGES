"use client";

import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import Image from "next/image";
import imagenUas from "../public/images/logo_uas2.png";
import logoDGES from "../public/images/logo_dges.png";
import logoVision from "../public/images/logo_administracion.png";

export default function Header() {
  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    localStorage.removeItem("auth");
    window.location.href = "/login";
  };

  return (
    <>
      {/* HEADER PRINCIPAL */}
      <Box
        sx={{
          background: "linear-gradient(to right, #1d70b8, #0c3b74)",
          px: 2,
          py: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {/* IZQUIERDA */}
          <Image src={imagenUas} alt="Logo UAS" height={90} />

          {/* CENTRO */}
          <Box sx={{ color: "white", flex: 1, minWidth: 250 }}>
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "1.1rem", md: "2rem" },
                lineHeight: 1.1,
              }}
            >
              DIRECCIÓN GENERAL DE
            </Typography>
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "1.1rem", md: "2rem" },
                lineHeight: 1.1,
              }}
            >
              EDUCACIÓN SUPERIOR
            </Typography>
          </Box>

          {/* DERECHA */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Image src={logoDGES} alt="DGES" height={80} />
            <Image src={logoVision} alt="Visión" height={80} />

            <Tooltip title="Cerrar sesión">
              <IconButton onClick={handleLogout} sx={{ color: "white" }}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* FRANJA INFERIOR */}
      <Box
        sx={{
          background: "linear-gradient(to right, #195fa5, #0c3b74)",
          textAlign: "center",
          py: 1,
        }}
      >
        <Typography
          sx={{
            color: "white",
            letterSpacing: { xs: "0.4rem", md: "1.2rem" },
            fontSize: { xs: "0.7rem", md: "1rem" },
          }}
        >
          UNIVERSIDAD AUTÓNOMA DE SINALOA
        </Typography>
      </Box>
    </>
  );
}