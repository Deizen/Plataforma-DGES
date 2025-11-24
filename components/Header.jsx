
" use client";

import * as React from "react";
import { Grid, Box, Typography } from "@mui/material";
import imagenUas from "../public/images/logo_uas2.png";
import logoDGES from "../public/images/logo_dges.png";
import logoVision from "../public/images/logo_administracion.png";
import Image from "next/image";

export default function Header() {
  return (
    <>
    <Grid
        container
        alignItems="center"
        sx={{
        background: "linear-gradient(to right, #1d70b8, #0c3b74)",
        p: 0,
        height: "115px", // altura total de la franja superior
        position: "relative", // ¡CLAVE para que el 'absolute' funcione!
        }}
        >
            {/* --- IZQUIERDA: Logo UAS (md={2}) --- */}
            <Grid
            item
            xs={12}
            md={2}
            display="flex"
            justifyContent="flex-start"
            alignItems="stretch"
            sx={{
                pl: 0,
                overflow: "hidden",
            }}
            >
            <Box
                sx={{
                height: "100%",
                display: "flex",
                alignItems: "stretch",
                justifyContent: "center",
                }}
            >
                <Image
                src={imagenUas}
                alt="Logo UAS"
                style={{
                    height: "100%",
                    width: "auto",
                    objectFit: "contain",
                }}
                />
            </Box>
            </Grid>


        {/* --- CENTRO: Texto (md={10}) --- */}
        <Grid
            item
            xs={12}
            md={10} 
            display="flex"
            justifyContent="flex-start"  // **CLAVE 1: Alineamos a la izquierda** para que el texto inicie después del margen
            alignItems="center"
            sx={{ 
                ml: { md: 3 }, // Ajusta este valor (3, 4, 5, etc.) para la separación ideal
                pr: { md: '300px' }, 
                mb:3,
            }} 
            >
            <Box 
                sx={{ 
                    color: "white", 
                    fontWeight: "bold", 
                    // El bloque de texto en sí está alineado a la izquierda
                    textAlign: "left", 
                    lineHeight: 1.1, 
                }}
            >
                {/* Línea 1: DIRECCIÓN GENERAL DE */}
                <Typography
                variant="h5" // Usamos un tamaño grande
                sx={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "left", 
                    letterSpacing: 1,
                    // Ajuste manual para el tamaño de la primera línea
                    fontSize: { xs: '1.3rem', md: '2.0rem' }, 
                    lineHeight: 1,
                }}
                >
                DIRECCIÓN GENERAL DE
                </Typography>

                {/* Línea 2: EDUCACIÓN SUPERIOR */}
                <Typography
                variant="h5" // Usamos un tamaño ligeramente menor
                sx={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "left", 
                    letterSpacing: 1,
                    // Ajuste manual para el tamaño de la segunda línea
                    fontSize: { xs: '1.3rem', md: '2.0rem' }, 
                    lineHeight: 1,
                    mt: 0.5, // Pequeño margen superior para separar de la primera línea
                }}
                >
                EDUCACIÓN SUPERIOR
                </Typography>
            </Box>
        </Grid>

        {/* --- DERECHA EXTREMA: GRUPO DGES y VISIÓN (Posicionamiento Absoluto) --- */}
        <Box
        sx={{
            // ** CLAVE: Saca los logos del flujo del Grid **
            position: "absolute",
            right: 10, 
            top: 0,
            height: "100%", 
            display: "flex",
            justifyContent: "flex-end", 
            alignItems: "flex-start", 
        }}
        >
        {/* Contenedor Flex interno para los dos logos */}
        <Box
            sx={{
            display: "flex",
            height: "100%",
            alignItems: "flex-start",
            }}
        >
            {/* Logo DGES */}
            <Box
            sx={{
                height: "100%",
                display: "flex",
                alignItems: "flex-start",
            }}
            >
            <Image
                src={logoDGES}
                alt="Logo DGES"
                style={{
                height: "100%",
                width: "auto",
                objectFit: "contain",
                }}
            />
            </Box>

            {/* Logo Visión */}
            <Box
            sx={{
                height: "100%",
                display: "flex",
                alignItems: "flex-start",
                ml: 1, // Pequeño margen para separar de DGES
            }}
            >
            <Image
                src={logoVision}
                alt="Logo Vision"
                style={{
                height: "100%", // Puedes ajustar este porcentaje
                width: "auto",
                objectFit: "contain",
                }}
            />
            </Box>
        </Box>
        </Box>
    </Grid>

    {/* Franja inferior UAS*/}
    <Box
        sx={{
        background: "linear-gradient(to right, #195fa5, #0c3b74)",
        height: "35px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        letterSpacing: "0.8rem",
        }}
    >
        <Typography
        variant="subtitle1"
        sx={{
            color: "white",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "1.8rem",
        }}
        >
        Universidad Autónoma de Sinaloa
        </Typography>
    </Box>
    </>
    );
}


