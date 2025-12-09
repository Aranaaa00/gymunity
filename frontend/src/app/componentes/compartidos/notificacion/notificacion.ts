import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Icono } from '../icono/icono';

@Component({
  selector: 'app-notificacion',
  imports: [Icono],
  templateUrl: './notificacion.html',
  styleUrls: ['./notificacion.scss'],
})
export class Notificacion implements OnInit, OnDestroy {
  @Input() tipo: 'success' | 'error' | 'warning' | 'info' = 'info';
  @Input() mensaje = '';
  @Input() duracion = 5000;
  @Input() visible = false;
  @Output() cerrar = new EventEmitter<void>();

  private temporizador: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    if (this.duracion > 0) {
      this.temporizador = setTimeout(() => {
        this.cerrar.emit();
      }, this.duracion);
    }
  }

  ngOnDestroy(): void {
    if (this.temporizador) {
      clearTimeout(this.temporizador);
    }
  }

  onCerrar(): void {
    this.cerrar.emit();
  }
}
