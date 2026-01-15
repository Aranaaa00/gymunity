import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { HttpBase } from './http-base';
import type { 
  Usuario, 
  AuthResponse, 
  LoginRequest, 
  RegistroRequest 
} from '../modelos';

// ============================================
// CONSTANTES
// ============================================

const API_URL = '/api/auth';
const CLAVE_TOKEN = 'gymunity_token';
const CLAVE_USUARIO = 'gymunity_usuario';
const CLAVE_ULTIMA_ACTIVIDAD = 'gymunity_ultima_actividad';
const CLAVE_CREDENCIALES = 'gymunity_credenciales';
const EXPIRACION_SESION_MS = 6 * 60 * 60 * 1000; // 6 horas

// ============================================
// SERVICIO DE AUTENTICACIÓN
// ============================================

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly http = inject(HttpBase);
  private readonly router = inject(Router);
  private readonly plataformaId = inject(PLATFORM_ID);

  // ----------------------------------------
  // Estado privado
  // ----------------------------------------
  private readonly _usuario = signal<Usuario | null>(null);
  private readonly _token = signal<string | null>(null);
  private readonly _cargando = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // ----------------------------------------
  // Señales públicas (readonly)
  // ----------------------------------------
  readonly usuario = this._usuario.asReadonly();
  readonly token = this._token.asReadonly();
  readonly cargando = this._cargando.asReadonly();
  readonly error = this._error.asReadonly();
  readonly estaAutenticado = computed(() => this._usuario() !== null && this._token() !== null);

  // ----------------------------------------
  // Constructor
  // ----------------------------------------
  constructor() {
    this.restaurarSesion();
  }

  // ----------------------------------------
  // Login
  // ----------------------------------------
  login(identifier: string, contrasenia: string): Observable<boolean> {
    this._cargando.set(true);
    this._error.set(null);

    // El backend acepta email o username en el campo 'email'
    const request: LoginRequest = { email: identifier, contrasenia };

    return this.http.post<AuthResponse>(`${API_URL}/login`, request).pipe(
      tap((response) => this.procesarAuthResponse(response)),
      map(() => true),
      catchError((error) => {
        const mensajeError = this.obtenerMensajeError(error);
        this._error.set(mensajeError);
        this._cargando.set(false);
        return of(false);
      })
    );
  }

  private obtenerMensajeError(error: { codigo?: number; mensaje?: string }): string {
    if (error.codigo === 401 || error.codigo === 403) {
      return 'Usuario o contraseña incorrectos';
    }
    if (error.codigo === 404) {
      return 'El usuario no existe. ¿Quieres crear una cuenta?';
    }
    if (error.codigo === 500) {
      return 'El usuario no existe o las credenciales son incorrectas';
    }
    if (error.codigo === 0) {
      return 'No se pudo conectar con el servidor. Verifica tu conexión';
    }
    return error.mensaje || 'Error al iniciar sesión. Inténtalo de nuevo';
  }

  // ----------------------------------------
  // Registro
  // ----------------------------------------
  registrar(datos: {
    nombreUsuario: string;
    email: string;
    contrasenia: string;
    ciudad: string;
  }): Observable<boolean> {
    this._cargando.set(true);
    this._error.set(null);

    const request: RegistroRequest = {
      ...datos,
      rol: 'ALUMNO',
    };

    return this.http.post<AuthResponse>(`${API_URL}/register`, request).pipe(
      tap((response) => this.procesarAuthResponse(response)),
      map(() => true),
      catchError((error) => {
        this._error.set(error.mensaje || 'Error al registrarse');
        this._cargando.set(false);
        return of(false);
      })
    );
  }

  // ----------------------------------------
  // Cerrar sesión
  // ----------------------------------------
  cerrarSesion(): void {
    this._usuario.set(null);
    this._token.set(null);
    this.limpiarAlmacenamiento();
    this.router.navigate(['/']);
  }

  // ----------------------------------------
  // Obtener token para interceptores
  // ----------------------------------------
  obtenerToken(): string | null {
    return this._token();
  }

  // ----------------------------------------
  // Métodos privados
  // ----------------------------------------
  private procesarAuthResponse(response: AuthResponse): void {
    const usuario: Usuario = {
      id: response.id,
      nombreUsuario: response.nombreUsuario,
      email: response.email,
      rol: response.rol as Usuario['rol'],
      ciudad: response.ciudad,
      avatar: response.avatar,
    };

    this._usuario.set(usuario);
    this._token.set(response.token);
    this._cargando.set(false);
    this.guardarEnAlmacenamiento(usuario, response.token);
    
    // Scroll al top después del login
    if (this.esBrowser()) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  private restaurarSesion(): void {
    if (!this.esBrowser()) return;

    const tokenGuardado = localStorage.getItem(CLAVE_TOKEN);
    const usuarioGuardado = localStorage.getItem(CLAVE_USUARIO);
    const ultimaActividad = localStorage.getItem(CLAVE_ULTIMA_ACTIVIDAD);

    if (tokenGuardado && usuarioGuardado) {
      // Verificar si la sesión ha expirado (6 horas sin actividad)
      if (ultimaActividad) {
        const tiempoInactivo = Date.now() - parseInt(ultimaActividad, 10);
        if (tiempoInactivo > EXPIRACION_SESION_MS) {
          this.limpiarAlmacenamiento();
          return;
        }
      }

      try {
        const usuario = JSON.parse(usuarioGuardado) as Usuario;
        this._usuario.set(usuario);
        this._token.set(tokenGuardado);
        this.actualizarUltimaActividad();
      } catch {
        this.limpiarAlmacenamiento();
      }
    }
  }

  private guardarEnAlmacenamiento(usuario: Usuario, token: string): void {
    if (!this.esBrowser()) return;

    localStorage.setItem(CLAVE_TOKEN, token);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
    this.actualizarUltimaActividad();
  }

  private actualizarUltimaActividad(): void {
    if (!this.esBrowser()) return;
    localStorage.setItem(CLAVE_ULTIMA_ACTIVIDAD, Date.now().toString());
  }

  private limpiarAlmacenamiento(): void {
    if (!this.esBrowser()) return;

    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_USUARIO);
    localStorage.removeItem(CLAVE_ULTIMA_ACTIVIDAD);
  }

  // ----------------------------------------
  // Recordar credenciales
  // ----------------------------------------
  guardarCredenciales(identifier: string, password: string): void {
    if (!this.esBrowser()) return;
    const credenciales = btoa(JSON.stringify({ identifier, password }));
    localStorage.setItem(CLAVE_CREDENCIALES, credenciales);
  }

  obtenerCredencialesGuardadas(): { identifier: string; password: string } | null {
    if (!this.esBrowser()) return null;
    const credenciales = localStorage.getItem(CLAVE_CREDENCIALES);
    if (!credenciales) return null;
    try {
      return JSON.parse(atob(credenciales));
    } catch {
      return null;
    }
  }

  eliminarCredencialesGuardadas(): void {
    if (!this.esBrowser()) return;
    localStorage.removeItem(CLAVE_CREDENCIALES);
  }

  tieneCredencialesGuardadas(): boolean {
    if (!this.esBrowser()) return false;
    return localStorage.getItem(CLAVE_CREDENCIALES) !== null;
  }

  // ----------------------------------------
  // Actualizar perfil
  // ----------------------------------------
  actualizarPerfil(datos: { nombreUsuario?: string; email?: string; ciudad?: string; avatar?: string }): Observable<boolean> {
    const usuarioActual = this._usuario();
    if (!usuarioActual) {
      return of(false);
    }

    this._cargando.set(true);
    this._error.set(null);

    return this.http.put<Usuario>(`/api/usuarios/${usuarioActual.id}`, datos).pipe(
      tap((usuarioActualizado) => {
        const nuevoUsuario: Usuario = {
          ...usuarioActual,
          ...usuarioActualizado,
        };
        this._usuario.set(nuevoUsuario);
        this.guardarEnAlmacenamiento(nuevoUsuario, this._token()!);
        this._cargando.set(false);
      }),
      map(() => true),
      catchError((error) => {
        this._error.set(error.mensaje || 'Error al actualizar el perfil');
        this._cargando.set(false);
        return of(false);
      })
    );
  }

  // ----------------------------------------
  // Actualizar avatar
  // ----------------------------------------
  actualizarAvatar(avatarBase64: string): void {
    const usuarioActual = this._usuario();
    if (!usuarioActual) return;

    const nuevoUsuario: Usuario = {
      ...usuarioActual,
      avatar: avatarBase64,
    };
    this._usuario.set(nuevoUsuario);
    this.guardarEnAlmacenamiento(nuevoUsuario, this._token()!);
  }

  // ----------------------------------------
  // Cambiar contraseña
  // ----------------------------------------
  cambiarContrasenia(contraseniaActual: string, contraseniaNueva: string): Observable<boolean> {
    const usuarioActual = this._usuario();
    if (!usuarioActual) {
      return of(false);
    }

    this._cargando.set(true);
    this._error.set(null);

    return this.http.put<void>(`/api/usuarios/${usuarioActual.id}/password`, {
      contraseniaActual,
      contraseniaNueva,
    }).pipe(
      tap(() => {
        this._cargando.set(false);
      }),
      map(() => true),
      catchError((error) => {
        this._error.set(error.mensaje || 'Contraseña actual incorrecta');
        this._cargando.set(false);
        return of(false);
      })
    );
  }

  // ----------------------------------------
  // Eliminar cuenta
  // ----------------------------------------
  eliminarCuenta(): Observable<boolean> {
    const usuarioActual = this._usuario();
    if (!usuarioActual) {
      return of(false);
    }

    this._cargando.set(true);
    this._error.set(null);

    return this.http.delete<void>(`/api/usuarios/${usuarioActual.id}`).pipe(
      tap(() => {
        this._cargando.set(false);
        this.cerrarSesion();
      }),
      map(() => true),
      catchError((error) => {
        this._error.set(error.mensaje || 'Error al eliminar la cuenta');
        this._cargando.set(false);
        return of(false);
      })
    );
  }

  private esBrowser(): boolean {
    return isPlatformBrowser(this.plataformaId);
  }
}
