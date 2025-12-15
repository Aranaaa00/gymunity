import { Component, inject, OnInit, signal } from '@angular/core';
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
})
export class Inicio implements OnInit {
  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly modal = inject(ModalService);
  private readonly gimnasiosService = inject(GimnasiosApiService);

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

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  abrirRegistro(): void {
    this.modal.abrirRegistro();
  }

  formatearValoracion(valoracion: number | null, total: number): string {
    if (valoracion === null || total === 0) {
      return 'Sin valoraciones';
    }
    return `${valoracion.toFixed(1)} ⭐ (${total})`;
  }

  // ----------------------------------------
  // Métodos privados
  // ----------------------------------------
  private cargarGimnasios(): void {
    this.cargando.set(true);
    
    // Cargar populares
    this.gimnasiosService.obtenerPopulares().subscribe({
      next: (gimnasios) => {
        this.gimnasiosPopulares.set(gimnasios.slice(0, MAX_GIMNASIOS_POR_SECCION));
        this.cargarRecientes();
      },
      error: () => {
        this.error.set('Error al cargar gimnasios');
        this.cargando.set(false);
      },
    });
  }

  private cargarRecientes(): void {
    this.gimnasiosService.obtenerRecientes().subscribe({
      next: (gimnasios) => {
        this.gimnasiosRecientes.set(gimnasios.slice(0, MAX_GIMNASIOS_POR_SECCION));
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar gimnasios');
        this.cargando.set(false);
      },
    });
  }
}
