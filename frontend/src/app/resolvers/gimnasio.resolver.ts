import { inject } from '@angular/core';
import { ResolveFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { catchError, of, Observable } from 'rxjs';
import { GimnasiosApiService } from '../servicios/gimnasios-api';
import type { GimnasioDetalle } from '../modelos';

// Re-exportar para compatibilidad
export type { GimnasioDetalle as Gimnasio } from '../modelos';

// ============================================
// CONSTANTES
// ============================================

const RUTA_ERROR = '/404';

// ============================================
// RESOLVER
// ============================================

export const gimnasioResolver: ResolveFn<GimnasioDetalle | null> = (
  route: ActivatedRouteSnapshot
): Observable<GimnasioDetalle | null> => {
  const router = inject(Router);
  const gimnasiosService = inject(GimnasiosApiService);
  const id = obtenerIdDeRuta(route);

  if (!id) {
    router.navigate([RUTA_ERROR]);
    return of(null);
  }

  return gimnasiosService.obtenerPorId(id).pipe(
    catchError(() => {
      router.navigate([RUTA_ERROR]);
      return of(null);
    })
  );
};

// ============================================
// HELPERS
// ============================================

function obtenerIdDeRuta(route: ActivatedRouteSnapshot): number | null {
  const idString = route.paramMap.get('id');
  
  if (!idString) return null;
  
  const id = parseInt(idString, 10);
  
  return isNaN(id) ? null : id;
}
