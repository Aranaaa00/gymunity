import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../servicios/auth';

// ============================================
// CONSTANTES
// ============================================

const RUTA_REDIRECCION = '/';

// ============================================
// GUARDS
// ============================================

/**
 * Guard que protege rutas requiriendo autenticación
 */
export const autenticacionGuard: CanActivateFn = (): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const estaAutenticado = authService.estaAutenticado();

  return estaAutenticado ? true : router.createUrlTree([RUTA_REDIRECCION]);
};

/**
 * Guard para rutas que solo deben ser accesibles sin autenticar
 */
export const noAutenticadoGuard: CanActivateFn = (): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const estaAutenticado = authService.estaAutenticado();

  return !estaAutenticado ? true : router.createUrlTree([RUTA_REDIRECCION]);
};
