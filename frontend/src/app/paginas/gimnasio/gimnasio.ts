import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import type { GimnasioDetalle } from '../../modelos';
import { Icono } from '../../componentes/compartidos/icono/icono';

@Component({
  selector: 'app-gimnasio',
  standalone: true,
  imports: [Icono],
  templateUrl: './gimnasio.html',
  styleUrl: './gimnasio.scss',
})
export class GimnasioPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  
  readonly gimnasio: WritableSignal<GimnasioDetalle | null> = signal(null);
  readonly cargando: WritableSignal<boolean> = signal(true);

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.gimnasio.set(data['gimnasio'] as GimnasioDetalle);
      this.cargando.set(false);
    });
  }

  formatearValoracion(): string {
    const gym = this.gimnasio();
    if (!gym || gym.valoracionMedia === null || gym.totalResenias === 0) {
      return 'Sin valoraciones';
    }
    return `${gym.valoracionMedia.toFixed(1)} / 5`;
  }
}
