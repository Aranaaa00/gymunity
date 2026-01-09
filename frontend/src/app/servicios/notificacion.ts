import { Injectable, signal, computed } from '@angular/core';

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

const TIPO_DEFAULT: TipoNotificacion = 'info';
const MAX_TOASTS = 5;
const AUTO_CLOSE_MS = 7000;

// ============================================
// SERVICIO DE NOTIFICACIONES
// ============================================

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  // ----------------------------------------
  // Estado privado
  // ----------------------------------------
  private contadorId = 0;
  private readonly _notificaciones = signal<Notificacion[]>([]);

  // ----------------------------------------
  // Estado público (solo lectura)
  // ----------------------------------------
  readonly notificaciones = this._notificaciones.asReadonly();
  
  /** @deprecated Usar notificaciones() para múltiples toasts */
  readonly notificacion = computed(() => {
    const lista = this._notificaciones();
    return lista.length > 0 ? lista[lista.length - 1] : null;
  });

  // ----------------------------------------
  // Métodos públicos - Mostrar por tipo
  // ----------------------------------------
  success(mensaje: string): void {
    this.mostrar(mensaje, 'success');
  }

  error(mensaje: string): void {
    this.mostrar(mensaje, 'error');
  }

  warning(mensaje: string): void {
    this.mostrar(mensaje, 'warning');
  }

  info(mensaje: string): void {
    this.mostrar(mensaje, 'info');
  }

  // ----------------------------------------
  // Métodos públicos - Mostrar genérico
  // ----------------------------------------
  mostrar(mensaje: string, tipo: TipoNotificacion = TIPO_DEFAULT): void {
    const nuevaNotificacion = this.crearNotificacion(mensaje, tipo);
    
    this._notificaciones.update(lista => {
      const nuevaLista = [...lista, nuevaNotificacion];
      if (nuevaLista.length > MAX_TOASTS) {
        return nuevaLista.slice(-MAX_TOASTS);
      }
      return nuevaLista;
    });

    // Auto-cerrar después de 7 segundos
    setTimeout(() => {
      this.cerrar(nuevaNotificacion.id);
    }, AUTO_CLOSE_MS);
  }

  // ----------------------------------------
  // Métodos públicos - Cerrar
  // ----------------------------------------
  cerrar(id?: number): void {
    if (id === undefined) {
      // Cerrar la última
      this._notificaciones.update(lista => lista.slice(0, -1));
    } else {
      // Cerrar por ID específico
      this._notificaciones.update(lista => 
        lista.filter(n => n.id !== id)
      );
    }
  }

  cerrarTodas(): void {
    this._notificaciones.set([]);
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
}
