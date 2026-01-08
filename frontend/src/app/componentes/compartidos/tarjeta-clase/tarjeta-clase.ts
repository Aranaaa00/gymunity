import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
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
  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly nombre = input.required<string>();
  readonly profesorNombre = input<string>('');
  readonly icono = input<NombreIcono>('dumbbell');

  // ----------------------------------------
  // Outputs
  // ----------------------------------------
  readonly reservar = output<void>();

  // ----------------------------------------
  // Métodos
  // ----------------------------------------
  onReservar(): void {
    this.reservar.emit();
  }
}
