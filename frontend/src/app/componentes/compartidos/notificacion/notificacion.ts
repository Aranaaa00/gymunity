import { Component, input, output, InputSignal, OutputEmitterRef } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

// ============================================
// TIPOS
// ============================================

type TipoNotificacion = 'success' | 'error' | 'warning' | 'info';

// ============================================
// CONSTANTES
// ============================================

const TIPO_DEFECTO: TipoNotificacion = 'info';

// ============================================
// COMPONENTE NOTIFICACIÓN
// ============================================

@Component({
  selector: 'app-notificacion',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './notificacion.html',
  styleUrl: './notificacion.scss',
})
export class Notificacion {
  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly tipo: InputSignal<TipoNotificacion> = input<TipoNotificacion>(TIPO_DEFECTO);
  readonly mensaje: InputSignal<string> = input<string>('');
  readonly visible: InputSignal<boolean> = input<boolean>(false);

  // ----------------------------------------
  // Outputs
  // ----------------------------------------
  readonly cerrar: OutputEmitterRef<void> = output<void>();

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  onCerrar(): void {
    this.cerrar.emit();
  }
}
