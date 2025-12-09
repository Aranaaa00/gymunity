import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-boton',
  imports: [NgClass],
  templateUrl: './boton.html',
  styleUrl: './boton.scss',
})
export class Boton {
  @Input() tipo: 'button' | 'submit' = 'button';
  @Input() variante: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';
  @Input() tamanio: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled: boolean = false;
}
