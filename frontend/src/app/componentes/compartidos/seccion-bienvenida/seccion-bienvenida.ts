import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-seccion-bienvenida',
  templateUrl: './seccion-bienvenida.html',
  styleUrls: ['./seccion-bienvenida.scss'],
})
export class SeccionBienvenida {
  @Input() tituloLineas: string[] = [];
  @Input() subtituloLineas: string[] = [];
  @Input() textoBoton = '';
  @Output() accion = new EventEmitter<void>();
}
