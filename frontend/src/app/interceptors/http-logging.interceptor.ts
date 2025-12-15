import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// ============================================
// CONSTANTES
// ============================================

const HABILITADO = true; // Cambiar a false en producción
const COLOR_REQUEST = '#3B82F6'; // Azul
const COLOR_SUCCESS = '#10B981'; // Verde
const COLOR_ERROR = '#EF4444'; // Rojo

// ============================================
// INTERCEPTOR HTTP LOGGING
// ============================================

export const httpLoggingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  if (!HABILITADO) {
    return next(req);
  }

  const inicioTiempo = Date.now();

  logearRequest(req);

  return next(req).pipe(
    tap({
      next: (evento) => {
        if (evento instanceof HttpResponse) {
          const duracion = Date.now() - inicioTiempo;
          logearRespuestaExitosa(req, evento, duracion);
        }
      },
      error: (error) => {
        const duracion = Date.now() - inicioTiempo;
        logearError(req, error, duracion);
      },
    })
  );
};

// ----------------------------------------
// Helpers de logging
// ----------------------------------------

function logearRequest(req: HttpRequest<unknown>): void {
  console.groupCollapsed(
    `%c→ ${req.method} %c${req.urlWithParams}`,
    `color: ${COLOR_REQUEST}; font-weight: bold`,
    'color: inherit'
  );
  console.log('Headers:', formatearHeaders(req.headers));
  
  if (req.body) {
    console.log('Body:', req.body);
  }
  
  console.groupEnd();
}

function logearRespuestaExitosa(
  req: HttpRequest<unknown>,
  res: HttpResponse<unknown>,
  duracion: number
): void {
  console.groupCollapsed(
    `%c← ${req.method} %c${req.urlWithParams} %c${res.status} %c(${duracion}ms)`,
    `color: ${COLOR_SUCCESS}; font-weight: bold`,
    'color: inherit',
    `color: ${COLOR_SUCCESS}`,
    'color: #6B7280'
  );
  console.log('Status:', res.status, res.statusText);
  console.log('Headers:', formatearHeaders(res.headers));
  
  if (res.body) {
    console.log('Response:', res.body);
  }
  
  console.groupEnd();
}

function logearError(req: HttpRequest<unknown>, error: unknown, duracion: number): void {
  console.groupCollapsed(
    `%c✖ ${req.method} %c${req.urlWithParams} %c(${duracion}ms)`,
    `color: ${COLOR_ERROR}; font-weight: bold`,
    'color: inherit',
    'color: #6B7280'
  );
  console.error('Error:', error);
  console.groupEnd();
}

function formatearHeaders(headers: { keys(): string[]; get(name: string): string | null }): Record<string, string> {
  const headersObj: Record<string, string> = {};
  
  headers.keys().forEach((key) => {
    const valor = headers.get(key);
    if (valor) {
      headersObj[key] = valor;
    }
  });
  
  return headersObj;
}
