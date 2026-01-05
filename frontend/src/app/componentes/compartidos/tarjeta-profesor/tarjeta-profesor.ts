import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { Icono } from '../icono/icono';

// ============================================
// COMPONENTE TARJETA PROFESOR
// ============================================

@Component({
  selector: 'app-tarjeta-profesor',
  standalone: true,
  imports: [Icono],
  templateUrl: './tarjeta-profesor.html',
  styleUrl: './tarjeta-profesor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TarjetaProfesor {
  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly nombre = input.required<string>();
  readonly especialidad = input.required<string>();
  readonly foto = input<string>('');
  readonly valoracion = input<number | null>(null);

  // ----------------------------------------
  // Outputs
  // ----------------------------------------
  readonly apuntarse = output<void>();

  // ----------------------------------------
  // Métodos
  // ----------------------------------------
  onApuntarse(): void {
    this.apuntarse.emit();
  }

  formatearValoracion(): string {
    const val = this.valoracion();
    if (val === null) return '';
    return val.toFixed(1);
  }
}
