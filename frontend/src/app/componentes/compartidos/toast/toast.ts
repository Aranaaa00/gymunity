import { Component, inject } from '@angular/core';
import { NotificacionService, TipoNotificacion, Notificacion } from '../../../servicios/notificacion';
import { Icono, NombreIcono } from '../icono/icono';

// ============================================
// CONFIGURACIÓN DE ICONOS POR TIPO
// ============================================

const ICONOS_TIPO: Record<TipoNotificacion, NombreIcono> = {
  success: 'check',
  error: 'x-circle',
  warning: 'bell',
  info: 'sparkles',
};

// ============================================
// COMPONENTE TOAST
// ============================================

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [Icono],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class Toast {
  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly notificacionService = inject(NotificacionService);

  // ----------------------------------------
  // Estado
  // ----------------------------------------
  readonly notificaciones = this.notificacionService.notificaciones;

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  getIcono(tipo: TipoNotificacion): NombreIcono {
    return ICONOS_TIPO[tipo];
  }

  getTipoClase(tipo: TipoNotificacion): string {
    return `toast--${tipo}`;
  }

  cerrar(notificacion: Notificacion): void {
    this.notificacionService.cerrar(notificacion.id);
  }

  trackById(_index: number, notificacion: Notificacion): number {
    return notificacion.id;
  }
}
