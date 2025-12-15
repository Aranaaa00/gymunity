import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry, retryWhen, mergeMap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

// ============================================
// CONSTANTES
// ============================================

const REINTENTOS_MAXIMOS = 2;
const RETRASO_REINTENTO_MS = 1000;

const CODIGOS_NO_REINTENTAR = [400, 401, 403, 404, 422];
const CODIGO_NO_AUTORIZADO = 401;
const CODIGO_SERVIDOR_CAIDO = [500, 502, 503, 504];

// ============================================
// INTERCEPTOR HTTP ERROR
// ============================================

export const httpErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  
  return next(req).pipe(
    retry({
      count: REINTENTOS_MAXIMOS,
      delay: (error: HttpErrorResponse, intentoNumero: number) => {
        const debeReintentar = esErrorReintentar(error);
        
        if (!debeReintentar) {
          return throwError(() => error);
        }
        
        const retraso = calcularRetraso(intentoNumero);
        return timer(retraso);
      },
    }),
    catchError((error: HttpErrorResponse) => {
      manejarErrorEspecifico(error, router);
      return throwError(() => error);
    })
  );
};

// ----------------------------------------
// Helpers
// ----------------------------------------

function esErrorReintentar(error: HttpErrorResponse): boolean {
  const esErrorServidor = CODIGO_SERVIDOR_CAIDO.includes(error.status);
  const esErrorRed = error.status === 0;
  
  return esErrorServidor || esErrorRed;
}

function calcularRetraso(intento: number): number {
  return RETRASO_REINTENTO_MS * intento;
}

function manejarErrorEspecifico(error: HttpErrorResponse, router: Router): void {
  const esNoAutorizado = error.status === CODIGO_NO_AUTORIZADO;
  
  if (esNoAutorizado) {
    limpiarSesion();
    router.navigate(['/']);
    return;
  }
  
  console.error('Error HTTP:', {
    mensaje: error.message,
    status: error.status,
    url: error.url,
  });
}

function limpiarSesion(): void {
  const esBrowser = typeof window !== 'undefined';
  
  if (!esBrowser) {
    return;
  }
  
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
}
