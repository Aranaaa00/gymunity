import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { Icono } from '../icono/icono';

// ============================================
// COMPONENTE TARJETA RESEÑA
// ============================================

@Component({
  selector: 'app-tarjeta-resenia',
  standalone: true,
  imports: [Icono],
  templateUrl: './tarjeta-resenia.html',
  styleUrl: './tarjeta-resenia.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TarjetaResenia {
  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly nombre = input.required<string>();
  readonly titulo = input<string>('');
  readonly texto = input.required<string>();
  readonly foto = input<string>('');
}
