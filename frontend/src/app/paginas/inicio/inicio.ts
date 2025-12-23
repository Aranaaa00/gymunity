import { Component, inject, OnInit, OnDestroy, signal, ChangeDetectionStrategy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Card } from '../../componentes/compartidos/card/card';
import { SeccionBienvenida } from '../../componentes/compartidos/seccion-bienvenida/seccion-bienvenida';
import { ModalService } from '../../servicios/modal';
import { GimnasiosApiService } from '../../servicios/gimnasios-api';
import type { GimnasioCard } from '../../modelos';

// ============================================
// CONSTANTES
// ============================================

const MAX_GIMNASIOS_POR_SECCION = 3;

// ============================================
// COMPONENTE INICIO
// ============================================

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [Card, SeccionBienvenida],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Inicio implements OnInit, OnDestroy {
  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly modal = inject(ModalService);
  private readonly gimnasiosService = inject(GimnasiosApiService);
  private readonly destruir$ = new Subject<void>();

  // ----------------------------------------
  // Estado
  // ----------------------------------------
  readonly gimnasiosPopulares = signal<readonly GimnasioCard[]>([]);
  readonly gimnasiosRecientes = signal<readonly GimnasioCard[]>([]);
  readonly cargando = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  // ----------------------------------------
  // Lifecycle
  // ----------------------------------------
  ngOnInit(): void {
    this.cargarGimnasios();
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
  abrirRegistro(): void {
    this.modal.abrirRegistro();
  }

  // ----------------------------------------
  // Métodos privados
  // ----------------------------------------
  private cargarGimnasios(): void {
    this.cargando.set(true);
    
    this.gimnasiosService.obtenerPopulares().pipe(
      takeUntil(this.destruir$)
    ).subscribe({
      next: (gimnasios) => {
        this.gimnasiosPopulares.set(gimnasios.slice(0, MAX_GIMNASIOS_POR_SECCION));
        this.cargarRecientes();
      },
      error: () => this.manejarError(),
    });
  }

  private cargarRecientes(): void {
    this.gimnasiosService.obtenerRecientes().pipe(
      takeUntil(this.destruir$)
    ).subscribe({
      next: (gimnasios) => {
        this.gimnasiosRecientes.set(gimnasios.slice(0, MAX_GIMNASIOS_POR_SECCION));
        this.cargando.set(false);
      },
      error: () => this.manejarError(),
    });
  }

  private manejarError(): void {
    this.error.set('Error al cargar gimnasios');
    this.cargando.set(false);
  }
}
