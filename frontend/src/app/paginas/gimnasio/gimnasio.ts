import { Component, inject, OnInit, OnDestroy, signal, WritableSignal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import type { GimnasioDetalle, Clase, Resenia } from '../../modelos';
import { Icono } from '../../componentes/compartidos/icono/icono';

@Component({
  selector: 'app-gimnasio',
  standalone: true,
  imports: [Icono],
  templateUrl: './gimnasio.html',
  styleUrl: './gimnasio.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GimnasioPage implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly destruir$ = new Subject<void>();
  
  readonly gimnasio: WritableSignal<GimnasioDetalle | null> = signal(null);
  readonly cargando: WritableSignal<boolean> = signal(true);

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

  trackByClaseId(_index: number, clase: Clase): number {
    return clase.id;
  }

  trackByReseniaId(_index: number, resenia: Resenia): number {
    return resenia.id;
  }

  formatearValoracion(): string {
    const gym = this.gimnasio();
    if (!gym || gym.valoracionMedia === null || gym.totalResenias === 0) {
      return 'Sin valoraciones';
    }
    return `${gym.valoracionMedia.toFixed(1)} / 5`;
  }
}
