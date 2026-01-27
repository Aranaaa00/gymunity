import { Component, output, ViewChild, ElementRef, AfterViewInit, inject, PLATFORM_ID, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Icono } from '../icono/icono';

// ============================================
// CONSTANTES
// ============================================

const SELECTOR_ENFOCABLE = 'input, button, [tabindex]:not([tabindex="-1"])';

// ============================================
// COMPONENTE VENTANA EMERGENTE
// ============================================

@Component({
  selector: 'app-ventana-emergente',
  standalone: true,
  imports: [Icono],
  templateUrl: './ventana-emergente.html',
  styleUrl: './ventana-emergente.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VentanaEmergente implements AfterViewInit {
  // ----------------------------------------
  // Outputs
  // ----------------------------------------
  readonly cerrar = output<void>();

  // ----------------------------------------
  // ViewChild
  // ----------------------------------------
  @ViewChild('contenido') contenido!: ElementRef<HTMLElement>;
  @ViewChild('botonCerrar') botonCerrar!: ElementRef<HTMLButtonElement>;

  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly esBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // ----------------------------------------
  // Estado privado
  // ----------------------------------------
  private elementoAnterior: HTMLElement | null = null;

  // ----------------------------------------
  // Lifecycle Hooks
  // ----------------------------------------
  ngAfterViewInit(): void {
    const noEsBrowser = !this.esBrowser;

    if (noEsBrowser) {
      return;
    }

    this.guardarElementoActivo();
    this.enfocarPrimerElemento();
  }

  // ----------------------------------------
  // Event Handlers
  // ----------------------------------------
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.emitirCerrar();
  }

  onOverlayClick(evento: MouseEvent): void {
    const clicEnOverlay = evento.target === evento.currentTarget;

    if (!clicEnOverlay) {
      return;
    }

    this.emitirCerrar();
  }

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  emitirCerrar(): void {
    this.restaurarFocoAnterior();
    this.cerrar.emit();
  }

  // ----------------------------------------
  // Métodos privados
  // ----------------------------------------
  private guardarElementoActivo(): void {
    this.elementoAnterior = document.activeElement as HTMLElement;
  }

  private enfocarPrimerElemento(): void {
    requestAnimationFrame(() => {
      const elementoEnfocable = this.buscarElementoEnfocable();
      elementoEnfocable?.focus();
    });
  }

  private buscarElementoEnfocable(): HTMLElement | null {
    const elementoEnContenido = this.contenido?.nativeElement?.querySelector<HTMLElement>(SELECTOR_ENFOCABLE);
    const botonCerrarElement = this.botonCerrar?.nativeElement;

    return elementoEnContenido ?? botonCerrarElement ?? null;
  }

  private restaurarFocoAnterior(): void {
    this.elementoAnterior?.focus();
  }
}
