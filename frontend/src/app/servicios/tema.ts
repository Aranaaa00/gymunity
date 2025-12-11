import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

// ============================================
// TIPOS
// ============================================

export type Tema = 'claro' | 'oscuro';

type ManejadorCambioEsquema = (evento: MediaQueryListEvent) => void;

// ============================================
// CONSTANTES
// ============================================

const TEMA_CLARO: Tema = 'claro';
const TEMA_OSCURO: Tema = 'oscuro';
const CLAVE_STORAGE = 'tema';
const ATRIBUTO_TEMA = 'data-tema';
const MEDIA_QUERY_OSCURO = '(prefers-color-scheme: dark)';

// ============================================
// SERVICIO DE TEMA
// ============================================

@Injectable({ providedIn: 'root' })
export class TemaService {
  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly documento = inject(DOCUMENT);
  private readonly esBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // ----------------------------------------
  // Estado público
  // ----------------------------------------
  readonly tema = signal<Tema>(this.obtenerTemaInicial());

  // ----------------------------------------
  // Constructor
  // ----------------------------------------
  constructor() {
    const noEsBrowser = !this.esBrowser;

    if (noEsBrowser) {
      return;
    }

    this.inicializarEfectoTema();
    this.inicializarListenerSistema();
  }

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  alternar(): void {
    this.tema.update((actual: Tema): Tema => {
      const esOscuro = actual === TEMA_OSCURO;
      const nuevoTema = esOscuro ? TEMA_CLARO : TEMA_OSCURO;

      return nuevoTema;
    });
  }

  esOscuro(): boolean {
    const temaActual = this.tema();
    const esTemOscuro = temaActual === TEMA_OSCURO;

    return esTemOscuro;
  }

  // ----------------------------------------
  // Métodos privados - Inicialización
  // ----------------------------------------
  private inicializarEfectoTema(): void {
    effect((): void => {
      const temaActual = this.tema();
      this.aplicarTema(temaActual);
    });
  }

  private inicializarListenerSistema(): void {
    const mediaQuery = window.matchMedia(MEDIA_QUERY_OSCURO);

    const manejadorCambio: ManejadorCambioEsquema = (
      evento: MediaQueryListEvent
    ): void => {
      this.procesarCambioEsquemaSistema(evento.matches);
    };

    mediaQuery.addEventListener('change', manejadorCambio);
  }

  // ----------------------------------------
  // Métodos privados - Procesamiento
  // ----------------------------------------
  private procesarCambioEsquemaSistema(prefiereOscuro: boolean): void {
    const temaGuardado = localStorage.getItem(CLAVE_STORAGE);
    const hayTemaGuardado = temaGuardado !== null;

    if (hayTemaGuardado) {
      return;
    }

    const nuevoTema = prefiereOscuro ? TEMA_OSCURO : TEMA_CLARO;
    this.tema.set(nuevoTema);
  }

  private obtenerTemaInicial(): Tema {
    const noEsBrowser = !this.esBrowser;

    if (noEsBrowser) {
      return TEMA_CLARO;
    }

    const temaGuardado = localStorage.getItem(CLAVE_STORAGE) as Tema | null;
    const hayTemaGuardado = temaGuardado !== null;

    if (hayTemaGuardado) {
      return temaGuardado;
    }

    const prefiereOscuro = window.matchMedia(MEDIA_QUERY_OSCURO).matches;
    const temaDelSistema = prefiereOscuro ? TEMA_OSCURO : TEMA_CLARO;

    return temaDelSistema;
  }

  private aplicarTema(tema: Tema): void {
    this.documento.documentElement.setAttribute(ATRIBUTO_TEMA, tema);
    localStorage.setItem(CLAVE_STORAGE, tema);
  }
}
