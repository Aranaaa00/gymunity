import { Component, inject, OnInit, OnDestroy, signal, computed, WritableSignal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import type { GimnasioDetalle, Clase, Resenia, Profesor, Torneo } from '../../modelos';
import { Icono } from '../../componentes/compartidos/icono/icono';
import { Galeria } from '../../componentes/compartidos/galeria/galeria';
import { SeccionLista } from '../../componentes/compartidos/seccion-lista/seccion-lista';
import { TarjetaProfesor } from '../../componentes/compartidos/tarjeta-profesor/tarjeta-profesor';
import { TarjetaResenia } from '../../componentes/compartidos/tarjeta-resenia/tarjeta-resenia';
import { ItemTorneo } from '../../componentes/compartidos/item-torneo/item-torneo';

// ============================================
// CONSTANTES
// ============================================

const MAX_ITEMS_VISIBLES = 3;

@Component({
  selector: 'app-gimnasio',
  standalone: true,
  imports: [
    Icono,
    Galeria,
    SeccionLista,
    TarjetaProfesor,
    TarjetaResenia,
    ItemTorneo
  ],
  templateUrl: './gimnasio.html',
  styleUrl: './gimnasio.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GimnasioPage implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly destruir$ = new Subject<void>();
  
  readonly gimnasio: WritableSignal<GimnasioDetalle | null> = signal(null);
  readonly cargando: WritableSignal<boolean> = signal(true);

  // ----------------------------------------
  // Computed signals
  // ----------------------------------------
  readonly tieneFotos = computed(() => {
    const gym = this.gimnasio();
    return gym?.fotos && gym.fotos.length > 0;
  });

  readonly fotosGaleria = computed(() => {
    const gym = this.gimnasio();
    if (!gym) return [];
    
    // Combinar foto principal + fotos adicionales
    const fotos: string[] = [];
    if (gym.foto) fotos.push(gym.foto);
    if (gym.fotos) fotos.push(...gym.fotos);
    
    return fotos;
  });

  readonly profesoresVisibles = computed(() => {
    const gym = this.gimnasio();
    if (!gym?.profesores) return [];
    return gym.profesores.slice(0, MAX_ITEMS_VISIBLES);
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
    this.route.data.pipe(
      takeUntil(this.destruir$)
    ).subscribe((data) => {
      this.gimnasio.set(data['gimnasio'] as GimnasioDetalle);
      this.cargando.set(false);
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
    // TODO: Implementar modal de reseña
    console.log('Abrir modal de reseña');
  }

  verMasProfesores(): void {
    // TODO: Implementar ver más profesores
    console.log('Ver más profesores');
  }

  verMasTorneos(): void {
    // TODO: Implementar ver más torneos
    console.log('Ver más torneos');
  }

  verMasResenias(): void {
    // TODO: Implementar ver más reseñas
    console.log('Ver más reseñas');
  }

  apuntarseProfesor(profesor: Profesor): void {
    // TODO: Implementar inscripción a profesor
    console.log('Apuntarse a profesor:', profesor.nombre);
  }
}
