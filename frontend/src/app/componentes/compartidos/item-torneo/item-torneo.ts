import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { Icono } from '../icono/icono';

// ============================================
// COMPONENTE ITEM TORNEO
// ============================================

@Component({
  selector: 'app-item-torneo',
  standalone: true,
  imports: [Icono],
  templateUrl: './item-torneo.html',
  styleUrl: './item-torneo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemTorneo {
  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly nombre = input.required<string>();
  readonly fecha = input.required<string>();
  readonly disciplina = input<string>('');

  // ----------------------------------------
  // Métodos
  // ----------------------------------------
  formatearFecha(): string {
    const fechaStr = this.fecha();
    if (!fechaStr) return '';
    
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return fechaStr;
    }
  }
}
