import { Injectable, signal, computed, Signal } from '@angular/core';

// ============================================
// TIPOS
// ============================================

type EstadoGlobal = Record<string, unknown>;

// ============================================
// CONSTANTES
// ============================================

const ESTADO_INICIAL: EstadoGlobal = {};

// ============================================
// SERVICIO DE ESTADO
// ============================================

@Injectable({ providedIn: 'root' })
export class EstadoService {
  // ----------------------------------------
  // Estado privado
  // ----------------------------------------
  private readonly estado = signal<EstadoGlobal>(ESTADO_INICIAL);

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  obtener<T>(clave: string): T | undefined {
    const valor = this.estado()[clave] as T | undefined;

    return valor;
  }

  establecer<T>(clave: string, valor: T): void {
    this.estado.update((actual: EstadoGlobal): EstadoGlobal => {
      const nuevoEstado: EstadoGlobal = { ...actual, [clave]: valor };

      return nuevoEstado;
    });
  }

  eliminar(clave: string): void {
    this.estado.update((actual: EstadoGlobal): EstadoGlobal => {
      const { [clave]: _, ...resto } = actual;
      const nuevoEstado: EstadoGlobal = resto;

      return nuevoEstado;
    });
  }

  limpiar(): void {
    this.estado.set(ESTADO_INICIAL);
  }

  seleccionar<T>(clave: string): Signal<T | undefined> {
    const selector = computed((): T | undefined => {
      const valor = this.estado()[clave] as T | undefined;

      return valor;
    });

    return selector;
  }
}
