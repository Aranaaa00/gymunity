import { Injectable, inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { HttpBase } from './http-base';

interface CiudadResponse {
  existe: boolean;
  nombre: string;
}

const DELAY_DEBOUNCE = 500;
const API_URL = '/api/usuarios/verificar';

@Injectable({ providedIn: 'root' })
export class ValidadoresAsincronos {
  
  private readonly http = inject(HttpBase);

  emailUnico(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return timer(DELAY_DEBOUNCE).pipe(
        switchMap(() => this.http.get<boolean>(`${API_URL}/email/${encodeURIComponent(control.value)}`)),
        map((emailExiste) => emailExiste ? { emailNoDisponible: true } : null),
        catchError(() => of(null))
      );
    };
  }

  usernameUnico(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return timer(DELAY_DEBOUNCE).pipe(
        switchMap(() => this.http.get<boolean>(`${API_URL}/username/${encodeURIComponent(control.value)}`)),
        map((usernameExiste) => usernameExiste ? { usernameNoDisponible: true } : null),
        catchError(() => of(null))
      );
    };
  }

  ciudadExiste(): AsyncValidatorFn {
    const ciudadesValidadas = new Set<string>();
    
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const ciudad = control.value?.trim();

      if (!ciudad || ciudad.length < 2) {
        return of(null);
      }
      
      const ciudadLower = ciudad.toLowerCase();
      if (ciudadesValidadas.has(ciudadLower)) {
        return of(null);
      }

      return timer(DELAY_DEBOUNCE).pipe(
        switchMap(() => this.http.get<CiudadResponse>(`${API_URL}/ciudad/${encodeURIComponent(ciudad)}`)),
        tap((response) => {
          if (response.existe && response.nombre) {
            ciudadesValidadas.add(response.nombre.toLowerCase());
            if (response.nombre !== ciudad) {
              Promise.resolve().then(() => {
                control.setValue(response.nombre, { emitEvent: false, onlySelf: true });
                control.markAsPristine();
              });
            }
          }
        }),
        map((response) => response.existe ? null : { ciudadNoExiste: true }),
        catchError(() => of(null))
      );
    };
  }
}

export const MENSAJES_VALIDACION_ASINCRONA = {
  emailNoDisponible: 'Este email ya está registrado',
  usernameNoDisponible: 'Este nombre de usuario no está disponible',
  ciudadNoExiste: 'Esta ciudad no existe. Introduce una ciudad real',
} as const;
