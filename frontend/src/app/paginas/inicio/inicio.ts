import { Component, inject, OnInit, OnDestroy, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil, forkJoin, of } from 'rxjs';
import { Card } from '../../componentes/compartidos/card/card';
import { SeccionBienvenida } from '../../componentes/compartidos/seccion-bienvenida/seccion-bienvenida';
import { ModalService } from '../../servicios/modal';
import { GimnasiosApiService } from '../../servicios/gimnasios-api';
import { AuthService } from '../../servicios/auth';
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
  imports: [Card, SeccionBienvenida, RouterLink],
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
  private readonly auth = inject(AuthService);
  private readonly destruir$ = new Subject<void>();

  // ----------------------------------------
  // Estado
  // ----------------------------------------
  readonly gimnasiosPopulares = signal<readonly GimnasioCard[]>([]);
  readonly gimnasiosRecientes = signal<readonly GimnasioCard[]>([]);
  readonly gimnasiosCercanos = signal<readonly GimnasioCard[]>([]);
  readonly cargando = signal<boolean>(true);
  readonly cargandoCercanos = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  // ----------------------------------------
  // Computed desde autenticación
  // ----------------------------------------
  readonly estaAutenticado = this.auth.estaAutenticado;
  
  readonly nombreUsuario = computed(() => {
    const usuario = this.auth.usuario();
    return usuario?.nombreUsuario || 'Usuario';
  });

  readonly ciudadUsuario = computed(() => {
    const usuario = this.auth.usuario();
    return usuario?.ciudad ?? '';
  });

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
    const ciudad = this.ciudadUsuario();
    const estaAutenticado = this.auth.estaAutenticado();
    
    // Cargar todo en paralelo para máxima fluidez
    forkJoin({
      populares: this.gimnasiosService.obtenerPopulares(),
      recientes: this.gimnasiosService.obtenerRecientes(),
      cercanos: estaAutenticado && ciudad 
        ? this.gimnasiosService.obtenerPorCiudad(ciudad) 
        : of([])
    }).pipe(
      takeUntil(this.destruir$)
    ).subscribe({
      next: ({ populares, recientes, cercanos }) => {
        this.gimnasiosPopulares.set(populares.slice(0, MAX_GIMNASIOS_POR_SECCION));
        this.gimnasiosRecientes.set(recientes.slice(0, MAX_GIMNASIOS_POR_SECCION));
        this.gimnasiosCercanos.set(cercanos.slice(0, MAX_GIMNASIOS_POR_SECCION));
        this.cargando.set(false);
        this.cargandoCercanos.set(false);
      },
      error: () => this.manejarError(),
    });
  }

  private manejarError(): void {
    this.error.set('Error al cargar gimnasios');
    this.cargando.set(false);
    this.cargandoCercanos.set(false);
  }
}
