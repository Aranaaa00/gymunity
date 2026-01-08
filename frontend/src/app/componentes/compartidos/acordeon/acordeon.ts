import { Component, input, signal, contentChildren, AfterContentInit, ChangeDetectionStrategy } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

// ============================================
// CONTADOR ÚNICO PARA IDS ACCESIBLES
// ============================================

let contadorIdGlobal = 0;

// ============================================
// CONSTANTES
// ============================================

const TECLA_ENTER = 'Enter';
const TECLA_ESPACIO = ' ';
const PREFIJO_PANEL = 'acordeon-panel';
const PREFIJO_HEADER = 'acordeon-header';

// ============================================
// COMPONENTE ACORDEON ITEM
// ============================================

@Component({
  selector: 'app-acordeon-item',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './acordeon.html',
  styleUrl: './acordeon.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'acordeon-item',
    '[class.acordeon-item--expandido]': 'expandido()',
  },
})
export class AcordeonItem {
  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly titulo = input.required<string>();
  readonly icono = input<string>('');
  readonly abierto = input<boolean>(false);

  // ----------------------------------------
  // Estado interno
  // ----------------------------------------
  readonly expandido = signal<boolean>(false);

  // ----------------------------------------
  // IDs para accesibilidad
  // ----------------------------------------
  private readonly id: number;
  readonly idPanel: string;
  readonly idHeader: string;

  // ----------------------------------------
  // Constructor
  // ----------------------------------------
  constructor() {
    this.id = ++contadorIdGlobal;
    this.idPanel = `${PREFIJO_PANEL}-${this.id}`;
    this.idHeader = `${PREFIJO_HEADER}-${this.id}`;

    this.inicializarEstadoAbierto();
  }

  // ----------------------------------------
  // Métodos de inicialización
  // ----------------------------------------
  private inicializarEstadoAbierto(): void {
    queueMicrotask(() => {
      const debeEstarAbierto = this.abierto();

      if (!debeEstarAbierto) {
        return;
      }

      this.expandido.set(true);
    });
  }

  // ----------------------------------------
  // Event Handlers
  // ----------------------------------------
  onKeydown(evento: KeyboardEvent): void {
    const esEnter = evento.key === TECLA_ENTER;
    const esEspacio = evento.key === TECLA_ESPACIO;
    const esTeclaValida = esEnter || esEspacio;

    if (!esTeclaValida) {
      return;
    }

    evento.preventDefault();
    this.alternar();
  }

  onClick(): void {
    this.alternar();
  }

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  alternar(): void {
    this.expandido.update((estadoActual) => !estadoActual);
  }

  abrir(): void {
    this.expandido.set(true);
  }

  cerrar(): void {
    this.expandido.set(false);
  }
}

// ============================================
// COMPONENTE ACORDEON CONTENEDOR
// ============================================

@Component({
  selector: 'app-acordeon',
  standalone: true,
  template: '<ng-content></ng-content>',
  styleUrl: './acordeon.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'acordeon',
    'role': 'presentation',
  },
})
export class Acordeon implements AfterContentInit {
  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly unico = input<boolean>(false);

  // ----------------------------------------
  // Content Children
  // ----------------------------------------
  private readonly items = contentChildren(AcordeonItem);

  // ----------------------------------------
  // Lifecycle Hooks
  // ----------------------------------------
  ngAfterContentInit(): void {
    const esModoUnico = this.unico();

    if (!esModoUnico) {
      return;
    }

    this.configurarModoUnico();
  }

  // ----------------------------------------
  // Métodos privados
  // ----------------------------------------
  private configurarModoUnico(): void {
    const todosLosItems = this.items();

    todosLosItems.forEach((item) => {
      this.envolverMetodoAlternar(item);
    });
  }

  private envolverMetodoAlternar(item: AcordeonItem): void {
    const alternarOriginal = item.alternar.bind(item);

    item.alternar = (): void => {
      const estaExpandido = item.expandido();

      if (!estaExpandido) {
        this.cerrarOtrosItems(item);
      }

      alternarOriginal();
    };
  }

  private cerrarOtrosItems(itemActivo: AcordeonItem): void {
    const todosLosItems = this.items();

    todosLosItems.forEach((item) => {
      const esOtroItem = item !== itemActivo;

      if (!esOtroItem) {
        return;
      }

      item.cerrar();
    });
  }
}
