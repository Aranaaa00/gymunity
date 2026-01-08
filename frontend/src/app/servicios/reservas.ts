import { Injectable, signal, computed, inject } from '@angular/core';
import { AuthService } from './auth';
import { NotificacionService } from './notificacion';
import type { Clase } from '../modelos';

// ============================================
// CONSTANTES
// ============================================

const CREDITOS_INICIALES = 12;
const CREDITOS_POR_RESERVA = 1;

// ============================================
// TIPOS
// ============================================

export interface Reserva {
  readonly id: number;
  readonly claseId: number;
  readonly claseNombre: string;
  readonly gimnasioNombre: string;
  readonly fecha: string;
}

// ============================================
// SERVICIO DE RESERVAS
// ============================================

@Injectable({ providedIn: 'root' })
export class ReservasService {
  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly auth = inject(AuthService);
  private readonly notificacion = inject(NotificacionService);

  // ----------------------------------------
  // Estado privado
  // ----------------------------------------
  private contadorReservas = 0;
  private readonly _creditos = signal<number>(CREDITOS_INICIALES);
  private readonly _reservas = signal<Reserva[]>([]);
  private readonly _procesando = signal<boolean>(false);

  // ----------------------------------------
  // Estado público (readonly)
  // ----------------------------------------
  readonly creditos = this._creditos.asReadonly();
  readonly reservas = this._reservas.asReadonly();
  readonly procesando = this._procesando.asReadonly();

  // ----------------------------------------
  // Computed
  // ----------------------------------------
  readonly creditosRestantes = computed(() => {
    const actual = this._creditos();
    return `${actual - CREDITOS_POR_RESERVA}/${CREDITOS_INICIALES}`;
  });

  readonly puedeReservar = computed(() => {
    const tieneCreditos = this._creditos() >= CREDITOS_POR_RESERVA;
    const estaAutenticado = this.auth.estaAutenticado();
    return tieneCreditos && estaAutenticado;
  });

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  reservarClase(clase: Clase, gimnasioNombre: string): boolean {
    if (!this.puedeReservar()) {
      this.notificacion.error('No tienes créditos suficientes');
      return false;
    }

    const yaReservada = this._reservas().some(r => r.claseId === clase.id);
    if (yaReservada) {
      this.notificacion.warning('Ya tienes una reserva para esta clase');
      return false;
    }

    this._procesando.set(true);

    // Simular delay de API
    setTimeout(() => {
      this.contadorReservas++;
      
      const nuevaReserva: Reserva = {
        id: this.contadorReservas,
        claseId: clase.id,
        claseNombre: clase.nombre,
        gimnasioNombre,
        fecha: new Date().toISOString(),
      };

      this._reservas.update(lista => [...lista, nuevaReserva]);
      this._creditos.update(c => c - CREDITOS_POR_RESERVA);
      this._procesando.set(false);

      this.notificacion.success(`¡Reserva confirmada! Te esperamos en ${clase.nombre}`);
    }, 300);

    return true;
  }

  cancelarReserva(reservaId: number): void {
    const reserva = this._reservas().find(r => r.id === reservaId);
    
    if (!reserva) {
      return;
    }

    this._reservas.update(lista => lista.filter(r => r.id !== reservaId));
    this._creditos.update(c => c + CREDITOS_POR_RESERVA);
    this.notificacion.info('Reserva cancelada. Se ha devuelto 1 crédito');
  }

  estaReservada(claseId: number): boolean {
    return this._reservas().some(r => r.claseId === claseId);
  }
}
