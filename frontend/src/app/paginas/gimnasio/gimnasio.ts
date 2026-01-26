import { Component, inject, OnInit, OnDestroy, signal, computed, WritableSignal, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import type { GimnasioDetalle, Clase, Resenia, Profesor, Torneo } from '../../modelos';
import { Icono } from '../../componentes/compartidos/icono/icono';
import { Galeria } from '../../componentes/compartidos/galeria/galeria';
import { SeccionLista } from '../../componentes/compartidos/seccion-lista/seccion-lista';
import { TarjetaProfesor } from '../../componentes/compartidos/tarjeta-profesor/tarjeta-profesor';
import { TarjetaResenia } from '../../componentes/compartidos/tarjeta-resenia/tarjeta-resenia';
import { ItemTorneo } from '../../componentes/compartidos/item-torneo/item-torneo';
import { ModalReserva } from '../../componentes/compartidos/modal-reserva/modal-reserva';
import { ModalResenia } from '../../componentes/compartidos/modal-resenia/modal-resenia';
import { ReservasService } from '../../servicios/reservas';
import { PerfilService } from '../../servicios/perfil';
import { AuthService } from '../../servicios/auth';
import { ModalService } from '../../servicios/modal';
import { TituloPagina } from '../../servicios/titulo-pagina';

// ============================================
// CONSTANTES
// ============================================

const MAX_ITEMS_VISIBLES = 5;

@Component({
  selector: 'app-gimnasio',
  standalone: true,
  imports: [
    Icono,
    Galeria,
    SeccionLista,
    TarjetaProfesor,
    TarjetaResenia,
    ItemTorneo,
    ModalReserva,
    ModalResenia
  ],
  templateUrl: './gimnasio.html',
  styleUrl: './gimnasio.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GimnasioPage implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly reservasService = inject(ReservasService);
  private readonly perfilService = inject(PerfilService);
  private readonly authService = inject(AuthService);
  private readonly modalService = inject(ModalService);
  private readonly tituloPagina = inject(TituloPagina);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destruir$ = new Subject<void>();
  
  readonly gimnasio: WritableSignal<GimnasioDetalle | null> = signal(null);
  readonly cargando: WritableSignal<boolean> = signal(true);
  
  // Estado del modal de reserva
  readonly claseSeleccionada: WritableSignal<Clase | null> = signal(null);
  readonly mostrarModalReserva = computed(() => this.claseSeleccionada() !== null);

  // Exponer signal de clases reservadas para reactividad en template
  readonly clasesReservadasIds = this.reservasService.clasesReservadasIds;
  
  // Estado del modal de reseña
  readonly mostrarModalResenia: WritableSignal<boolean> = signal(false);

  // ----------------------------------------
  // Computed signals
  // ----------------------------------------
  readonly tieneFotos = computed(() => {
    const gym = this.gimnasio();
    return gym?.fotos && gym.fotos.length > 0;
  });

  readonly fotosGaleria = computed(() => {
    const gym = this.gimnasio();
    if (!gym?.fotos || gym.fotos.length === 0) return [];
    
    // Las fotos ya vienen completas desde el backend
    return gym.fotos;
  });

  readonly descripcionesGaleria = computed(() => {
    const gym = this.gimnasio();
    if (!gym?.descripcionesFotos) return [];
    return gym.descripcionesFotos;
  });

  readonly profesoresVisibles = computed(() => {
    const gym = this.gimnasio();
    if (!gym?.profesores) return [];
    return gym.profesores.slice(0, MAX_ITEMS_VISIBLES);
  });

  readonly clasesVisibles = computed(() => {
    const gym = this.gimnasio();
    if (!gym?.clases) return [];
    return gym.clases.slice(0, MAX_ITEMS_VISIBLES);
  });

  readonly torneosVisibles = computed(() => {
    const gym = this.gimnasio();
    if (!gym?.torneos) return [];
    return gym.torneos.slice(0, MAX_ITEMS_VISIBLES);
  });

  readonly reseniasVisibles = computed(() => {
    const gym = this.gimnasio();
    if (!gym?.resenias) return [];
    return gym.resenias.slice(0, MAX_ITEMS_VISIBLES);
  });

  // ----------------------------------------
  // Lifecycle
  // ----------------------------------------
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    this.route.data.pipe(
      takeUntil(this.destruir$)
    ).subscribe((data) => {
      const gym = data['gimnasio'] as GimnasioDetalle;
      this.gimnasio.set(gym);
      this.cargando.set(false);
      
      // Actualizar título dinámico con nombre del gimnasio
      if (gym?.nombre) {
        this.tituloPagina.establecer(gym.nombre);
      }
    });
  }

  ngOnDestroy(): void {
    this.destruir$.next();
    this.destruir$.complete();
  }

  // ----------------------------------------
  // Track functions
  // ----------------------------------------
  trackByClaseId(_index: number, clase: Clase): number {
    return clase.id;
  }

  trackByReseniaId(_index: number, resenia: Resenia): number {
    return resenia.id;
  }

  trackByProfesorId(_index: number, profesor: Profesor): number {
    return profesor.id;
  }

  trackByTorneoId(_index: number, torneo: Torneo): number {
    return torneo.id;
  }

  // ----------------------------------------
  // Formatters
  // ----------------------------------------
  formatearValoracion(): string {
    const gym = this.gimnasio();
    if (!gym || gym.valoracionMedia === null || gym.totalResenias === 0) {
      return 'Sin valoraciones';
    }
    return `${gym.valoracionMedia.toFixed(1)}`;
  }

  // ----------------------------------------
  // Actions (solo UI, sin implementar)
  // ----------------------------------------
  abrirResenia(): void {
    if (!this.authService.estaAutenticado()) {
      this.modalService.requerirRegistro();
      return;
    }
    this.mostrarModalResenia.set(true);
  }

  cerrarModalResenia(): void {
    this.mostrarModalResenia.set(false);
  }

  onReseniaEnviada(): void {
    this.recargarResenias();
    this.cerrarModalResenia();
  }

  private recargarResenias(): void {
    const gym = this.gimnasio();
    if (!gym) return;
    
    this.perfilService.cargarReseniasGimnasio(gym.id).subscribe({
      next: (resenias) => {
        this.gimnasio.update(g => {
          if (!g) return null;
          return {
            ...g,
            resenias,
            totalResenias: resenias.length,
            valoracionMedia: this.calcularValoracionMedia(resenias)
          };
        });
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al recargar reseñas:', err);
      }
    });
  }

  private calcularValoracionMedia(resenias: Resenia[]): number {
    if (resenias.length === 0) return 0;
    const suma = resenias.reduce((acc, r) => acc + r.valoracion, 0);
    return suma / resenias.length;
  }

  verMasProfesores(): void {
    // TODO: Implementar ver más profesores
    console.log('Ver más profesores');
  }

  verMasClases(): void {
    // TODO: Implementar ver más clases
    console.log('Ver más clases');
  }

  verMasTorneos(): void {
    // TODO: Implementar ver más torneos
    console.log('Ver más torneos');
  }

  verMasResenias(): void {
    // TODO: Implementar ver más reseñas
    console.log('Ver más reseñas');
  }

  // ----------------------------------------
  // Reservas de clases
  // ----------------------------------------
  obtenerClaseIdProfesor(profesor: Profesor): number {
    const claseExistente = this.gimnasio()?.clases?.find(
      c => c.profesorNombre === profesor.nombre
    );
    return claseExistente?.id ?? profesor.id;
  }

  reservarClaseProfesor(profesor: Profesor): void {
    if (!this.authService.estaAutenticado()) {
      this.modalService.requerirRegistro();
      return;
    }

    const claseExistente = this.gimnasio()?.clases?.find(
      c => c.profesorNombre === profesor.nombre
    );
    
    if (claseExistente) {
      this.claseSeleccionada.set(claseExistente);
    } else {
      const claseTemp: Clase = {
        id: profesor.id,
        nombre: profesor.especialidad,
        icono: 'dumbbell',
        profesorNombre: profesor.nombre,
        gimnasioId: this.gimnasio()?.id ?? 0
      };
      this.claseSeleccionada.set(claseTemp);
    }
  }

  cerrarModalReserva(): void {
    this.claseSeleccionada.set(null);
  }

  confirmarReserva(fechaClase: string): void {
    const clase = this.claseSeleccionada();
    if (!clase) return;

    this.reservasService.reservarClase(clase.id, clase.nombre, fechaClase);
    this.cerrarModalReserva();
  }
}
