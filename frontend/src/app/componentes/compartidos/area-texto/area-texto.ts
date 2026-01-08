import { Component, input, output, InputSignal, OutputEmitterRef, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// ============================================
// CONSTANTES
// ============================================

const FILAS_DEFECTO = 4;

// ============================================
// COMPONENTE ÁREA DE TEXTO
// ============================================

@Component({
  selector: 'app-area-texto',
  standalone: true,
  imports: [],
  templateUrl: './area-texto.html',
  styleUrl: './area-texto.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AreaTexto),
      multi: true,
    },
  ],
})
export class AreaTexto implements ControlValueAccessor {
  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly label: InputSignal<string> = input<string>('');
  readonly inputId: InputSignal<string> = input<string>('');
  readonly name: InputSignal<string> = input<string>('');
  readonly placeholder: InputSignal<string> = input<string>('');
  readonly required: InputSignal<boolean> = input<boolean>(false);
  readonly disabled: InputSignal<boolean> = input<boolean>(false);
  readonly errorMessage: InputSignal<string> = input<string>('');
  readonly helpText: InputSignal<string> = input<string>('');
  readonly hasError: InputSignal<boolean> = input<boolean>(false);
  readonly rows: InputSignal<number> = input<number>(FILAS_DEFECTO);
  readonly maxlength: InputSignal<number | null> = input<number | null>(null);

  // ----------------------------------------
  // Outputs
  // ----------------------------------------
  readonly blur: OutputEmitterRef<string> = output<string>();

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
  // Métodos públicos
  // ----------------------------------------
  onInput(evento: Event): void {
    const textarea = evento.target as HTMLTextAreaElement;
    this.value = textarea.value;
    this.onChange(this.value);
  }

  onBlurEvent(evento: Event): void {
    const textarea = evento.target as HTMLTextAreaElement;
    const valor = textarea.value;

    this.onTouched();
    this.blur.emit(valor);
  }
}
