import { Component, inject, computed, Signal, ChangeDetectionStrategy } from '@angular/core';
import { Icono } from '../icono/icono';
import { TemaService } from '../../../servicios/tema';

// ============================================
// COMPONENTE BOTÓN TEMA
// ============================================

@Component({
  selector: 'app-boton-tema',
  standalone: true,
  imports: [Icono],
  templateUrl: './boton-tema.html',
  styleUrl: './boton-tema.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BotonTema {
  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly temaService = inject(TemaService);

  // ----------------------------------------
  // Señales computadas
  // ----------------------------------------
  readonly esOscuro: Signal<boolean> = computed((): boolean => {
    const temaOscuro = this.temaService.esOscuro();

    return temaOscuro;
  });

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  alternar(): void {
    this.temaService.alternar();
  }
}
