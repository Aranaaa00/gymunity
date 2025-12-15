import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

// ============================================
// CONSTANTES
// ============================================

const HEADER_CONTENT_TYPE = 'Content-Type';
const HEADER_ACCEPT = 'Accept';
const HEADER_AUTHORIZATION = 'Authorization';

const CONTENT_TYPE_JSON = 'application/json';
const ACCEPT_JSON = 'application/json';

const CLAVE_TOKEN = 'gymunity_token';

// ============================================
// INTERCEPTOR HTTP HEADERS
// ============================================

export const httpHeadersInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const tokenAlmacenado = obtenerTokenDeStorage();
  
  const headers = construirHeaders(req, tokenAlmacenado);
  
  const reqConHeaders = req.clone({ setHeaders: headers });
  
  return next(reqConHeaders);
};

// ----------------------------------------
// Helpers
// ----------------------------------------

function obtenerTokenDeStorage(): string | null {
  const esBrowser = typeof window !== 'undefined';
  
  if (!esBrowser) {
    return null;
  }
  
  return localStorage.getItem(CLAVE_TOKEN);
}

function construirHeaders(req: HttpRequest<unknown>, token: string | null): Record<string, string> {
  const headers: Record<string, string> = {};
  
  const tieneContentType = req.headers.has(HEADER_CONTENT_TYPE);
  if (!tieneContentType) {
    headers[HEADER_CONTENT_TYPE] = CONTENT_TYPE_JSON;
  }
  
  const tieneAccept = req.headers.has(HEADER_ACCEPT);
  if (!tieneAccept) {
    headers[HEADER_ACCEPT] = ACCEPT_JSON;
  }
  
  const hayToken = !!token;
  const noTieneAuth = !req.headers.has(HEADER_AUTHORIZATION);
  if (hayToken && noTieneAuth) {
    headers[HEADER_AUTHORIZATION] = `Bearer ${token}`;
  }
  
  return headers;
}
