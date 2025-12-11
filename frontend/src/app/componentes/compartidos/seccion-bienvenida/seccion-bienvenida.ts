import { Component, input, output, InputSignal, OutputEmitterRef } from '@angular/core';

// ============================================
// COMPONENTE SECCIÓN BIENVENIDA
// ============================================

@Component({
  selector: 'app-seccion-bienvenida',
  standalone: true,
  templateUrl: './seccion-bienvenida.html',
  styleUrls: ['./seccion-bienvenida.scss'],
})
export class SeccionBienvenida {
  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly tituloLineas: InputSignal<string[]> = input<string[]>([]);
  readonly subtituloLineas: InputSignal<string[]> = input<string[]>([]);
  readonly textoBoton: InputSignal<string> = input<string>('');

  // ----------------------------------------
  // Outputs
  // ----------------------------------------
  readonly accion: OutputEmitterRef<void> = output<void>();
}
