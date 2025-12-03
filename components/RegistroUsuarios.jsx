"use client";

import * as React from "react";
import { useState } from "react";
import { Grid, Box,Button, Typography, TextField, MenuItem, Paper } from "@mui/material";
import Select from "./Select";
import { useCatalogos } from "@/hooks/useCatalogos"; // Para traer los 4 catalogos

export default function Registro() {

  // Falta el de los roles de usuario
  const { unidades, localidades, escuelas, carreras, modalidades, roles } = useCatalogos();

  const [selectedRol, setSelectedRol] = React.useState(""); 
  const [selectedUnidadRegional, setSelectedUnidadRegional] = React.useState(""); 
  const [selectedLocalidad, setSelectedLocalidad] = React.useState("");
  const [selectedEscuela, setSelectedEscuela] = React.useState("");
  const [selectedCarrera, setSelectedCarrera] = React.useState("");

  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [tipo, setTipo] = useState("1"); // 1 = admin, 2 = usuario normal

  const [mensaje, setMensaje] = useState("");

  // filtrados para cada seleccion de nivel
  const filteredLocalidades = localidades.filter(
    (loc) => loc.UnidadRegionalId  === selectedUnidadRegional
  );

  const filteredEscuelas = escuelas.filter(
    (esc) => esc.LocalidadId === selectedLocalidad
  );

  const filteredCarreras = carreras.filter(
    (car) => car.EscuelaId === selectedEscuela
  );

const carrerasUnicas = carreras
  .filter((car) => car.EscuelaId === selectedEscuela)
  .map((car) => {
    const modalidad = modalidades.find((m) => m.value === car.ModalidadId);

    return {
      value: car.value,
      label: `${car.label} - ${modalidad?.label || ""}`,
      EscuelaId: car.EscuelaId,
      ModalidadId: car.ModalidadId,
    };
  });



  const Validación  = 1 // cambiar esto despues por una validacion real
    

  const showUnidad    = selectedRol === 2 || selectedRol === 3 || selectedRol === 4 || selectedRol === 5;
  const showLocalidad = selectedRol === 3 || selectedRol === 4 || selectedRol === 5;
  const showEscuela   = selectedRol === 4 || selectedRol === 5;
  const showCarrera   = selectedRol === 5;

  const reglas = {
        1: [], // admin no requiere nada
        2: ["selectedUnidadRegional"],
        3: ["selectedUnidadRegional", "selectedLocalidad"],
        4: ["selectedUnidadRegional", "selectedLocalidad", "selectedEscuela"],
        5: ["selectedUnidadRegional", "selectedLocalidad", "selectedEscuela", "selectedCarrera"],
    };

  const validarCampos = () => {
    // Validaciones generales
    if (!nombre || !usuario || !contrasena || !tipo) {
        return "Por favor completa todos los campos generales.";
    }

        const form = {
            selectedUnidadRegional,
            selectedLocalidad,
            selectedEscuela,
            selectedCarrera
        };

    
    const requeridos = reglas[selectedRol];

    for (const campo of requeridos) {
        if (!form[campo]) {
        return `Falta seleccionar: ${campo.replace("selected", "")}`;
        }
    }

    return null; // No hay errores
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validarCampos();
    if (error) {
        setMensaje(error);
        return;
    }

    const payload = {
        Nombre: nombre,
        Usuario: usuario,
        Password: contrasena,
        RolId: selectedRol || 0,
        UnidadId: selectedUnidadRegional || 0,
        LocalidadId: selectedLocalidad || 0,
        EscuelaId: selectedEscuela || 0,
        CarreraId: selectedCarrera || 0,
        TipoPermiso: tipo,
    };

    

    try {
        const res = await fetch("/api/usuarios/guardar", {
        method: "POST",
        body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
        setMensaje(data.error || "Error inesperado");
        return;
        }

        setMensaje("Usuario registrado correctamente.");
    } catch (error) {
        
        setMensaje("Error al conectar con el servidor.");
    }

    //Limpiar formulario
        setNombre("");  
        setUsuario("");
        setContrasena("");
        setTipo("1");
        setSelectedRol("");
        setSelectedUnidadRegional("");
        setSelectedLocalidad("");
        setSelectedEscuela("");
        setSelectedCarrera(""); 

    };

  return (
    <Box sx={{ width: "100%", background: "#f1f8f4", m: 0, p: 0 }}>
            <Grid
                container
                spacing={1}
                sx={{
                    bgcolor: "#f1f8f4",
                    p: '10px',
                    borderRadius: 2,
                    mb: 0,
                }}
            >
                    {/* Sección de Cuenta */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#2e7d32" }}>
                            Datos de acceso
                        </Typography>

                        <TextField
                            fullWidth
                            label="Usuario"
                            type="number"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            required
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            type="password"
                            label="Contraseña"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            required
                        />
                        </Paper>
                    </Grid>

                    {/* Sección de Información del Usuario */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#2e7d32" }}>
                            Información personal
                        </Typography>

                        <TextField
                            fullWidth
                            label="Nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            select
                            label="Tipo de usuario"
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                        >
                            <MenuItem value="1">Edición</MenuItem>
                            <MenuItem value="2">Lectura</MenuItem>
                        </TextField>
                        </Paper>
                    </Grid>

                    {/* Botón registrar */}
                    <Grid item xs={12} md={4}>
                            <Paper
                            elevation={2}
                            sx={{
                                p: 3,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                borderRadius: 3,
                                height: "100%",
                            }}
                            >
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                py: 1.3,
                                fontWeight: "bold",
                                fontSize: "1.1rem",
                                bgcolor: Validación > 0 ? "#2e7d32" : "#bdbdbd",
                                boxShadow: Validación > 0 ? "0 3px 10px rgba(46,125,50,0.4)" : "none",
                                transition: "all 0.25s ease",
                                "&:hover": {
                                    bgcolor: Validación > 0 ? "#1b5e20" : "#bdbdbd",
                                    transform: Validación > 0 ? "scale(1.03)" : "none",
                                },
                                }}
                                disabled={Validación === 0 }
                                onClick={handleSubmit}
                            >
                                Registrar
                            </Button>
                        </Paper>
                    </Grid>
            </Grid>
            <Grid
                container
                spacing={1}
                sx={{
                p: '10px',
                borderRadius: 2,
                mb: 1,
                }}
            >
                {/* Rol */}
                <Grid item xs={12} sm={5}>
                <Paper elevation={2} sx={{ p: 2.5, borderRadius: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#2e7d32", mb: 1 }}>
                        Rol
                    </Typography>
                    <Select
                    options={roles}
                    value={selectedRol}
                    onChange={(value) => {
                        setSelectedRol(value);
                    }}
                    label="Selecciona un rol..."
                    />
                </Paper>
                </Grid>

                {/* Unidad Regional */}
                {showUnidad && (
                    <Grid item xs={12} sm={3}>
                    <Paper elevation={2} sx={{ p: 2.5, borderRadius: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#2e7d32", mb: 1 }}>
                        Unidad Regional
                        </Typography>
                        <Select
                        options={unidades}
                        value={selectedUnidadRegional}
                        onChange={(value) => {
                            setSelectedUnidadRegional(value);
                            setSelectedLocalidad("");
                            setSelectedEscuela("");
                            setSelectedCarrera("");
                        }}
                        label="Selecciona una unidad regional..."
                        />
                    </Paper>
                    </Grid>
                )}
                {/* Localidad */}
                {showLocalidad && (
                    <Grid item xs={12} sm={3}>
                    <Paper elevation={2} sx={{ p: 2.5, borderRadius: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#2e7d32", mb: 1 }}>
                        Localidad
                        </Typography>
                        <Select
                        options={filteredLocalidades}
                        value={selectedLocalidad}
                        onChange={(value) => {
                            setSelectedLocalidad(value);
                            setSelectedEscuela("");
                            setSelectedCarrera("");
                        }}
                        label="Selecciona una localidad..."
                        />
                    </Paper>
                    </Grid>
                )}

                {/* Escuela */}
                {showEscuela && (
                    <Grid item xs={12} sm={3}>
                    <Paper elevation={2} sx={{ p: 2.5, borderRadius: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#2e7d32", mb: 1 }}>
                        Escuela
                        </Typography>
                        <Select
                        options={filteredEscuelas}
                        value={selectedEscuela}
                        onChange={(value) => {
                            setSelectedEscuela(value);
                            setSelectedCarrera("");
                        }}
                        label="Selecciona una Escuela..."
                        />
                    </Paper>
                    </Grid>
                )}

                {/* Carrera */}
                {showCarrera && (
                <Grid item xs={12} sm={5}>
                <Paper elevation={2} sx={{ p: 2.5, borderRadius: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#2e7d32", mb: 1 }}>
                        Carrera
                    </Typography>
                    <Select
                    options={carrerasUnicas}
                    value={selectedCarrera}
                    onChange={(value) => {
                        setSelectedCarrera(value);
                    }}
                    label="Selecciona una carrera..."
                    />
                </Paper>
                </Grid>
                )}
            </Grid>
            
        </Box>
    
  );
}