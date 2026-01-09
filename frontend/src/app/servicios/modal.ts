import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { NotificacionService } from './notificacion';

// ============================================
// TIPOS
// ============================================

export type TipoModal = 'login' | 'registro' | null;

type ManejadorTeclado = (evento: KeyboardEvent) => void;

// ============================================
// CONSTANTES
// ============================================

const TECLA_ESCAPE = 'Escape';
const DELAY_MODAL_REGISTRO_MS = 2000;

// ============================================
// SERVICIO MODAL
// ============================================

@Injectable({ providedIn: 'root' })
export class ModalService {
  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly documento = inject(DOCUMENT);
  private readonly esBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly notificacion = inject(NotificacionService);

  // ----------------------------------------
  // Estado privado
  // ----------------------------------------
  private manejadorTeclado: ManejadorTeclado | null = null;

  // ----------------------------------------
  // Estado público
  // ----------------------------------------
  readonly modalActivo = signal<TipoModal>(null);

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  abrirLogin(): void {
    this.abrir('login');
  }

  abrirRegistro(): void {
    this.abrir('registro');
  }

  /**
   * Muestra toast de "Debes registrarte" y abre modal de registro tras 2 segundos
   */
  requerirRegistro(): void {
    this.notificacion.info('Debes registrarte para realizar esta acción');
    
    setTimeout(() => {
      this.abrirRegistro();
    }, DELAY_MODAL_REGISTRO_MS);
  }

  cerrar(): void {
    this.modalActivo.set(null);

    const noEsBrowser = !this.esBrowser;
    if (noEsBrowser) {
      return;
    }

    this.habilitarScroll();
    this.removerManejadorTeclado();
  }

  // ----------------------------------------
  // Métodos privados
  // ----------------------------------------
  private abrir(tipo: Exclude<TipoModal, null>): void {
    this.modalActivo.set(tipo);

    const noEsBrowser = !this.esBrowser;
    if (noEsBrowser) {
      return;
    }

    this.deshabilitarScroll();
    this.agregarManejadorTeclado();
  }

  private deshabilitarScroll(): void {
    this.documento.body.style.overflow = 'hidden';
  }

  private habilitarScroll(): void {
    this.documento.body.style.overflow = '';
  }

  private agregarManejadorTeclado(): void {
    this.manejadorTeclado = (evento: KeyboardEvent): void => {
      const esEscape = evento.key === TECLA_ESCAPE;

      if (!esEscape) {
        return;
      }

      evento.preventDefault();
      this.cerrar();
    };

    this.documento.addEventListener('keydown', this.manejadorTeclado);
  }

  private removerManejadorTeclado(): void {
    const manejador = this.manejadorTeclado;
    const noHayManejador = manejador === null;

    if (noHayManejador) {
      return;
    }

    this.documento.removeEventListener('keydown', manejador);
    this.manejadorTeclado = null;
  }
}
