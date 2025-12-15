import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AuthService } from '../../servicios/auth';
import { Boton } from '../../componentes/compartidos/boton/boton';
import { ComponenteConCambios } from '../../guards/cambios-sin-guardar.guard';
import { Icono } from '../../componentes/compartidos/icono/icono';

// ============================================
// CONSTANTES
// ============================================

const MENSAJE_GUARDADO = 'Configuración guardada correctamente';

// ============================================
// COMPONENTE
// ============================================

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [Boton, Icono],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.scss',
})
export class Configuracion implements ComponenteConCambios {
  private readonly authService = inject(AuthService);
  
  readonly cambiosPendientes: WritableSignal<boolean> = signal(false);

  tieneCambiosSinGuardar(): boolean {
    return this.cambiosPendientes();
  }

  simularCambio(): void {
    this.cambiosPendientes.set(true);
  }

  guardar(): void {
    this.cambiosPendientes.set(false);
    alert(MENSAJE_GUARDADO);
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
  }
}
