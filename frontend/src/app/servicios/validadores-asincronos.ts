import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

// ============================================
// CONSTANTES
// ============================================

const DELAY_DEBOUNCE = 500;

// Emails que ya existen (simulación)
const EMAILS_EXISTENTES = new Set([
  'usuario@gymunity.com',
  'admin@gymunity.com',
  'test@example.com',
]);

// Usernames que ya existen (simulación)
const USERNAMES_EXISTENTES = new Set([
  'admin',
  'usuario',
  'gymunity',
  'test',
  'demo',
]);

// ============================================
// SERVICIO DE VALIDADORES ASÍNCRONOS
// ============================================

@Injectable({ providedIn: 'root' })
export class ValidadoresAsincronos {
  // ----------------------------------------
  // Validador de email único
  // ----------------------------------------
  
  /**
   * Valida que el email no esté registrado en la base de datos.
   * Simula una llamada a la API con debounce.
   */
  emailUnico(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const email = control.value;

      const esVacio = !email;
      if (esVacio) {
        return of(null);
      }

      return timer(DELAY_DEBOUNCE).pipe(
        switchMap(() => this.verificarEmailEnBD(email)),
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
   * Simula una llamada a la API con debounce.
   */
  usernameUnico(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const username = control.value;

      const esVacio = !username;
      if (esVacio) {
        return of(null);
      }

      return timer(DELAY_DEBOUNCE).pipe(
        switchMap(() => this.verificarUsernameEnBD(username)),
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

  // ----------------------------------------
  // Métodos privados (simulan llamadas a API)
  // ----------------------------------------
  
  /**
   * Simula verificación de email en base de datos
   * En producción, esto sería una llamada HTTP real
   */
  private verificarEmailEnBD(email: string): Observable<boolean> {
    const emailNormalizado = email.toLowerCase().trim();
    const existe = EMAILS_EXISTENTES.has(emailNormalizado);
    
    return of(existe);
  }

  /**
   * Simula verificación de username en base de datos
   * En producción, esto sería una llamada HTTP real
   */
  private verificarUsernameEnBD(username: string): Observable<boolean> {
    const usernameNormalizado = username.toLowerCase().trim();
    const existe = USERNAMES_EXISTENTES.has(usernameNormalizado);
    
    return of(existe);
  }
}

// ============================================
// MENSAJES DE ERROR ASÍNCRONOS
// ============================================

export const MENSAJES_VALIDACION_ASINCRONA = {
  emailNoDisponible: 'Este email ya está registrado',
  usernameNoDisponible: 'Este nombre de usuario no está disponible',
} as const;
