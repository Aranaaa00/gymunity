import { Component, input, output, computed, InputSignal, OutputEmitterRef } from '@angular/core';
import { Icono, NombreIcono } from '../icono/icono';

// ============================================
// TIPOS
// ============================================

type TipoAlerta = 'success' | 'error' | 'warning' | 'info';

// ============================================
// CONSTANTES
// ============================================

const TIPO_DEFECTO: TipoAlerta = 'info';

const ICONOS_POR_TIPO: Record<TipoAlerta, NombreIcono> = {
  success: 'check',
  error: 'x-circle',
  warning: 'bell',
  info: 'sparkles',
};

// ============================================
// COMPONENTE ALERTA
// ============================================

@Component({
  selector: 'app-alerta',
  standalone: true,
  imports: [Icono],
  templateUrl: './alerta.html',
  styleUrls: ['./alerta.scss'],
})
export class Alerta {
  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly tipo: InputSignal<TipoAlerta> = input<TipoAlerta>(TIPO_DEFECTO);
  readonly mensaje: InputSignal<string> = input<string>('');
  readonly cerrable: InputSignal<boolean> = input<boolean>(true);

  // ----------------------------------------
  // Computed
  // ----------------------------------------
  readonly icono = computed(() => ICONOS_POR_TIPO[this.tipo()]);

  // ----------------------------------------
  // Outputs
  // ----------------------------------------
  readonly cerrar: OutputEmitterRef<void> = output<void>();
}
