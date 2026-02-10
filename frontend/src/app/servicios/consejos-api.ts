import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, tap, finalize, catchError, of } from 'rxjs';
import { HttpBase } from './http-base';
import type { Consejo } from '../modelos';

const API_URL = '/api/consejos';


@Injectable({
  providedIn: 'root',
})
export class ConsejosApiService {

  private readonly http = inject(HttpBase);

  private readonly _consejos = signal<readonly Consejo[]>([]);
  private readonly _cargando = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly consejos = this._consejos.asReadonly();
  readonly cargando = this._cargando.asReadonly();
  readonly error = this._error.asReadonly();
  readonly hayConsejos = computed(() => this._consejos().length > 0);

  obtenerTodos(): Observable<readonly Consejo[]> {
    this._cargando.set(true);
    this._error.set(null);

    return this.http.get<Consejo[]>(API_URL).pipe(
      tap((consejos) => {
        this._consejos.set(consejos);
      }),
      finalize(() => this._cargando.set(false)),
      catchError((error) => {
        this._error.set(error.mensaje || 'Error al cargar los consejos');
        return of([]);
      })
    );
  }

  obtenerPorCategoria(categoria: string): Observable<readonly Consejo[]> {
    this._cargando.set(true);
    this._error.set(null);

    return this.http.get<Consejo[]>(API_URL, { params: { categoria } }).pipe(
      tap((consejos) => {
        this._consejos.set(consejos);
      }),
      finalize(() => this._cargando.set(false)),
      catchError((error) => {
        this._error.set(error.mensaje || 'Error al cargar los consejos');
        return of([]);
      })
    );
  }
}
