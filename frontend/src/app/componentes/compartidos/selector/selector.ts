import { Component, input, output, InputSignal, OutputEmitterRef, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Selector),
      multi: true,
    },
  ],
})
export class Selector implements ControlValueAccessor {
  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly label: InputSignal<string> = input<string>(LABEL_DEFECTO);
  readonly inputId: InputSignal<string> = input<string>(LABEL_DEFECTO);
  readonly name: InputSignal<string> = input<string>(LABEL_DEFECTO);
  readonly opciones: InputSignal<readonly (OpcionSelector | string)[]> = input<readonly (OpcionSelector | string)[]>([]);
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
  // Estado
  // ----------------------------------------
  value = '';
  isDisabled = false;
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  // ----------------------------------------
  // ControlValueAccessor
  // ----------------------------------------
  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  // ----------------------------------------
  // Helpers
  // ----------------------------------------
  getValorOpcion(opcion: OpcionSelector | string): string {
    return typeof opcion === 'string' ? opcion : opcion.valor;
  }

  getEtiquetaOpcion(opcion: OpcionSelector | string): string {
    return typeof opcion === 'string' ? opcion : opcion.etiqueta;
  }

  isOpcionDisabled(opcion: OpcionSelector | string): boolean {
    return typeof opcion === 'string' ? false : !!opcion.disabled;
  }

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  onChangeEvent(evento: Event): void {
    const select = evento.target as HTMLSelectElement;
    const valorSeleccionado = select.value;

    this.value = valorSeleccionado;
    this.onChange(valorSeleccionado);
    this.cambio.emit(valorSeleccionado);
  }

  onBlur(): void {
    this.onTouched();
  }

  // ----------------------------------------
  // Accesibilidad
  // ----------------------------------------
  getAriaDescribedBy(): string | null {
    const ids: string[] = [];
    const id = this.inputId();

    if (this.helpText() && !this.hasError()) {
      ids.push(`${id}-help`);
    }
    if (this.hasError() && this.errorMessage()) {
      ids.push(`${id}-error`);
    }

    return ids.length > 0 ? ids.join(' ') : null;
  }
}
