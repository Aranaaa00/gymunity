import { Component, input, output, signal, InputSignal, OutputEmitterRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Icono } from '../icono/icono';

// ============================================
// CONSTANTES
// ============================================

const PLACEHOLDER_DEFECTO = 'Buscar...';

// ============================================
// COMPONENTE BUSCADOR
// ============================================

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [FormsModule, Icono],
  templateUrl: './buscador.html',
  styleUrl: './buscador.scss',
})
export class Buscador {
  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly placeholder: InputSignal<string> = input<string>(PLACEHOLDER_DEFECTO);

  // ----------------------------------------
  // Outputs
  // ----------------------------------------
  readonly buscar: OutputEmitterRef<string> = output<string>();

  // ----------------------------------------
  // Estado
  // ----------------------------------------
  readonly valor = signal<string>('');

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  onBuscar(): void {
    const terminoBusqueda = this.valor();

    this.buscar.emit(terminoBusqueda);
  }

  onValorCambia(nuevoValor: string): void {
    this.valor.set(nuevoValor);
  }
}

