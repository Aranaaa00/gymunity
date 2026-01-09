import { Component, input, output, ChangeDetectionStrategy, computed } from '@angular/core';
import { Icono, NombreIcono } from '../icono/icono';

// ============================================
// COMPONENTE TARJETA CLASE
// ============================================

@Component({
  selector: 'app-tarjeta-clase',
  standalone: true,
  imports: [Icono],
  templateUrl: './tarjeta-clase.html',
  styleUrl: './tarjeta-clase.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TarjetaClase {
  readonly nombre = input.required<string>();
  readonly profesorNombre = input<string>('');
  readonly icono = input<NombreIcono>('dumbbell');
  readonly reservada = input<boolean>(false);

  readonly reservar = output<void>();

  readonly textoBoton = computed(() => this.reservada() ? 'Reservada' : 'Reservar plaza');

  onReservar(): void {
    if (!this.reservada()) {
      this.reservar.emit();
    }
  }
}
