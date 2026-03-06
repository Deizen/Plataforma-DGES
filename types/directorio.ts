export interface CargoDirectorio {
  id: number;
  nombre: string;
  tipo: "UNICO" | "AREA";
  usuarioId: number | null;
  usuarioNombre: string | null;
  numeroUsuario: number | null;
}