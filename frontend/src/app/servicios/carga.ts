import { Injectable, signal, computed, Signal } from '@angular/core';

// ============================================
// INTERFACES
// ============================================

export interface EstadoCarga {
  readonly activo: boolean;
  readonly porcentaje: number;
  readonly mensaje: string;
}

// ============================================
// CONSTANTES
// ============================================

const ID_GLOBAL = 'global';
const MENSAJE_CARGA_DEFECTO = 'Cargando...';
const PORCENTAJE_MINIMO = 0;
const PORCENTAJE_MAXIMO = 100;

// ============================================
// SERVICIO DE CARGA
// ============================================

@Injectable({ providedIn: 'root' })
export class CargaService {
  // ----------------------------------------
  // Estado privado
  // ----------------------------------------
  private readonly cargas = signal<Map<string, EstadoCarga>>(new Map());

  // ----------------------------------------
  // Señales computadas públicas
  // ----------------------------------------
  readonly cargando: Signal<boolean> = computed((): boolean => {
    const hayCargas = this.cargas().size > PORCENTAJE_MINIMO;

    return hayCargas;
  });

  readonly porcentajeGlobal: Signal<number> = computed((): number => {
    const estados = Array.from(this.cargas().values());
    const noHayEstados = estados.length === PORCENTAJE_MINIMO;

    if (noHayEstados) {
      return PORCENTAJE_MINIMO;
    }

    const sumaTotal = this.calcularSumaPorcentajes(estados);
    const promedio = Math.round(sumaTotal / estados.length);

    return promedio;
  });

  readonly mensajeGlobal: Signal<string> = computed((): string => {
    const estados = Array.from(this.cargas().values());
    const ultimoEstado = estados[estados.length - 1];
    const mensaje = ultimoEstado?.mensaje ?? MENSAJE_CARGA_DEFECTO;

    return mensaje;
  });

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  iniciar(id: string = ID_GLOBAL, mensaje: string = MENSAJE_CARGA_DEFECTO): void {
    const nuevoEstado: EstadoCarga = {
      activo: true,
      porcentaje: PORCENTAJE_MINIMO,
      mensaje,
    };

    this.cargas.update((mapa: Map<string, EstadoCarga>): Map<string, EstadoCarga> => {
      const nuevoMapa = new Map(mapa);
      nuevoMapa.set(id, nuevoEstado);

      return nuevoMapa;
    });
  }

  actualizarPorcentaje(
    id: string = ID_GLOBAL,
    porcentaje: number,
    mensaje?: string
  ): void {
    this.cargas.update((mapa: Map<string, EstadoCarga>): Map<string, EstadoCarga> => {
      const estadoActual = mapa.get(id);
      const noExisteEstado = estadoActual === undefined;

      if (noExisteEstado) {
        return mapa;
      }

      const porcentajeNormalizado = this.normalizarPorcentaje(porcentaje);
      const nuevoEstado: EstadoCarga = {
        ...estadoActual,
        porcentaje: porcentajeNormalizado,
        mensaje: mensaje ?? estadoActual.mensaje,
      };

      const nuevoMapa = new Map(mapa);
      nuevoMapa.set(id, nuevoEstado);

      return nuevoMapa;
    });
  }

  finalizar(id: string = ID_GLOBAL): void {
    this.cargas.update((mapa: Map<string, EstadoCarga>): Map<string, EstadoCarga> => {
      const nuevoMapa = new Map(mapa);
      nuevoMapa.delete(id);

      return nuevoMapa;
    });
  }

  estaCargando(id: string): boolean {
    const existeCarga = this.cargas().has(id);

    return existeCarga;
  }

  obtenerEstado(id: string): EstadoCarga | undefined {
    const estado = this.cargas().get(id);

    return estado;
  }

  seleccionar(id: string): Signal<boolean> {
    const selectorCarga = computed((): boolean => {
      const existeCarga = this.cargas().has(id);

      return existeCarga;
    });

    return selectorCarga;
  }

  seleccionarPorcentaje(id: string): Signal<number> {
    const selectorPorcentaje = computed((): number => {
      const porcentaje = this.cargas().get(id)?.porcentaje ?? PORCENTAJE_MINIMO;

      return porcentaje;
    });

    return selectorPorcentaje;
  }

  limpiar(): void {
    this.cargas.set(new Map());
  }

  // ----------------------------------------
  // Métodos privados
  // ----------------------------------------
  private calcularSumaPorcentajes(estados: EstadoCarga[]): number {
    const suma = estados.reduce(
      (acumulador: number, estado: EstadoCarga): number => {
        return acumulador + estado.porcentaje;
      },
      PORCENTAJE_MINIMO
    );

    return suma;
  }

  private normalizarPorcentaje(porcentaje: number): number {
    const porcentajeNormalizado = Math.min(
      PORCENTAJE_MAXIMO,
      Math.max(PORCENTAJE_MINIMO, porcentaje)
    );

    return porcentajeNormalizado;
  }
}
