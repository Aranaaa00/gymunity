import { Component, inject, OnInit, OnDestroy, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil, forkJoin } from 'rxjs';
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
    return usuario?.ciudad || 'Jerez de la Frontera';
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
    this.cargando.set(true);
    
    forkJoin({
      populares: this.gimnasiosService.obtenerPopulares(),
      recientes: this.gimnasiosService.obtenerRecientes()
    }).pipe(
      takeUntil(this.destruir$)
    ).subscribe({
      next: ({ populares, recientes }) => {
        this.gimnasiosPopulares.set(populares.slice(0, MAX_GIMNASIOS_POR_SECCION));
        this.gimnasiosRecientes.set(recientes.slice(0, MAX_GIMNASIOS_POR_SECCION));
        
        // Si el usuario está autenticado, cargar gimnasios cercanos
        if (this.auth.estaAutenticado()) {
          this.cargarGimnasiosCercanos();
        } else {
          this.cargando.set(false);
        }
      },
      error: () => this.manejarError(),
    });
  }

  private cargarGimnasiosCercanos(): void {
    const ciudad = this.ciudadUsuario();
    
    this.gimnasiosService.buscar({ ciudad }).pipe(
      takeUntil(this.destruir$)
    ).subscribe({
      next: (gimnasios) => {
        this.gimnasiosCercanos.set(gimnasios.slice(0, MAX_GIMNASIOS_POR_SECCION));
        this.cargando.set(false);
      },
      error: () => {
        // Si falla, no mostramos error, solo no mostramos la sección
        this.cargando.set(false);
      },
    });
  }

  private manejarError(): void {
    this.error.set('Error al cargar gimnasios');
    this.cargando.set(false);
  }
}
