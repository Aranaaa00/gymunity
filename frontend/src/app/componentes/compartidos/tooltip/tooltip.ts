import {
  Component,
  input,
  signal,
  HostListener,
  OnDestroy,
  inject,
  PLATFORM_ID,
  ElementRef,
  Renderer2,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

// ============================================
// TIPOS
// ============================================

export type PosicionTooltip = 'arriba' | 'abajo' | 'izquierda' | 'derecha';

interface Coordenadas {
  readonly top: number;
  readonly left: number;
}

interface ScrollPosition {
  readonly x: number;
  readonly y: number;
}

// ============================================
// CONSTANTES
// ============================================

const OFFSET_TOOLTIP = 8;
const MARGEN_VIEWPORT = 8;
const DURACION_ANIMACION_SALIDA = 150;

const CLASE_BASE = 'tooltip';
const CLASE_VISIBLE = 'tooltip--visible';
const PREFIJO_CLASE_POSICION = 'tooltip--';

// ============================================
// COMPONENTE TOOLTIP
// ============================================

@Component({
  selector: 'app-tooltip',
  standalone: true,
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tooltip-contenedor',
    '[attr.aria-describedby]': 'idTooltip()',
  },
})
export class Tooltip implements OnDestroy {
  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly texto = input.required<string>();
  readonly posicion = input<PosicionTooltip>('arriba');
  readonly retraso = input<number>(200);

  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly esBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly documento = inject(DOCUMENT);
  private readonly elementoRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  // ----------------------------------------
  // Estado privado
  // ----------------------------------------
  private elementoTooltip: HTMLElement | null = null;
  private temporizador: ReturnType<typeof setTimeout> | undefined = undefined;

  // ----------------------------------------
  // Estado público
  // ----------------------------------------
  private readonly visible = signal<boolean>(false);
  readonly idTooltip = signal<string | null>(null);

  // ----------------------------------------
  // Event Handlers
  // ----------------------------------------
  @HostListener('mouseenter')
  @HostListener('focus')
  onEnter(): void {
    const noEsBrowser = !this.esBrowser;
    const noHayTexto = !this.texto();

    if (noEsBrowser || noHayTexto) {
      return;
    }

    this.cancelarTemporizador();
    this.programarMostrar();
  }

  @HostListener('mouseleave')
  @HostListener('blur')
  @HostListener('keydown.escape')
  onLeave(): void {
    this.ocultar();
  }

  // ----------------------------------------
  // Lifecycle Hooks
  // ----------------------------------------
  ngOnDestroy(): void {
    this.ocultar();
  }

  // ----------------------------------------
  // Métodos privados - Mostrar/Ocultar
  // ----------------------------------------
  private programarMostrar(): void {
    this.temporizador = setTimeout(() => {
      this.mostrar();
    }, this.retraso());
  }

  private mostrar(): void {
    const yaEsVisible = this.visible();

    if (yaEsVisible) {
      return;
    }

    const id = this.generarId();
    this.idTooltip.set(id);

    this.crearElementoTooltip(id);
    this.posicionarTooltip();
    this.animarEntrada();

    this.visible.set(true);
  }

  private ocultar(): void {
    this.cancelarTemporizador();

    const hayElemento = this.elementoTooltip !== null;

    if (hayElemento) {
      this.animarSalida();
    }

    this.idTooltip.set(null);
    this.visible.set(false);
  }

  // ----------------------------------------
  // Métodos privados - Creación de elementos
  // ----------------------------------------
  private generarId(): string {
    return `tooltip-${Date.now()}`;
  }

  private crearElementoTooltip(id: string): void {
    this.elementoTooltip = this.renderer.createElement('div');

    this.renderer.addClass(this.elementoTooltip, CLASE_BASE);
    this.renderer.addClass(this.elementoTooltip, `${PREFIJO_CLASE_POSICION}${this.posicion()}`);
    this.renderer.setAttribute(this.elementoTooltip, 'role', 'tooltip');
    this.renderer.setAttribute(this.elementoTooltip, 'id', id);

    const textoNodo = this.renderer.createText(this.texto());
    this.renderer.appendChild(this.elementoTooltip, textoNodo);
    this.renderer.appendChild(this.documento.body, this.elementoTooltip);
  }

  // ----------------------------------------
  // Métodos privados - Animaciones
  // ----------------------------------------
  private animarEntrada(): void {
    requestAnimationFrame(() => {
      const elementoExiste = this.elementoTooltip !== null;

      if (!elementoExiste) {
        return;
      }

      this.renderer.addClass(this.elementoTooltip, CLASE_VISIBLE);
    });
  }

  private animarSalida(): void {
    this.renderer.removeClass(this.elementoTooltip, CLASE_VISIBLE);

    setTimeout(() => {
      this.removerElementoTooltip();
    }, DURACION_ANIMACION_SALIDA);
  }

  private removerElementoTooltip(): void {
    const elementoExiste = this.elementoTooltip !== null;

    if (!elementoExiste) {
      return;
    }

    this.renderer.removeChild(this.documento.body, this.elementoTooltip);
    this.elementoTooltip = null;
  }

  // ----------------------------------------
  // Métodos privados - Posicionamiento
  // ----------------------------------------
  private posicionarTooltip(): void {
    const noHayElemento = this.elementoTooltip === null;

    if (noHayElemento) {
      return;
    }

    const rectHost = this.elementoRef.nativeElement.getBoundingClientRect();
    const rectTooltip = this.elementoTooltip!.getBoundingClientRect();
    const scroll = this.obtenerScrollPosition();

    const coordenadasIniciales = this.calcularCoordenadas(rectHost, rectTooltip, scroll);
    const coordenadasAjustadas = this.ajustarAlViewport(coordenadasIniciales, rectTooltip, scroll);

    this.aplicarEstilosPosicion(coordenadasAjustadas);
  }

  private obtenerScrollPosition(): ScrollPosition {
    return {
      x: window.scrollX,
      y: window.scrollY,
    };
  }

  private calcularCoordenadas(
    rectHost: DOMRect,
    rectTooltip: DOMRect,
    scroll: ScrollPosition
  ): Coordenadas {
    const posicionActual = this.posicion();

    const calculadores: Record<PosicionTooltip, () => Coordenadas> = {
      arriba: () => ({
        top: rectHost.top + scroll.y - rectTooltip.height - OFFSET_TOOLTIP,
        left: rectHost.left + scroll.x + (rectHost.width - rectTooltip.width) / 2,
      }),
      abajo: () => ({
        top: rectHost.bottom + scroll.y + OFFSET_TOOLTIP,
        left: rectHost.left + scroll.x + (rectHost.width - rectTooltip.width) / 2,
      }),
      izquierda: () => ({
        top: rectHost.top + scroll.y + (rectHost.height - rectTooltip.height) / 2,
        left: rectHost.left + scroll.x - rectTooltip.width - OFFSET_TOOLTIP,
      }),
      derecha: () => ({
        top: rectHost.top + scroll.y + (rectHost.height - rectTooltip.height) / 2,
        left: rectHost.right + scroll.x + OFFSET_TOOLTIP,
      }),
    };

    return calculadores[posicionActual]();
  }

  private ajustarAlViewport(
    coordenadas: Coordenadas,
    rectTooltip: DOMRect,
    scroll: ScrollPosition
  ): Coordenadas {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let { top, left } = coordenadas;

    // Ajuste horizontal
    const saleIzquierda = left < MARGEN_VIEWPORT;
    const saleDerecha = left + rectTooltip.width > viewportWidth - MARGEN_VIEWPORT;

    if (saleIzquierda) {
      left = MARGEN_VIEWPORT;
    } else if (saleDerecha) {
      left = viewportWidth - rectTooltip.width - MARGEN_VIEWPORT;
    }

    // Ajuste vertical
    const saleArriba = top < MARGEN_VIEWPORT + scroll.y;
    const saleAbajo = top + rectTooltip.height > viewportHeight + scroll.y - MARGEN_VIEWPORT;

    if (saleArriba) {
      top = MARGEN_VIEWPORT + scroll.y;
    } else if (saleAbajo) {
      top = viewportHeight + scroll.y - rectTooltip.height - MARGEN_VIEWPORT;
    }

    return { top, left };
  }

  private aplicarEstilosPosicion(coordenadas: Coordenadas): void {
    this.renderer.setStyle(this.elementoTooltip, 'position', 'absolute');
    this.renderer.setStyle(this.elementoTooltip, 'top', `${coordenadas.top}px`);
    this.renderer.setStyle(this.elementoTooltip, 'left', `${coordenadas.left}px`);
  }

  // ----------------------------------------
  // Métodos privados - Temporizador
  // ----------------------------------------
  private cancelarTemporizador(): void {
    const noHayTemporizador = this.temporizador === undefined;

    if (noHayTemporizador) {
      return;
    }

    clearTimeout(this.temporizador);
    this.temporizador = undefined;
  }
}
