import { Component, input, signal, forwardRef, InputSignal, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormControl } from '@angular/forms';

// ============================================
// TIPOS
// ============================================

type TipoInput = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
type OnChangeFn = (value: string) => void;
type OnTouchedFn = () => void;

// ============================================
// CONSTANTES
// ============================================

const TIPO_INPUT_DEFAULT: TipoInput = 'text';
const VALOR_VACIO = '';

// ============================================
// COMPONENTE
// ============================================

@Component({
  selector: 'app-campo-formulario',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './campo-formulario.html',
  styleUrl: './campo-formulario.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CampoFormulario),
      multi: true,
    },
  ],
})
export class CampoFormulario implements ControlValueAccessor {
  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly label: InputSignal<string> = input<string>('');
  readonly type: InputSignal<TipoInput> = input<TipoInput>(TIPO_INPUT_DEFAULT);
  readonly inputId: InputSignal<string> = input<string>('');
  readonly name: InputSignal<string> = input<string>('');
  readonly placeholder: InputSignal<string> = input<string>('');
  readonly required: InputSignal<boolean> = input<boolean>(false);
  readonly errorMessage: InputSignal<string> = input<string>('');
  readonly helpText: InputSignal<string> = input<string>('');
  readonly hasError: InputSignal<boolean> = input<boolean>(false);
  readonly formControl: InputSignal<FormControl | undefined> = input<FormControl | undefined>(undefined);
  readonly validando: InputSignal<boolean> = input<boolean>(false);
  readonly mensajeExito: InputSignal<string> = input<string>('');
  readonly autocomplete: InputSignal<string> = input<string>('on');

  // ----------------------------------------
  // Estado interno (signals para mutabilidad)
  // ----------------------------------------
  readonly value = signal<string>(VALOR_VACIO);
  readonly disabled = signal<boolean>(false);

  // ----------------------------------------
  // Callbacks de ControlValueAccessor
  // ----------------------------------------
  private onChange: OnChangeFn = (): void => {};
  private onTouched: OnTouchedFn = (): void => {};

  // ----------------------------------------
  // ControlValueAccessor - Implementación
  // ----------------------------------------
  writeValue(value: string): void {
    const valorNormalizado = value ?? VALOR_VACIO;
    this.value.set(valorNormalizado);
  }

  registerOnChange(fn: OnChangeFn): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedFn): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  // ----------------------------------------
  // Event Handlers
  // ----------------------------------------
  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const nuevoValor = inputElement.value;

    this.value.set(nuevoValor);
    this.onChange(nuevoValor);
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
    
    if (this.helpText()) {
      ids.push(`${id}-help`);
    }
    if (this.hasError() && this.errorMessage()) {
      ids.push(`${id}-error`);
    }
    
    return ids.length > 0 ? ids.join(' ') : null;
  }
}
