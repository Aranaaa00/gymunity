// ============================================
// MODELOS - Gymunity
// Interfaces TypeScript basadas en DTOs del backend
// ============================================

// --------------------------------------------
// USUARIO
// --------------------------------------------

export interface Usuario {
  readonly id: number;
  readonly nombreUsuario: string;
  readonly email: string;
  readonly rol: RolUsuario;
  readonly ciudad?: string;
  readonly fechaRegistro?: string;
}

export type RolUsuario = 'ALUMNO' | 'PROFESOR' | 'ADMIN';

// --------------------------------------------
// AUTENTICACIÓN
// --------------------------------------------

export interface LoginRequest {
  readonly email: string;
  readonly contrasenia: string;
}

export interface RegistroRequest {
  readonly nombreUsuario: string;
  readonly email: string;
  readonly contrasenia: string;
  readonly ciudad: string;
  readonly rol: RolUsuario;
}

export interface AuthResponse {
  readonly token: string;
  readonly email: string;
  readonly nombreUsuario: string;
  readonly rol: string;
  readonly id: number;
  readonly mensaje: string;
}

// --------------------------------------------
// GIMNASIO
// --------------------------------------------

export interface GimnasioCard {
  readonly id: number;
  readonly nombre: string;
  readonly ciudad: string;
  readonly foto: string;
  readonly disciplinas: string;
  readonly valoracionMedia: number | null;
  readonly totalResenias: number;
}

export interface GimnasioDetalle {
  readonly id: number;
  readonly nombre: string;
  readonly descripcion: string;
  readonly ciudad: string;
  readonly foto: string;
  readonly clases: readonly Clase[];
  readonly resenias: readonly Resenia[];
  readonly valoracionMedia: number | null;
  readonly totalResenias: number;
  readonly totalApuntados: number;
}

export interface GimnasioRequest {
  readonly nombre: string;
  readonly descripcion: string;
  readonly ciudad: string;
  readonly foto?: string;
}

// --------------------------------------------
// CLASE
// --------------------------------------------

export interface Clase {
  readonly id: number;
  readonly nombre: string;
  readonly icono: string;
  readonly profesorNombre: string;
  readonly gimnasioId: number;
}

export interface ClaseRequest {
  readonly nombre: string;
  readonly icono: string;
  readonly profesorId: number;
  readonly gimnasioId: number;
}

// --------------------------------------------
// RESEÑA
// --------------------------------------------

export interface Resenia {
  readonly id: number;
  readonly texto: string;
  readonly usuarioNombre: string;
  readonly fechaInteraccion: string;
}

// --------------------------------------------
// INTERACCIÓN
// --------------------------------------------

export interface InteraccionRequest {
  readonly usuarioId: number;
  readonly gimnasioId: number;
  readonly esApuntado?: boolean;
  readonly resenia?: string;
}

export interface InteraccionResponse {
  readonly id: number;
  readonly usuarioNombre: string;
  readonly gimnasioNombre: string;
  readonly esApuntado: boolean;
  readonly resenia: string | null;
  readonly fechaInteraccion: string;
}

// --------------------------------------------
// INSCRIPCIÓN A CLASES
// --------------------------------------------

export interface InscripcionRequest {
  readonly alumnoId: number;
  readonly claseId: number;
}

export interface InscripcionResponse {
  readonly id: number;
  readonly alumnoNombre: string;
  readonly claseNombre: string;
  readonly gimnasioNombre: string;
  readonly fechaInscripcion: string;
}

// --------------------------------------------
// RESPUESTAS API
// --------------------------------------------

export interface ErrorApi {
  readonly mensaje: string;
  readonly codigo: number;
  readonly timestamp?: string;
}
