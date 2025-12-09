import { Component, Output, EventEmitter } from '@angular/core';
import { Icono } from '../icono/icono';

@Component({
  selector: 'app-ventana-emergente',
  imports: [Icono],
  templateUrl: './ventana-emergente.html',
  styleUrl: './ventana-emergente.scss',
})
export class VentanaEmergente {
  @Output() cerrar = new EventEmitter<void>();
  
  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.cerrar.emit();
    }
  }
}
