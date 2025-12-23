import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, tap, finalize, catchError, of, map, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpBase } from './http-base';
import type { 
  GimnasioCard, 
  GimnasioDetalle, 
  GimnasioRequest,
  FiltrosBusqueda
} from '../modelos';

// ============================================
// CONSTANTES
// ============================================

const API_URL = '/api/gimnasios';
const ITEMS_POR_PAGINA = 12;
const DEBOUNCE_BUSQUEDA_MS = 300;

// ============================================
// TIPOS INTERNOS
// ============================================

interface EstadoPaginacion {
  readonly pagina: number;
  readonly limite: number;
  readonly totalItems: number;
  readonly totalPaginas: number;
  readonly hayMas: boolean;
}

// ============================================
// SERVICIO DE GIMNASIOS
// ============================================

@Injectable({
  providedIn: 'root',
})
export class GimnasiosApiService {
  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly http = inject(HttpBase);

  // ----------------------------------------
  // Estado privado - Signals
  // ----------------------------------------
  private readonly _gimnasios = signal<readonly GimnasioCard[]>([]);
  private readonly _gimnasioActual = signal<GimnasioDetalle | null>(null);
  private readonly _cargando = signal<boolean>(false);
  private readonly _cargandoMas = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _terminoBusqueda = signal<string>('');
  private readonly _filtros = signal<FiltrosBusqueda>({});
  private readonly _paginacion = signal<EstadoPaginacion>({
    pagina: 0,
    limite: ITEMS_POR_PAGINA,
    totalItems: 0,
    totalPaginas: 0,
    hayMas: false
  });

  // Subject para búsqueda con debounce
  private readonly _busquedaSubject = new Subject<string>();

  // ----------------------------------------
  // Señales públicas de solo lectura
  // ----------------------------------------
  readonly gimnasios = this._gimnasios.asReadonly();
  readonly gimnasioActual = this._gimnasioActual.asReadonly();
  readonly cargando = this._cargando.asReadonly();
  readonly cargandoMas = this._cargandoMas.asReadonly();
  readonly error = this._error.asReadonly();
  readonly terminoBusqueda = this._terminoBusqueda.asReadonly();
  readonly filtros = this._filtros.asReadonly();
  readonly paginacion = this._paginacion.asReadonly();

  // ----------------------------------------
  // Computed signals
  // ----------------------------------------
  readonly hayGimnasios = computed(() => this._gimnasios().length > 0);
  readonly totalGimnasios = computed(() => this._paginacion().totalItems);
  readonly hayMasPaginas = computed(() => this._paginacion().hayMas);
  readonly paginaActual = computed(() => this._paginacion().pagina);
  readonly estaFiltrando = computed(() => {
    const termino = this._terminoBusqueda();
    const filtros = this._filtros();
    return termino.length > 0 || Object.keys(filtros).length > 0;
  });

  // ----------------------------------------
  // Constructor
  // ----------------------------------------
  constructor() {
    this.configurarBusquedaConDebounce();
  }

  // ----------------------------------------
  // Configuración de búsqueda con debounce
  // ----------------------------------------
  private configurarBusquedaConDebounce(): void {
    this._busquedaSubject.pipe(
      debounceTime(DEBOUNCE_BUSQUEDA_MS),
      distinctUntilChanged(),
      switchMap((termino) => {
        this._terminoBusqueda.set(termino);
        return this.ejecutarBusqueda(termino);
      }),
      takeUntilDestroyed()
    ).subscribe();
  }

  // ----------------------------------------
  // GET - Obtener todos los gimnasios con paginación
  // ----------------------------------------
  obtenerTodos(reiniciar: boolean = true): Observable<readonly GimnasioCard[]> {
    if (reiniciar) {
      this.reiniciarPaginacion();
    }

    this._cargando.set(true);
    this._error.set(null);

    const pag = this._paginacion();
    const params = {
      pagina: pag.pagina.toString(),
      limite: pag.limite.toString()
    };

    return this.http.get<GimnasioCard[]>(API_URL, { params }).pipe(
      tap((gimnasios) => {
        this._gimnasios.set(gimnasios);
        this.actualizarPaginacion(gimnasios.length, reiniciar);
      }),
      finalize(() => this._cargando.set(false)),
      catchError((error) => {
        this._error.set(error.mensaje || 'Error al cargar gimnasios');
        return of([]);
      })
    );
  }

  // ----------------------------------------
  // GET - Cargar más gimnasios (paginación)
  // ----------------------------------------
  cargarMas(): Observable<readonly GimnasioCard[]> {
    const pag = this._paginacion();
    
    if (!pag.hayMas || this._cargandoMas()) {
      return of([]);
    }

    this._cargandoMas.set(true);

    const siguientePagina = pag.pagina + 1;
    const params = {
      pagina: siguientePagina.toString(),
      limite: pag.limite.toString()
    };

    return this.http.get<GimnasioCard[]>(API_URL, { params }).pipe(
      tap((nuevosGimnasios) => {
        this._gimnasios.update((actuales) => [...actuales, ...nuevosGimnasios]);
        this._paginacion.update((p) => ({
          ...p,
          pagina: siguientePagina,
          hayMas: nuevosGimnasios.length === pag.limite
        }));
      }),
      finalize(() => this._cargandoMas.set(false)),
      catchError((error) => {
        this._error.set(error.mensaje || 'Error al cargar más gimnasios');
        return of([]);
      })
    );
  }

  // ----------------------------------------
  // GET - Obtener gimnasios populares
  // ----------------------------------------
  obtenerPopulares(): Observable<readonly GimnasioCard[]> {
    this._cargando.set(true);
    this._error.set(null);

    return this.http.get<GimnasioCard[]>(`${API_URL}/populares`).pipe(
      tap((gimnasios) => this._gimnasios.set(gimnasios)),
      finalize(() => this._cargando.set(false)),
      catchError((error) => {
        this._error.set(error.mensaje || 'Error al cargar gimnasios populares');
        return of([]);
      })
    );
  }

  // ----------------------------------------
  // GET - Obtener gimnasios recientes
  // ----------------------------------------
  obtenerRecientes(): Observable<readonly GimnasioCard[]> {
    this._cargando.set(true);
    this._error.set(null);

    return this.http.get<GimnasioCard[]>(`${API_URL}/recientes`).pipe(
      tap((gimnasios) => this._gimnasios.set(gimnasios)),
      finalize(() => this._cargando.set(false)),
      catchError((error) => {
        this._error.set(error.mensaje || 'Error al cargar gimnasios recientes');
        return of([]);
      })
    );
  }

  // ----------------------------------------
  // GET - Obtener gimnasio por ID
  // ----------------------------------------
  obtenerPorId(id: number): Observable<GimnasioDetalle | null> {
    this._cargando.set(true);
    this._error.set(null);

    return this.http.get<GimnasioDetalle>(`${API_URL}/${id}`).pipe(
      tap((gimnasio) => this._gimnasioActual.set(gimnasio)),
      finalize(() => this._cargando.set(false)),
      catchError((error) => {
        this._error.set(error.mensaje || 'Error al cargar gimnasio');
        return of(null);
      })
    );
  }

  // ----------------------------------------
  // Búsqueda con debounce (método público)
  // ----------------------------------------
  buscarConDebounce(termino: string): void {
    this._busquedaSubject.next(termino);
  }

  // ----------------------------------------
  // Búsqueda inmediata
  // ----------------------------------------
  buscar(params: FiltrosBusqueda): Observable<readonly GimnasioCard[]> {
    this._filtros.set(params);
    this.reiniciarPaginacion();
    
    return this.ejecutarBusqueda(params.nombre || '');
  }

  // ----------------------------------------
  // Ejecutar búsqueda (privado)
  // ----------------------------------------
  private ejecutarBusqueda(termino: string): Observable<readonly GimnasioCard[]> {
    const terminoLimpio = termino.trim();
    const filtrosActivos = this._filtros();
    const noHayFiltros = !terminoLimpio && Object.keys(filtrosActivos).length === 0;
    
    if (noHayFiltros) {
      return this.obtenerTodos();
    }

    this._cargando.set(true);
    this._error.set(null);

    const params: Record<string, string> = {};
    
    if (terminoLimpio) {
      params['nombre'] = terminoLimpio;
    }
    if (filtrosActivos.ciudad) {
      params['ciudad'] = filtrosActivos.ciudad;
    }
    if (filtrosActivos.arteMarcial) {
      params['arteMarcial'] = filtrosActivos.arteMarcial;
    }

    return this.http.get<GimnasioCard[]>(`${API_URL}/buscar`, { params }).pipe(
      tap((gimnasios) => {
        this._gimnasios.set(gimnasios);
        this.actualizarPaginacion(gimnasios.length, true);
      }),
      finalize(() => this._cargando.set(false)),
      catchError((error) => {
        this._error.set(error.mensaje || 'Error al buscar gimnasios');
        return of([]);
      })
    );
  }

  // ----------------------------------------
  // Actualizar filtros
  // ----------------------------------------
  actualizarFiltros(nuevosFiltros: Partial<FiltrosBusqueda>): void {
    this._filtros.update((actuales) => ({ ...actuales, ...nuevosFiltros }));
  }

  // ----------------------------------------
  // Limpiar filtros
  // ----------------------------------------
  limpiarFiltros(): void {
    this._filtros.set({});
    this._terminoBusqueda.set('');
  }

  // ----------------------------------------
  // POST - Crear gimnasio
  // ----------------------------------------
  crear(datos: GimnasioRequest): Observable<GimnasioCard | null> {
    this._cargando.set(true);
    this._error.set(null);

    return this.http.post<GimnasioCard>(API_URL, datos).pipe(
      tap((nuevoGimnasio) => {
        this._gimnasios.update((lista) => [nuevoGimnasio, ...lista]);
        this._paginacion.update((p) => ({
          ...p,
          totalItems: p.totalItems + 1
        }));
      }),
      finalize(() => this._cargando.set(false)),
      catchError((error) => {
        this._error.set(error.mensaje || 'Error al crear gimnasio');
        return of(null);
      })
    );
  }

  // ----------------------------------------
  // PUT - Actualizar gimnasio
  // ----------------------------------------
  actualizar(id: number, datos: GimnasioRequest): Observable<GimnasioCard | null> {
    this._cargando.set(true);
    this._error.set(null);

    return this.http.put<GimnasioCard>(`${API_URL}/${id}`, datos).pipe(
      tap((gimnasioActualizado) => {
        this._gimnasios.update((lista) =>
          lista.map((g) => (g.id === id ? gimnasioActualizado : g))
        );
        const actual = this._gimnasioActual();
        if (actual && actual.id === id) {
          this.obtenerPorId(id).subscribe();
        }
      }),
      finalize(() => this._cargando.set(false)),
      catchError((error) => {
        this._error.set(error.mensaje || 'Error al actualizar gimnasio');
        return of(null);
      })
    );
  }

  // ----------------------------------------
  // DELETE - Eliminar gimnasio
  // ----------------------------------------
  eliminar(id: number): Observable<boolean> {
    this._cargando.set(true);
    this._error.set(null);

    return this.http.delete<void>(`${API_URL}/${id}`).pipe(
      tap(() => {
        this._gimnasios.update((lista) => lista.filter((g) => g.id !== id));
        this._paginacion.update((p) => ({
          ...p,
          totalItems: Math.max(0, p.totalItems - 1)
        }));
      }),
      finalize(() => this._cargando.set(false)),
      map(() => true as boolean),
      catchError((error) => {
        this._error.set(error.mensaje || 'Error al eliminar gimnasio');
        return of(false as boolean);
      })
    );
  }

  // ----------------------------------------
  // Limpiar gimnasio actual
  // ----------------------------------------
  limpiarGimnasioActual(): void {
    this._gimnasioActual.set(null);
  }

  // ----------------------------------------
  // Refrescar datos actual (sin perder scroll)
  // ----------------------------------------
  refrescar(): Observable<readonly GimnasioCard[]> {
    const terminoActual = this._terminoBusqueda();
    
    if (terminoActual) {
      return this.ejecutarBusqueda(terminoActual);
    }
    
    return this.obtenerTodos(false);
  }

  // ----------------------------------------
  // Métodos privados de paginación
  // ----------------------------------------
  private reiniciarPaginacion(): void {
    this._paginacion.set({
      pagina: 0,
      limite: ITEMS_POR_PAGINA,
      totalItems: 0,
      totalPaginas: 0,
      hayMas: false
    });
  }

  private actualizarPaginacion(cantidadRecibida: number, esNuevaBusqueda: boolean): void {
    this._paginacion.update((p) => ({
      ...p,
      totalItems: esNuevaBusqueda ? cantidadRecibida : p.totalItems,
      hayMas: cantidadRecibida === p.limite
    }));
  }
}
