import { Injectable, signal } from '@angular/core';

// ============================================
// TIPOS
// ============================================

export type TipoNotificacion = 'success' | 'error' | 'warning' | 'info';

export interface Notificacion {
  readonly id: number;
  readonly tipo: TipoNotificacion;
  readonly mensaje: string;
}

// ============================================
// CONSTANTES
// ============================================

const DURACION_DEFAULT = 3000;
const TIPO_DEFAULT: TipoNotificacion = 'info';

// ============================================
// SERVICIO DE NOTIFICACIONES
// ============================================

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  // ----------------------------------------
  // Estado privado
  // ----------------------------------------
  private contadorId = 0;
  private timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;

  // ----------------------------------------
  // Estado público (solo lectura)
  // ----------------------------------------
  readonly notificacion = signal<Notificacion | null>(null);

  // ----------------------------------------
  // Métodos públicos - Mostrar por tipo
  // ----------------------------------------
  success(mensaje: string, duracion: number = DURACION_DEFAULT): void {
    this.mostrar(mensaje, 'success', duracion);
  }

  error(mensaje: string, duracion: number = DURACION_DEFAULT): void {
    this.mostrar(mensaje, 'error', duracion);
  }

  warning(mensaje: string, duracion: number = DURACION_DEFAULT): void {
    this.mostrar(mensaje, 'warning', duracion);
  }

  info(mensaje: string, duracion: number = DURACION_DEFAULT): void {
    this.mostrar(mensaje, 'info', duracion);
  }

  // ----------------------------------------
  // Métodos públicos - Mostrar genérico
  // ----------------------------------------
  mostrar(
    mensaje: string,
    tipo: TipoNotificacion = TIPO_DEFAULT,
    duracion: number = DURACION_DEFAULT
  ): void {
    this.cancelarTimeoutPendiente();
    
    const nuevaNotificacion = this.crearNotificacion(mensaje, tipo);
    this.notificacion.set(nuevaNotificacion);

    this.programarCierreAutomatico(duracion);
  }

  // ----------------------------------------
  // Métodos públicos - Cerrar
  // ----------------------------------------
  cerrar(): void {
    this.cancelarTimeoutPendiente();
    this.notificacion.set(null);
  }

  // ----------------------------------------
  // Métodos privados
  // ----------------------------------------
  private crearNotificacion(mensaje: string, tipo: TipoNotificacion): Notificacion {
    this.contadorId++;

    return {
      id: this.contadorId,
      tipo,
      mensaje,
    };
  }

  private programarCierreAutomatico(duracion: number): void {
    const debeProgramar = duracion > 0;

    if (!debeProgramar) {
      return;
    }

    this.timeoutId = setTimeout(() => {
      this.cerrar();
    }, duracion);
  }

  private cancelarTimeoutPendiente(): void {
    const hayTimeoutPendiente = this.timeoutId !== undefined;

    if (!hayTimeoutPendiente) {
      return;
    }

    clearTimeout(this.timeoutId);
    this.timeoutId = undefined;
  }
}
