import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

/**
 * Estrategia de precarga que espera a que el navegador esté idle
 * antes de precargar los módulos/componentes lazy.
 * 
 * Esto mejora significativamente el LCP (Largest Contentful Paint)
 * y FCP (First Contentful Paint) porque no compite con el renderizado inicial.
 */
@Injectable({
  providedIn: 'root',
})
export class IdlePreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    // Si la ruta tiene data.preload = false, no precargar
    if (route.data?.['preload'] === false) {
      return of(null);
    }

    // Precargar después de 2 segundos y cuando el browser esté idle
    return timer(2000).pipe(
      mergeMap(() => {
        return new Observable((observer) => {
          // Usar requestIdleCallback si está disponible
          if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
            (window as typeof window & { requestIdleCallback: (cb: () => void) => void })
              .requestIdleCallback(() => {
                load().subscribe({
                  next: (module) => {
                    observer.next(module);
                    observer.complete();
                  },
                  error: (err) => observer.error(err),
                });
              });
          } else {
            // Fallback: usar setTimeout
            setTimeout(() => {
              load().subscribe({
                next: (module) => {
                  observer.next(module);
                  observer.complete();
                },
                error: (err) => observer.error(err),
              });
            }, 100);
          }
        });
      })
    );
  }
}
