import { Component, inject, OnInit, OnDestroy, signal, WritableSignal, computed, Signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Icono } from '../../componentes/compartidos/icono/icono';
import { Card } from '../../componentes/compartidos/card/card';
import { GimnasiosApiService } from '../../servicios/gimnasios-api';
import type { GimnasioCard } from '../../modelos';

// ============================================
// CONSTANTES
// ============================================

const SCROLL_THRESHOLD = 200;

// ============================================
// COMPONENTE BÚSQUEDA
// ============================================

@Component({
  selector: 'app-busqueda',
  standalone: true,
  imports: [Icono, Card],
  templateUrl: './busqueda.html',
  styleUrl: './busqueda.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Busqueda implements OnInit, OnDestroy {

  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly route = inject(ActivatedRoute);
  readonly gimnasiosService = inject(GimnasiosApiService);
  private readonly destruir$ = new Subject<void>();

  // ----------------------------------------
  // Estado local
  // ----------------------------------------
  readonly terminoBusqueda: WritableSignal<string> = signal('');

  // ----------------------------------------
  // Estado desde servicio (Signals reactivos)
  // ----------------------------------------
  readonly resultados: Signal<readonly GimnasioCard[]> = this.gimnasiosService.gimnasios;
  readonly cargando: Signal<boolean> = this.gimnasiosService.cargando;
  readonly cargandoMas: Signal<boolean> = this.gimnasiosService.cargandoMas;
  readonly hayMas: Signal<boolean> = this.gimnasiosService.hayMasPaginas;
  readonly error: Signal<string | null> = this.gimnasiosService.error;

  // ----------------------------------------
  // Computed signals
  // ----------------------------------------
  readonly hayResultados = computed(() => this.resultados().length > 0);
  readonly totalResultados = computed(() => this.resultados().length);

  // ----------------------------------------
  // Lifecycle
  // ----------------------------------------
  ngOnInit(): void {
    this.suscribirAParametros();
  }

  ngOnDestroy(): void {
    this.destruir$.next();
    this.destruir$.complete();
  }

  // ----------------------------------------
  // TrackBy para ngFor
  // ----------------------------------------
  trackByGimnasioId(_index: number, gimnasio: GimnasioCard): number {
    return gimnasio.id;
  }

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  limpiarFiltros(): void {
    this.terminoBusqueda.set('');
    this.gimnasiosService.limpiarFiltros();
    this.gimnasiosService.obtenerTodos().pipe(
      takeUntil(this.destruir$)
    ).subscribe();
  }

  cargarMasResultados(): void {
    this.gimnasiosService.cargarMas().pipe(
      takeUntil(this.destruir$)
    ).subscribe();
  }

  // ----------------------------------------
  // Métodos privados
  // ----------------------------------------
  private suscribirAParametros(): void {
    this.route.queryParams.pipe(
      takeUntil(this.destruir$)
    ).subscribe((params) => {
      const termino = params['q'] || '';
      this.terminoBusqueda.set(termino);
      
      if (termino) {
        this.gimnasiosService.buscar({ nombre: termino }).pipe(
          takeUntil(this.destruir$)
        ).subscribe();
      } else {
        this.gimnasiosService.obtenerTodos().pipe(
          takeUntil(this.destruir$)
        ).subscribe();
      }
    });
  }
}

