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
  login(email: string, contrasenia: string): Observable<boolean> {
    this._cargando.set(true);
    this._error.set(null);

    const request: LoginRequest = { email, contrasenia };

    return this.http.post<AuthResponse>(`${API_URL}/login`, request).pipe(
      tap((response) => this.procesarAuthResponse(response)),
      map(() => true),
      catchError((error) => {
        this._error.set(error.mensaje || 'Error al iniciar sesión');
        this._cargando.set(false);
        return of(false);
      })
    );
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
    };

    this._usuario.set(usuario);
    this._token.set(response.token);
    this._cargando.set(false);
    this.guardarEnAlmacenamiento(usuario, response.token);
  }

  private restaurarSesion(): void {
    if (!this.esBrowser()) return;

    const tokenGuardado = localStorage.getItem(CLAVE_TOKEN);
    const usuarioGuardado = localStorage.getItem(CLAVE_USUARIO);

    if (tokenGuardado && usuarioGuardado) {
      try {
        const usuario = JSON.parse(usuarioGuardado) as Usuario;
        this._usuario.set(usuario);
        this._token.set(tokenGuardado);
      } catch {
        this.limpiarAlmacenamiento();
      }
    }
  }

  private guardarEnAlmacenamiento(usuario: Usuario, token: string): void {
    if (!this.esBrowser()) return;

    localStorage.setItem(CLAVE_TOKEN, token);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
  }

  private limpiarAlmacenamiento(): void {
    if (!this.esBrowser()) return;

    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_USUARIO);
  }

  private esBrowser(): boolean {
    return isPlatformBrowser(this.plataformaId);
  }
}
