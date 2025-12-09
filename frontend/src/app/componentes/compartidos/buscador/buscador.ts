import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Icono } from '../icono/icono';

@Component({
  selector: 'app-buscador',
  imports: [FormsModule, Icono],
  templateUrl: './buscador.html',
  styleUrl: './buscador.scss',
})
export class Buscador {
  @Input() placeholder = 'Buscar...';
  @Output() buscar = new EventEmitter<string>();

  valor = '';

  onBuscar(): void {
    this.buscar.emit(this.valor);
  }
}

