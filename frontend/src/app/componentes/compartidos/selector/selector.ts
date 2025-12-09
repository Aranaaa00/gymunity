import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface OpcionSelector {
  valor: string;
  etiqueta: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-selector',
  imports: [],
  templateUrl: './selector.html',
  styleUrl: './selector.scss',
})
export class Selector {
  @Input() label: string = '';
  @Input() inputId: string = '';
  @Input() name: string = '';
  @Input() opciones: OpcionSelector[] = [];
  @Input() placeholder: string = 'Selecciona una opción';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() errorMessage: string = '';
  @Input() helpText: string = '';
  @Input() hasError: boolean = false;

  @Output() cambio = new EventEmitter<string>();

  onChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.cambio.emit(select.value);
  }
}
