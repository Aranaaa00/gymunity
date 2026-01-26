// ============================================
// SERVICIOS - Exports Centralizados
// ============================================

// Servicios UI
export { ModalService } from './modal';
export type { TipoModal } from './modal';
export { TemaService } from './tema';
export type { Tema } from './tema';
export { ComunicacionService } from './comunicacion';
export type { Evento } from './comunicacion';
export { EstadoService } from './estado';
export { NotificacionService } from './notificacion';
export type { TipoNotificacion, Notificacion } from './notificacion';
export { CargaService } from './carga';

// Validadores
export { ValidadoresAsincronos, MENSAJES_VALIDACION_ASINCRONA } from './validadores-asincronos';
export { passwordFuerte, coincidenCampos, nifValido, telefonoEspanol, codigoPostalEspanol, rangoNumerico, MENSAJES_VALIDACION } from './validadores';

// Autenticación
export { AuthService } from './auth';

// API Services
export { GimnasiosApiService } from './gimnasios-api';

// HTTP
export { HttpBase } from './http-base';
export type { OpcionesHttp, ErrorApi, QueryParams, OpcionesPaginacion } from './http-base';

// Utilidades
export { calcularFuerzaPassword } from './fuerza-password';
export type { NivelFuerza, ResultadoFuerza } from './fuerza-password';

// Título dinámico de página
export { TituloPagina } from './titulo-pagina';