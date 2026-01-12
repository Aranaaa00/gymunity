import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { Icono } from '../icono/icono';

// ============================================
// COMPONENTE PAGINACIÓN
// ============================================

@Component({
  selector: 'app-paginacion',
  standalone: true,
  imports: [Icono],
  templateUrl: './paginacion.html',
  styleUrl: './paginacion.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Paginacion {
  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly paginaActual = input.required<number>();
  readonly totalPaginas = input.required<number>();
  readonly ariaLabel = input<string>('Paginación');

  // ----------------------------------------
  // Outputs
  // ----------------------------------------
  readonly anterior = output<void>();
  readonly siguiente = output<void>();

  // ----------------------------------------
  // Computed
  // ----------------------------------------
  readonly puedeIrAtras = (): boolean => this.paginaActual() > 0;
  readonly puedeIrAdelante = (): boolean => this.paginaActual() < this.totalPaginas() - 1;

  // ----------------------------------------
  // Métodos
  // ----------------------------------------
  irAnterior(): void {
    if (this.puedeIrAtras()) {
      this.anterior.emit();
    }
  }

  irSiguiente(): void {
    if (this.puedeIrAdelante()) {
      this.siguiente.emit();
    }
  }
}
