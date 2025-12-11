import { Component, input, output, InputSignal, OutputEmitterRef } from '@angular/core';

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
})
export class AreaTexto {
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
  // Métodos públicos
  // ----------------------------------------
  onBlur(evento: Event): void {
    const textarea = evento.target as HTMLTextAreaElement;
    const valor = textarea.value;

    this.blur.emit(valor);
  }
}
