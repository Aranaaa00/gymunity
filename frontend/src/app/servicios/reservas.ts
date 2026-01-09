import { Injectable, signal, computed, inject } from '@angular/core';
import { AuthService } from './auth';
import { NotificacionService } from './notificacion';
import { PerfilService } from './perfil';
import { ModalService } from './modal';

// ============================================
// SERVICIO DE RESERVAS
// ============================================

@Injectable({ providedIn: 'root' })
export class ReservasService {
  private readonly auth = inject(AuthService);
  private readonly notificacion = inject(NotificacionService);
  private readonly perfilService = inject(PerfilService);
  private readonly modal = inject(ModalService);

  private readonly _procesando = signal(false);

  readonly procesando = this._procesando.asReadonly();
  readonly creditos = this.perfilService.creditos;
  readonly creditosRestantes = this.perfilService.creditosRestantes;
  readonly clasesReservadas = this.perfilService.clases;

  readonly clasesReservadasIds = computed(() => {
    return new Set(this.clasesReservadas().map(c => c.claseId));
  });

  readonly puedeReservar = computed(() => {
    const tieneCreditos = this.creditos() > 0;
    const estaAutenticado = this.auth.estaAutenticado();
    const noProcesando = !this._procesando();
    return tieneCreditos && estaAutenticado && noProcesando;
  });

  reservarClase(claseId: number, nombreClase: string, fechaClase: string): void {
    if (!this.puedeReservar()) {
      if (!this.auth.estaAutenticado()) {
        this.modal.requerirRegistro();
      } else if (this.creditos() <= 0) {
        this.notificacion.error('No te quedan créditos. Cancela una clase para recuperar créditos.');
      }
      return;
    }

    if (this.estaReservada(claseId)) {
      this.notificacion.warning('Ya tienes una reserva para esta clase');
      return;
    }

    this._procesando.set(true);

    this.perfilService.inscribirEnClase(claseId, fechaClase).subscribe({
      next: () => {
        this._procesando.set(false);
        this.notificacion.success(`¡Reserva confirmada! Te esperamos en ${nombreClase}`);
      },
      error: (err) => {
        this._procesando.set(false);
        const mensaje = err.error?.mensaje ?? 'Error al realizar la reserva';
        this.notificacion.error(mensaje);
        console.error('Error en reserva:', err);
      }
    });
  }

  cancelarReserva(claseId: number): void {
    this._procesando.set(true);

    this.perfilService.cancelarInscripcion(claseId).subscribe({
      next: (response) => {
        this._procesando.set(false);
        if (response.reembolso) {
          this.notificacion.success('Reserva cancelada. Se ha devuelto 1 crédito.');
        } else {
          this.notificacion.info('Reserva cancelada. No se devuelve crédito (menos de 24h para la clase).');
        }
      },
      error: (err) => {
        this._procesando.set(false);
        const mensaje = err.error?.mensaje ?? 'Error al cancelar la reserva';
        this.notificacion.error(mensaje);
        console.error('Error cancelando reserva:', err);
      }
    });
  }

  estaReservada(claseId: number): boolean {
    return this.perfilService.estaInscrito(claseId);
  }
}
