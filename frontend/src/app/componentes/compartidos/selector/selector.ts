import { Component, input, output, InputSignal, OutputEmitterRef } from '@angular/core';

// ============================================
// INTERFACES
// ============================================

export interface OpcionSelector {
  readonly valor: string;
  readonly etiqueta: string;
  readonly disabled?: boolean;
}

// ============================================
// CONSTANTES
// ============================================

const LABEL_DEFECTO = '';
const PLACEHOLDER_DEFECTO = 'Selecciona una opción';
const MENSAJE_ERROR_DEFECTO = '';
const TEXTO_AYUDA_DEFECTO = '';

// ============================================
// COMPONENTE SELECTOR
// ============================================

@Component({
  selector: 'app-selector',
  standalone: true,
  imports: [],
  templateUrl: './selector.html',
  styleUrl: './selector.scss',
})
export class Selector {
  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly label: InputSignal<string> = input<string>(LABEL_DEFECTO);
  readonly inputId: InputSignal<string> = input<string>(LABEL_DEFECTO);
  readonly name: InputSignal<string> = input<string>(LABEL_DEFECTO);
  readonly opciones: InputSignal<readonly OpcionSelector[]> = input<readonly OpcionSelector[]>([]);
  readonly placeholder: InputSignal<string> = input<string>(PLACEHOLDER_DEFECTO);
  readonly required: InputSignal<boolean> = input<boolean>(false);
  readonly disabled: InputSignal<boolean> = input<boolean>(false);
  readonly errorMessage: InputSignal<string> = input<string>(MENSAJE_ERROR_DEFECTO);
  readonly helpText: InputSignal<string> = input<string>(TEXTO_AYUDA_DEFECTO);
  readonly hasError: InputSignal<boolean> = input<boolean>(false);

  // ----------------------------------------
  // Outputs
  // ----------------------------------------
  readonly cambio: OutputEmitterRef<string> = output<string>();

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  onChange(evento: Event): void {
    const select = evento.target as HTMLSelectElement;
    const valorSeleccionado = select.value;

    this.cambio.emit(valorSeleccionado);
  }
}
