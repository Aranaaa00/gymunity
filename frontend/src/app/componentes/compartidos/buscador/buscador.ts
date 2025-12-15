import { Component, input, output, signal, inject, InputSignal, OutputEmitterRef } from '@angular/core';
import { Router } from '@angular/router';
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
  // Dependencias
  // ----------------------------------------
  private readonly router = inject(Router);

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
    this.navegarABusqueda(terminoBusqueda);
  }

  onValorCambia(nuevoValor: string): void {
    this.valor.set(nuevoValor);
  }

  // ----------------------------------------
  // Métodos privados
  // ----------------------------------------
  private navegarABusqueda(termino: string): void {
    const noHayTermino = !termino.trim();
    
    if (noHayTermino) {
      return;
    }
    
    this.router.navigate(['/busqueda'], {
      queryParams: { q: termino }
    });
  }
}


