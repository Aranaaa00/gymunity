import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, tap, finalize, catchError, of, map, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpBase } from './http-base';
import { CacheService } from './cache';
import type { 
  GimnasioCard, 
  GimnasioDetalle, 
  GimnasioRequest,
  FiltrosBusqueda
} from '../modelos';

const API_URL = '/api/gimnasios';
const ITEMS_POR_PAGINA = 12;
const DEBOUNCE_BUSQUEDA_MS = 300;
const CACHE_KEYS = {
  POPULARES: 'gimnasios:populares',
  RECIENTES: 'gimnasios:recientes',
  CIUDAD: 'gimnasios:ciudad',
  DETALLE: 'gimnasios:detalle'
} as const;

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
  
  private readonly http = inject(HttpBase);
  private readonly cache = inject(CacheService);

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

  private readonly _busquedaSubject = new Subject<string>();

  readonly gimnasios = this._gimnasios.asReadonly();
  readonly gimnasioActual = this._gimnasioActual.asReadonly();
  readonly cargando = this._cargando.asReadonly();
  readonly cargandoMas = this._cargandoMas.asReadonly();
  readonly error = this._error.asReadonly();
  readonly terminoBusqueda = this._terminoBusqueda.asReadonly();
  readonly filtros = this._filtros.asReadonly();
  readonly paginacion = this._paginacion.asReadonly();

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

  obtenerPopulares(): Observable<readonly GimnasioCard[]> {
    const cached = this.cache.get<GimnasioCard[]>(CACHE_KEYS.POPULARES);
    if (cached) {
      return of(cached);
    }

    this._error.set(null);

    return this.http.get<GimnasioCard[]>(`${API_URL}/populares`).pipe(
      tap((gimnasios) => {
        this.cache.set(CACHE_KEYS.POPULARES, gimnasios);
      }),
      catchError((error) => {
        this._error.set(error.mensaje || 'Error al cargar gimnasios populares');
        return of([]);
      })
    );
  }

  obtenerRecientes(): Observable<readonly GimnasioCard[]> {
    const cached = this.cache.get<GimnasioCard[]>(CACHE_KEYS.RECIENTES);
    if (cached) {
      return of(cached);
    }

    this._error.set(null);

    return this.http.get<GimnasioCard[]>(`${API_URL}/recientes`).pipe(
      tap((gimnasios) => {
        this.cache.set(CACHE_KEYS.RECIENTES, gimnasios);
      }),
      catchError((error) => {
        this._error.set(error.mensaje || 'Error al cargar gimnasios recientes');
        return of([]);
      })
    );
  }

  obtenerPorId(id: number): Observable<GimnasioDetalle | null> {
    const cacheKey = this.cache.generarClave(CACHE_KEYS.DETALLE, id);
    const cached = this.cache.get<GimnasioDetalle>(cacheKey);
    if (cached) {
      this._gimnasioActual.set(cached);
      return of(cached);
    }

    this._cargando.set(true);
    this._error.set(null);

    return this.http.get<GimnasioDetalle>(`${API_URL}/${id}`).pipe(
      tap((gimnasio) => {
        this._gimnasioActual.set(gimnasio);
        this.cache.set(cacheKey, gimnasio);
      }),
      finalize(() => this._cargando.set(false)),
      catchError((error) => {
        this._error.set(error.mensaje || 'Error al cargar gimnasio');
        return of(null);
      })
    );
  }

  buscarConDebounce(termino: string): void {
    this._busquedaSubject.next(termino);
  }

  buscar(params: FiltrosBusqueda): Observable<readonly GimnasioCard[]> {
    this._filtros.set(params);
    this.reiniciarPaginacion();
    
    if (params.ciudad && !params.nombre && !params.arteMarcial) {
      const cacheKey = this.cache.generarClave(CACHE_KEYS.CIUDAD, params.ciudad.toLowerCase());
      const cached = this.cache.get<GimnasioCard[]>(cacheKey);
      if (cached) {
        this._gimnasios.set(cached);
        return of(cached);
      }
    }
    
    return this.ejecutarBusqueda(params.nombre || '');
  }

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

    const soloCiudad = filtrosActivos.ciudad && !terminoLimpio && !filtrosActivos.arteMarcial;

    return this.http.get<GimnasioCard[]>(`${API_URL}/buscar`, { params }).pipe(
      tap((gimnasios) => {
        this._gimnasios.set(gimnasios);
        this.actualizarPaginacion(gimnasios.length, true);
        
        if (soloCiudad && filtrosActivos.ciudad) {
          const cacheKey = this.cache.generarClave(CACHE_KEYS.CIUDAD, filtrosActivos.ciudad.toLowerCase());
          this.cache.set(cacheKey, gimnasios);
        }
      }),
      finalize(() => this._cargando.set(false)),
      catchError((error) => {
        this._error.set(error.mensaje || 'Error al buscar gimnasios');
        return of([]);
      })
    );
  }

  actualizarFiltros(nuevosFiltros: Partial<FiltrosBusqueda>): void {
    this._filtros.update((actuales) => ({ ...actuales, ...nuevosFiltros }));
  }

  limpiarFiltros(): void {
    this._filtros.set({});
    this._terminoBusqueda.set('');
  }

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
        this.cache.invalidar('gimnasios');
      }),
      finalize(() => this._cargando.set(false)),
      catchError((error) => {
        this._error.set(error.mensaje || 'Error al crear gimnasio');
        return of(null);
      })
    );
  }

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
        this.cache.invalidar('gimnasios');
      }),
      finalize(() => this._cargando.set(false)),
      catchError((error) => {
        this._error.set(error.mensaje || 'Error al actualizar gimnasio');
        return of(null);
      })
    );
  }

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
        this.cache.invalidar('gimnasios');
      }),
      finalize(() => this._cargando.set(false)),
      map(() => true as boolean),
      catchError((error) => {
        this._error.set(error.mensaje || 'Error al eliminar gimnasio');
        return of(false as boolean);
      })
    );
  }

  limpiarGimnasioActual(): void {
    this._gimnasioActual.set(null);
  }

  refrescar(): Observable<readonly GimnasioCard[]> {
    this.cache.invalidar('gimnasios');
    const terminoActual = this._terminoBusqueda();
    
    if (terminoActual) {
      return this.ejecutarBusqueda(terminoActual);
    }
    
    return this.obtenerTodos(false);
  }

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
