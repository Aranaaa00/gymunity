import { Component, input, output, ChangeDetectionStrategy, computed } from '@angular/core';
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
  readonly nombre = input.required<string>();
  readonly especialidad = input.required<string>();
  readonly foto = input<string>('');
  readonly valoracion = input<number | null>(null);
  readonly proximaClase = input<string>('');
  readonly reservada = input<boolean>(false);

  readonly reservar = output<void>();

  readonly textoBoton = computed(() => this.reservada() ? 'Reservada' : 'Reservar clase');

  onReservar(): void {
    if (!this.reservada()) {
      this.reservar.emit();
    }
  }

  formatearValoracion(): string {
    const val = this.valoracion();
    if (val === null) return '';
    return val.toFixed(1);
  }
}
