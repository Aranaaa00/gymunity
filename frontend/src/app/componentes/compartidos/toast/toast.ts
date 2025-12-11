import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { NotificacionService, TipoNotificacion } from '../../../servicios/notificacion';
import { LucideAngularModule } from 'lucide-angular';

// ============================================
// CONFIGURACIÓN DE ICONOS POR TIPO
// ============================================

const ICONOS_TIPO: Record<TipoNotificacion, string> = {
  success: 'check-circle',
  error: 'x-circle',
  warning: 'alert-triangle',
  info: 'info',
};

// ============================================
// CONSTANTES
// ============================================

const DURACION_ANIMACION_SALIDA = 100;

// ============================================
// COMPONENTE TOAST
// ============================================

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [LucideAngularModule],
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
  readonly notificacion = this.notificacionService.notificacion;
  readonly saliendo = signal<boolean>(false);

  // ----------------------------------------
  // Propiedades computadas
  // ----------------------------------------
  readonly icono = computed<string>(() => {
    const notificacionActual = this.notificacion();
    
    if (!notificacionActual) {
      return ICONOS_TIPO.info;
    }
    
    return ICONOS_TIPO[notificacionActual.tipo];
  });

  readonly tipoClase = computed<string>(() => {
    const notificacionActual = this.notificacion();
    
    if (!notificacionActual) {
      return '';
    }
    
    return `toast--${notificacionActual.tipo}`;
  });

  readonly mensaje = computed<string>(() => {
    const notificacionActual = this.notificacion();
    
    if (!notificacionActual) {
      return '';
    }
    
    return notificacionActual.mensaje;
  });

  readonly notificacionId = computed<number>(() => {
    const notificacionActual = this.notificacion();
    
    if (!notificacionActual) {
      return 0;
    }
    
    return notificacionActual.id;
  });

  // ----------------------------------------
  // Event Handlers
  // ----------------------------------------
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    const tieneNotificacion = this.notificacion() !== null;
    
    if (!tieneNotificacion) {
      return;
    }
    
    this.cerrar();
  }

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  cerrar(): void {
    this.saliendo.set(true);
    
    setTimeout(() => {
      this.finalizarCierre();
    }, DURACION_ANIMACION_SALIDA);
  }

  // ----------------------------------------
  // Métodos privados
  // ----------------------------------------
  private finalizarCierre(): void {
    this.notificacionService.cerrar();
    this.saliendo.set(false);
  }
}
