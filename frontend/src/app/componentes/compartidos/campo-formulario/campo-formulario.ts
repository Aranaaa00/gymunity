import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-campo-formulario',
  imports: [],
  templateUrl: './campo-formulario.html',
  styleUrl: './campo-formulario.scss',
})
export class CampoFormulario {
  @Input() label: string = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' = 'text';
  @Input() inputId: string = '';
  @Input() name: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() errorMessage: string = '';
  @Input() helpText: string = '';
  @Input() hasError: boolean = false;

  @Output() blur = new EventEmitter<string>();

  onBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.blur.emit(input.value);
  }
}
