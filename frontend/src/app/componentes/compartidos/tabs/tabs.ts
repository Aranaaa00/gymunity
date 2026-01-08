import { Component, input, signal, HostListener, output, InputSignal, OutputEmitterRef, ChangeDetectionStrategy } from '@angular/core';

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
  readonly pestanas: InputSignal<readonly string[]> = input.required<readonly string[]>();

  // ----------------------------------------
  // Outputs
  // ----------------------------------------
  readonly tabCambiado: OutputEmitterRef<number> = output<number>();

  // ----------------------------------------
  // Estado
  // ----------------------------------------
  readonly tabActivo = signal<number>(0);

  // ----------------------------------------
  // Event Handlers
  // ----------------------------------------
  @HostListener('keydown', ['$event'])
  onKeydown(evento: KeyboardEvent): void {
    const totalPestanas = this.pestanas().length;
    const noHayPestanas = totalPestanas === 0;

    if (noHayPestanas) {
      return;
    }

    const nuevoIndice = this.calcularNuevoIndice(evento.key, totalPestanas);
    const teclaNoReconocida = nuevoIndice === null;

    if (teclaNoReconocida) {
      return;
    }

    evento.preventDefault();
    this.seleccionarTab(nuevoIndice);
  }

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  seleccionarTab(indice: number): void {
    const totalPestanas = this.pestanas().length;
    const indiceInvalido = indice < 0 || indice >= totalPestanas;

    if (indiceInvalido) {
      return;
    }

    this.tabActivo.set(indice);
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
