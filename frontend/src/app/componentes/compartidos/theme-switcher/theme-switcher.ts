import { Component, inject, computed, Signal, ChangeDetectionStrategy } from '@angular/core';
import { Icono } from '../icono/icono';
import { TemaService } from '../../../servicios/tema';

// ============================================
// COMPONENTE THEME SWITCHER
// ============================================

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [Icono],
  templateUrl: './theme-switcher.html',
  styleUrl: './theme-switcher.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSwitcher {
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
