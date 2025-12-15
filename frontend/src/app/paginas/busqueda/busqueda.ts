import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Icono } from '../../componentes/compartidos/icono/icono';

// ============================================
// COMPONENTE BÚSQLÉDA
// ============================================

@Component({
  selector: 'app-busqueda',
  standalone: true,
  imports: [Icono],
  templateUrl: './busqueda.html',
  styleUrl: './busqueda.scss',
})
export class Busqueda implements OnInit {
  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly route = inject(ActivatedRoute);

  // ----------------------------------------
  // Estado
  // ----------------------------------------
  readonly terminoBusqueda: WritableSignal<string> = signal('');
  readonly resultados: WritableSignal<unknown[]> = signal([]);
  readonly cargando: WritableSignal<boolean> = signal(false);

  // ----------------------------------------
  // Lifecycle
  // ----------------------------------------
  ngOnInit(): void {
    this.suscribirAParametros();
  }

  // ----------------------------------------
  // Métodos privados
  // ----------------------------------------
  private suscribirAParametros(): void {
    this.route.queryParams.subscribe((params) => {
      const termino = params['q'] || '';
      this.terminoBusqueda.set(termino);
      this.buscarGimnasios(termino);
    });
  }

  private buscarGimnasios(termino: string): void {
    const noHayTermino = !termino.trim();
    
    if (noHayTermino) {
      this.resultados.set([]);
      return;
    }

    this.cargando.set(true);
    
    // TODO: Implementar búsqueda real con servicio HTTP
    console.log('Buscando gimnasios con término:', termino);
    
    // Simulación temporal
    setTimeout(() => {
      this.resultados.set([]);
      this.cargando.set(false);
    }, 500);
  }
}

