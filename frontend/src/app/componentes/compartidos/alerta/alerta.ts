import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Icono } from '../icono/icono';

@Component({
  selector: 'app-alerta',
  imports: [Icono],
  templateUrl: './alerta.html',
  styleUrls: ['./alerta.scss'],
})
export class Alerta {
  @Input() tipo: 'success' | 'error' | 'warning' | 'info' = 'info';
  @Input() mensaje = '';
  @Input() cerrable = true;
  @Output() cerrar = new EventEmitter<void>();
}
