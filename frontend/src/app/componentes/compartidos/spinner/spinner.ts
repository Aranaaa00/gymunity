import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

// ============================================
// TIPOS
// ============================================

export type SpinnerTamano = 'sm' | 'md' | 'lg';

// ============================================
// CONSTANTES
// ============================================

const TEXTO_DEFAULT = 'Cargando';

const TAMANOS_ICONO: Record<SpinnerTamano, number> = {
  sm: 24,
  md: 40,
  lg: 64,
};

// ============================================
// COMPONENTE SPINNER
// ============================================

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Spinner {
  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly tamano = input<SpinnerTamano>('md');
  readonly texto = input<string>('');
  readonly porcentaje = input<number | null>(null);
  readonly overlay = input<boolean>(false);

  // ----------------------------------------
  // Propiedades computadas
  // ----------------------------------------
  readonly mostrarPorcentaje = computed<boolean>(() => {
    const porcentajeActual = this.porcentaje();
    return porcentajeActual !== null;
  });

  readonly iconoTamano = computed<number>(() => {
    const tamanoActual = this.tamano();
    return TAMANOS_ICONO[tamanoActual];
  });

  readonly textoCompleto = computed<string>(() => {
    const textoBase = this.texto() || TEXTO_DEFAULT;
    const mostrarPorcentaje = this.mostrarPorcentaje();

    if (!mostrarPorcentaje) {
      return `${textoBase}...`;
    }

    const porcentajeActual = this.porcentaje();
    const porcentajeRedondeado = Math.round(porcentajeActual!);

    return `${textoBase}... ${porcentajeRedondeado}%`;
  });
}
