import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retryWhen, mergeMap } from 'rxjs/operators';

// ============================================
// TIPOS
// ============================================

export interface OpcionesHttp {
  readonly headers?: HttpHeaders | Record<string, string>;
  readonly params?: HttpParams | Record<string, string | number | boolean | readonly (string | number | boolean)[]>;
  readonly reportProgress?: boolean;
  readonly withCredentials?: boolean;
  readonly responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
}

export interface QueryParams {
  readonly [key: string]: string | number | boolean | readonly (string | number | boolean)[] | null | undefined;
}

export interface OpcionesPaginacion {
  readonly pagina?: number;
  readonly limite?: number;
  readonly ordenarPor?: string;
  readonly orden?: 'asc' | 'desc';
}

export interface ErrorApi {
  readonly mensaje: string;
  readonly codigo: number;
  readonly detalles?: unknown;
}

// ============================================
// CONSTANTES
// ============================================

const REINTENTOS_MAXIMOS = 3;
const RETRASO_REINTENTO_MS = 1000;

const CODIGOS_NO_REINTENTAR = [400, 401, 403, 404, 422];

// ============================================
// SERVICIO BASE HTTP
// ============================================

@Injectable({
  providedIn: 'root',
})
export class HttpBase {
  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly http = inject(HttpClient);

  // ----------------------------------------
  // GET - Obtener recursos
  // ----------------------------------------
  get<T>(url: string, opciones?: OpcionesHttp): Observable<T> {
    return this.http
      .get<T>(url, this.construirOpciones(opciones))
      .pipe(
        retryWhen((errores) => this.estrategiaReintento(errores)),
        catchError((error) => this.manejarError(error))
      );
  }

  // ----------------------------------------
  // POST - Crear recursos
  // ----------------------------------------
  post<T, D = unknown>(url: string, datos: D, opciones?: OpcionesHttp): Observable<T> {
    return this.http
      .post<T>(url, datos, this.construirOpciones(opciones))
      .pipe(
        catchError((error) => this.manejarError(error))
      );
  }

  // ----------------------------------------
  // PUT - Actualizar recursos completos
  // ----------------------------------------
  put<T, D = unknown>(url: string, datos: D, opciones?: OpcionesHttp): Observable<T> {
    return this.http
      .put<T>(url, datos, this.construirOpciones(opciones))
      .pipe(
        catchError((error) => this.manejarError(error))
      );
  }

  // ----------------------------------------
  // PATCH - Actualizar recursos parcialmente
  // ----------------------------------------
  patch<T, D = unknown>(url: string, datos: D, opciones?: OpcionesHttp): Observable<T> {
    return this.http
      .patch<T>(url, datos, this.construirOpciones(opciones))
      .pipe(
        catchError((error) => this.manejarError(error))
      );
  }

  // ----------------------------------------
  // DELETE - Eliminar recursos
  // ----------------------------------------
  delete<T>(url: string, opciones?: OpcionesHttp): Observable<T> {
    return this.http
      .delete<T>(url, this.construirOpciones(opciones))
      .pipe(
        catchError((error) => this.manejarError(error))
      );
  }

  // ----------------------------------------
  // UPLOAD - Subir archivos con FormData
  // ----------------------------------------
  upload<T>(url: string, formData: FormData, opciones?: OpcionesHttp): Observable<T> {
    const opcionesConProgreso = {
      ...opciones,
      reportProgress: true,
    };

    return this.http
      .post<T>(url, formData, this.construirOpciones(opcionesConProgreso))
      .pipe(
        catchError((error) => this.manejarError(error))
      );
  }

  // ----------------------------------------
  // GET con paginación y filtros
  // ----------------------------------------
  getPaginado<T>(
    url: string,
    filtros?: QueryParams,
    paginacion?: OpcionesPaginacion,
    opciones?: OpcionesHttp
  ): Observable<T> {
    const params = this.construirQueryParams(filtros, paginacion);
    const opcionesConParams = {
      ...opciones,
      params,
    };

    return this.get<T>(url, opcionesConParams);
  }

  // ----------------------------------------
  // Métodos privados
  // ----------------------------------------
  private construirOpciones(opciones?: OpcionesHttp): object {
    return {
      headers: opciones?.headers,
      params: opciones?.params,
      reportProgress: opciones?.reportProgress,
      withCredentials: opciones?.withCredentials,
      responseType: opciones?.responseType,
    };
  }

  private construirQueryParams(
    filtros?: QueryParams,
    paginacion?: OpcionesPaginacion
  ): HttpParams {
    let params = new HttpParams();

    // Añadir parámetros de paginación
    if (paginacion) {
      if (paginacion.pagina !== undefined) {
        params = params.set('pagina', paginacion.pagina.toString());
      }
      if (paginacion.limite !== undefined) {
        params = params.set('limite', paginacion.limite.toString());
      }
      if (paginacion.ordenarPor) {
        params = params.set('ordenarPor', paginacion.ordenarPor);
      }
      if (paginacion.orden) {
        params = params.set('orden', paginacion.orden);
      }
    }

    // Añadir filtros
    if (filtros) {
      Object.entries(filtros).forEach(([clave, valor]) => {
        if (valor !== null && valor !== undefined) {
          if (Array.isArray(valor)) {
            // Para arrays, añadir múltiples valores con la misma clave
            valor.forEach((item) => {
              params = params.append(clave, String(item));
            });
          } else {
            params = params.set(clave, String(valor));
          }
        }
      });
    }

    return params;
  }

  private manejarError(error: HttpErrorResponse): Observable<never> {
    const errorApi = this.construirErrorApi(error);
    console.error('Error HTTP:', errorApi);
    return throwError(() => errorApi);
  }

  private construirErrorApi(error: HttpErrorResponse): ErrorApi {
    const esErrorCliente = error.error instanceof ErrorEvent;

    if (esErrorCliente) {
      return {
        mensaje: error.error.message || 'Error del cliente',
        codigo: 0,
        detalles: error.error,
      };
    }

    return {
      mensaje: error.error?.mensaje || error.message || 'Error del servidor',
      codigo: error.status,
      detalles: error.error,
    };
  }

  private debeReintentar(error: HttpErrorResponse): boolean {
    return !CODIGOS_NO_REINTENTAR.includes(error.status);
  }

  private estrategiaReintento(errores: Observable<HttpErrorResponse>): Observable<number> {
    return errores.pipe(
      mergeMap((error, indice) => {
        const intentoActual = indice + 1;
        const alcanzadoMaximo = intentoActual > REINTENTOS_MAXIMOS;
        const noDebeReintentar = !this.debeReintentar(error);

        if (alcanzadoMaximo || noDebeReintentar) {
          return throwError(() => error);
        }

        const retraso = RETRASO_REINTENTO_MS * intentoActual;
        return timer(retraso);
      })
    );
  }
}
