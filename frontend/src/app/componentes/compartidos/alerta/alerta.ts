import { Component, input, output, InputSignal, OutputEmitterRef } from '@angular/core';
import { Icono } from '../icono/icono';

// ============================================
// TIPOS
// ============================================

type TipoAlerta = 'success' | 'error' | 'warning' | 'info';

// ============================================
// CONSTANTES
// ============================================

const TIPO_DEFECTO: TipoAlerta = 'info';

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
  // Outputs
  // ----------------------------------------
  readonly cerrar: OutputEmitterRef<void> = output<void>();
}
