import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

// ============================================
// COMPONENTE SECCION LISTA
// ============================================

@Component({
  selector: 'app-seccion-lista',
  standalone: true,
  imports: [],
  templateUrl: './seccion-lista.html',
  styleUrl: './seccion-lista.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeccionLista {
  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly titulo = input.required<string>();
  readonly mostrarVerMas = input<boolean>(false);
  readonly textoVerMas = input<string>('Ver más');

  // ----------------------------------------
  // Outputs
  // ----------------------------------------
  readonly verMas = output<void>();

  // ----------------------------------------
  // Métodos
  // ----------------------------------------
  onVerMas(): void {
    this.verMas.emit();
  }
}
