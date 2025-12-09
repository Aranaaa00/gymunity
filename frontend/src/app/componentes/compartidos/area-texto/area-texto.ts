import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-area-texto',
  imports: [],
  templateUrl: './area-texto.html',
  styleUrl: './area-texto.scss',
})
export class AreaTexto {
  @Input() label: string = '';
  @Input() inputId: string = '';
  @Input() name: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() errorMessage: string = '';
  @Input() helpText: string = '';
  @Input() hasError: boolean = false;
  @Input() rows: number = 4;
  @Input() maxlength: number | null = null;

  @Output() blur = new EventEmitter<string>();

  onBlur(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.blur.emit(textarea.value);
  }
}
