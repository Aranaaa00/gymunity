import { Injectable, inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { HttpBase } from './http-base';

// ============================================
// CONSTANTES
// ============================================

const DELAY_DEBOUNCE = 500;
const API_URL = '/api/usuarios/verificar';

// ============================================
// SERVICIO DE VALIDADORES ASÍNCRONOS
// ============================================

@Injectable({ providedIn: 'root' })
export class ValidadoresAsincronos {
  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly http = inject(HttpBase);

  // ----------------------------------------
  // Validador de email único
  // ----------------------------------------
  
  /**
   * Valida que el email no esté registrado en la base de datos.
   */
  emailUnico(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const email = control.value;

      const esVacio = !email;
      if (esVacio) {
        return of(null);
      }

      return timer(DELAY_DEBOUNCE).pipe(
        switchMap(() => this.http.get<boolean>(`${API_URL}/email/${encodeURIComponent(email)}`)),
        map((emailExiste) => {
          if (emailExiste) {
            return { emailNoDisponible: true };
          }
          return null;
        }),
        catchError(() => of(null))
      );
    };
  }

  // ----------------------------------------
  // Validador de username único
  // ----------------------------------------
  
  /**
   * Valida que el username no esté registrado en la base de datos.
   */
  usernameUnico(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const username = control.value;

      const esVacio = !username;
      if (esVacio) {
        return of(null);
      }

      return timer(DELAY_DEBOUNCE).pipe(
        switchMap(() => this.http.get<boolean>(`${API_URL}/username/${encodeURIComponent(username)}`)),
        map((usernameExiste) => {
          if (usernameExiste) {
            return { usernameNoDisponible: true };
          }
          return null;
        }),
        catchError(() => of(null))
      );
    };
  }
}

// ============================================
// MENSAJES DE ERROR ASÍNCRONOS
// ============================================

export const MENSAJES_VALIDACION_ASINCRONA = {
  emailNoDisponible: 'Este email ya está registrado',
  usernameNoDisponible: 'Este nombre de usuario no está disponible',
} as const;
