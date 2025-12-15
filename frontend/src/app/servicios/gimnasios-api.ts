import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, tap, finalize, catchError, of, map } from 'rxjs';
import { HttpBase } from './http-base';
import type { 
  GimnasioCard, 
  GimnasioDetalle, 
  GimnasioRequest 
} from '../modelos';

// ============================================
// CONSTANTES
// ============================================

const API_URL = '/api/gimnasios';

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
  // Estado
  // ----------------------------------------
  private readonly _gimnasios = signal<readonly GimnasioCard[]>([]);
  private readonly _gimnasioActual = signal<GimnasioDetalle | null>(null);
  private readonly _cargando = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // ----------------------------------------
  // Señales públicas
  // ----------------------------------------
  readonly gimnasios = this._gimnasios.asReadonly();
  readonly gimnasioActual = this._gimnasioActual.asReadonly();
  readonly cargando = this._cargando.asReadonly();
  readonly error = this._error.asReadonly();
  readonly hayGimnasios = computed(() => this._gimnasios().length > 0);

  // ----------------------------------------
  // GET - Obtener todos los gimnasios
  // ----------------------------------------
  obtenerTodos(): Observable<readonly GimnasioCard[]> {
    this._cargando.set(true);
    this._error.set(null);

    return this.http.get<GimnasioCard[]>(API_URL).pipe(
      tap((gimnasios) => this._gimnasios.set(gimnasios)),
      finalize(() => this._cargando.set(false)),
      catchError((error) => {
        this._error.set(error.mensaje || 'Error al cargar gimnasios');
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
  // GET - Buscar gimnasios
  // ----------------------------------------
  buscar(params: {
    nombre?: string;
    ciudad?: string;
    arteMarcial?: string;
  }): Observable<readonly GimnasioCard[]> {
    this._cargando.set(true);
    this._error.set(null);

    return this.http.get<GimnasioCard[]>(`${API_URL}/buscar`, { params }).pipe(
      tap((gimnasios) => this._gimnasios.set(gimnasios)),
      finalize(() => this._cargando.set(false)),
      catchError((error) => {
        this._error.set(error.mensaje || 'Error al buscar gimnasios');
        return of([]);
      })
    );
  }

  // ----------------------------------------
  // POST - Crear gimnasio
  // ----------------------------------------
  crear(datos: GimnasioRequest): Observable<GimnasioCard | null> {
    this._cargando.set(true);
    this._error.set(null);

    return this.http.post<GimnasioCard>(API_URL, datos).pipe(
      tap((nuevoGimnasio) => {
        this._gimnasios.update((lista) => [...lista, nuevoGimnasio]);
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
      tap(() => this._gimnasios.update((lista) => lista.filter((g) => g.id !== id))),
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
}
