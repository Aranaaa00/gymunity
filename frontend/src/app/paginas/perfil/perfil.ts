import { Component, inject, signal, computed, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth';
import { PerfilService, ClaseReservada, Logro } from '../../servicios/perfil';
import { ReservasService } from '../../servicios/reservas';
import { ComponenteConCambios } from '../../guards/cambios-sin-guardar.guard';
import { Icono, NombreIcono } from '../../componentes/compartidos/icono/icono';
import { Tabs } from '../../componentes/compartidos/tabs/tabs';
import { Paginacion } from '../../componentes/compartidos/paginacion/paginacion';

// ============================================
// CONSTANTES
// ============================================

const PESTANAS = ['Logros', 'Mis clases', 'Mis reseñas'] as const;
const CATEGORIAS = ['Entrenamiento', 'Artes marciales', 'Torneos', 'Comunidad', 'Antigüedad', 'Progreso personal'] as const;
const CREDITOS_MAX = 12;
const CLASES_POR_PAGINA = 5;
const RESENIAS_POR_PAGINA = 5;

const MAPEO_ICONOS_CLASE: Readonly<Record<string, NombreIcono>> = {
  pesas: 'dumbbell',
  musculacion: 'dumbbell',
  fitness: 'activity',
  crossfit: 'flame',
  boxeo: 'swords',
  kickboxing: 'swords',
  muay: 'swords',
  mma: 'swords',
  judo: 'shield',
  karate: 'hand',
  taekwondo: 'footprints',
  jiujitsu: 'shield',
  bjj: 'shield',
  lucha: 'swords',
  wrestling: 'swords',
  krav: 'shield',
  defensa: 'shield',
  yoga: 'person-standing',
  pilates: 'person-standing',
  cardio: 'activity',
  spinning: 'activity',
  funcional: 'zap',
} as const;

// ============================================
// COMPONENTE
// ============================================

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [Icono, Tabs, Paginacion],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Perfil implements ComponenteConCambios {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly perfilService = inject(PerfilService);
  private readonly reservasService = inject(ReservasService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly usuario = this.authService.usuario;
  readonly clases = this.perfilService.clases;
  readonly resenias = this.perfilService.resenias;
  readonly creditos = this.perfilService.creditos;
  readonly cargando = this.perfilService.cargando;
  readonly logrosPorCategoria = this.perfilService.logrosPorCategoria;

  readonly tabActivo = signal(0);
  readonly paginaClases = signal(0);
  readonly paginaResenias = signal(0);
  readonly pestanas = PESTANAS;
  readonly categorias = CATEGORIAS;

  readonly creditosTexto = computed(() => {
    return `${this.creditos()}/${CREDITOS_MAX}`;
  });

  readonly totalPaginasClases = computed(() => {
    return Math.ceil(this.clases().length / CLASES_POR_PAGINA);
  });

  readonly clasesPaginadas = computed(() => {
    const inicio = this.paginaClases() * CLASES_POR_PAGINA;
    return this.clases().slice(inicio, inicio + CLASES_POR_PAGINA);
  });

  readonly mostrarPaginacion = computed(() => {
    return this.clases().length > CLASES_POR_PAGINA;
  });

  readonly totalPaginasResenias = computed(() => {
    return Math.ceil(this.resenias().length / RESENIAS_POR_PAGINA);
  });

  readonly reseniasPaginadas = computed(() => {
    const inicio = this.paginaResenias() * RESENIAS_POR_PAGINA;
    return this.resenias().slice(inicio, inicio + RESENIAS_POR_PAGINA);
  });

  readonly mostrarPaginacionResenias = computed(() => {
    return this.resenias().length > RESENIAS_POR_PAGINA;
  });

  readonly rolFormateado = computed(() => {
    const u = this.usuario();
    if (!u) {
      return '';
    }
    const mapa: Record<string, string> = { ALUMNO: 'Alumno', PROFESOR: 'Profesor', ADMIN: 'Admin' };
    return mapa[u.rol] ?? u.rol;
  });

  readonly ciudad = computed(() => this.usuario()?.ciudad ?? '');

  tieneCambiosSinGuardar(): boolean {
    return false;
  }

  cambiarTab(indice: number): void {
    this.tabActivo.set(indice);
    this.paginaClases.set(0);
    this.paginaResenias.set(0);
    this.cdr.markForCheck();
  }

  paginaAnterior(): void {
    if (this.paginaClases() > 0) {
      this.paginaClases.update(p => p - 1);
    }
  }

  paginaSiguiente(): void {
    if (this.paginaClases() < this.totalPaginasClases() - 1) {
      this.paginaClases.update(p => p + 1);
    }
  }

  paginaAnteriorResenias(): void {
    if (this.paginaResenias() > 0) {
      this.paginaResenias.update(p => p - 1);
    }
  }

  paginaSiguienteResenias(): void {
    if (this.paginaResenias() < this.totalPaginasResenias() - 1) {
      this.paginaResenias.update(p => p + 1);
    }
  }

  irAConfiguracion(): void {
    this.router.navigate(['/configuracion']);
  }

  irAGimnasio(clase: ClaseReservada): void {
    this.router.navigate(['/gimnasio', clase.gimnasioId]);
  }

  esCompletada(clase: ClaseReservada): boolean {
    return clase.completada;
  }

  puedeCancelar(clase: ClaseReservada): boolean {
    return !clase.completada;
  }

  cancelarClase(clase: ClaseReservada): void {
    this.reservasService.cancelarReserva(clase.claseId);
  }

  formatearFecha(fechaISO: string): string {
    return new Date(fechaISO).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  formatearValoracion(valoracion: number): string {
    return '★'.repeat(valoracion) + '☆'.repeat(5 - valoracion);
  }

  obtenerIconoLogro(logro: Logro): NombreIcono {
    return logro.icono as NombreIcono;
  }

  obtenerIconoClase(nombreClase: string): NombreIcono {
    const nombreNormalizado = nombreClase.toLowerCase();
    
    for (const [palabra, icono] of Object.entries(MAPEO_ICONOS_CLASE)) {
      if (nombreNormalizado.includes(palabra)) {
        return icono;
      }
    }
    
    return 'dumbbell';
  }
}
