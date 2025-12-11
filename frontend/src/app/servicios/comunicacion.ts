import { Injectable } from '@angular/core';
import { Subject, Observable, filter, map } from 'rxjs';

// ============================================
// INTERFACES
// ============================================

export interface Evento {
  readonly tipo: string;
  readonly datos?: unknown;
}

// ============================================
// SERVICIO DE COMUNICACIÓN
// ============================================

@Injectable({ providedIn: 'root' })
export class ComunicacionService {
  // ----------------------------------------
  // Estado privado
  // ----------------------------------------
  private readonly eventos$ = new Subject<Evento>();

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  emitir(tipo: string, datos?: unknown): void {
    const nuevoEvento: Evento = { tipo, datos };

    this.eventos$.next(nuevoEvento);
  }

  escuchar<T = unknown>(tipo: string): Observable<T> {
    const filtrarPorTipo = (evento: Evento): boolean => {
      const coincide = evento.tipo === tipo;

      return coincide;
    };

    const extraerDatos = (evento: Evento): T => {
      const datos = evento.datos as T;

      return datos;
    };

    const observable = this.eventos$.pipe(
      filter(filtrarPorTipo),
      map(extraerDatos)
    );

    return observable;
  }
}
