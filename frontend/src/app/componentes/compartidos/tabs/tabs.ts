import { Component, input, HostListener, output, ChangeDetectionStrategy } from '@angular/core';

// ============================================
// CONSTANTES
// ============================================

const TECLA_ARROW_LEFT = 'ArrowLeft';
const TECLA_ARROW_RIGHT = 'ArrowRight';
const TECLA_HOME = 'Home';
const TECLA_END = 'End';

// ============================================
// COMPONENTE TABS
// ============================================

@Component({
  selector: 'app-tabs',
  standalone: true,
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'tabs' },
})
export class Tabs {
  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly pestanas = input.required<readonly string[]>();
  readonly tabActivo = input<number>(0);

  // ----------------------------------------
  // Outputs
  // ----------------------------------------
  readonly tabCambiado = output<number>();

  // ----------------------------------------
  // Event Handlers
  // ----------------------------------------
  @HostListener('keydown', ['$event'])
  onKeydown(evento: KeyboardEvent): void {
    const totalPestanas = this.pestanas().length;
    
    if (totalPestanas === 0) {
      return;
    }

    const nuevoIndice = this.calcularNuevoIndice(evento.key, totalPestanas);
    
    if (nuevoIndice === null) {
      return;
    }

    evento.preventDefault();
    this.tabCambiado.emit(nuevoIndice);
  }

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  seleccionarTab(indice: number): void {
    const totalPestanas = this.pestanas().length;
    
    if (indice < 0 || indice >= totalPestanas) {
      return;
    }

    this.tabCambiado.emit(indice);
  }

  // ----------------------------------------
  // Métodos privados
  // ----------------------------------------
  private calcularNuevoIndice(tecla: string, total: number): number | null {
    const indiceActual = this.tabActivo();

    switch (tecla) {
      case TECLA_ARROW_LEFT:
        return (indiceActual - 1 + total) % total;

      case TECLA_ARROW_RIGHT:
        return (indiceActual + 1) % total;

      case TECLA_HOME:
        return 0;

      case TECLA_END:
        return total - 1;

      default:
        return null;
    }
  }
}
