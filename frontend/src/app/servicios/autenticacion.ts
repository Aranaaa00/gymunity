import { Injectable, inject, signal, WritableSignal, computed, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

// ============================================
// TIPOS
// ============================================

export interface Usuario {
  readonly id: number;
  readonly username: string;
  readonly email: string;
  readonly nombre: string;
  readonly avatar?: string;
  readonly ciudad?: string;
}

interface AuthResponse {
  token: string;
  email: string;
  nombreUsuario: string;
  rol: string;
  id: number;
  ciudad?: string;
  avatar?: string;
  mensaje: string;
}

// ============================================
// CONSTANTES
// ============================================

const CLAVE_ALMACENAMIENTO = 'usuario_gymunity';
const CLAVE_TOKEN = 'token_gymunity';
const API_URL = '/api/auth';

// ============================================
// HELPERS
// ============================================

const esNavegador = (): boolean => {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
};

// ============================================
// SERVICIO DE AUTENTICACIÓN
// ============================================

@Injectable({
  providedIn: 'root',
})
export class AutenticacionService {
  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // ----------------------------------------
  // Estado
  // ----------------------------------------
  private readonly _usuario: WritableSignal<Usuario | null> = signal(null);
  private readonly _cargando: WritableSignal<boolean> = signal(false);

  // ----------------------------------------
  // Signals públicos (readonly)
  // ----------------------------------------
  readonly usuario: Signal<Usuario | null> = this._usuario.asReadonly();
  readonly cargando: Signal<boolean> = this._cargando.asReadonly();
  readonly estaAutenticado: Signal<boolean> = computed(() => this._usuario() !== null);

  // ----------------------------------------
  // Constructor
  // ----------------------------------------
  constructor() {
    this.inicializarSesion();
  }

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------

  iniciarSesion(usuario: Usuario, token?: string): void {
    this._usuario.set(usuario);
    this.guardarEnAlmacenamiento(usuario);
    if (token) {
      this.guardarToken(token);
    }
  }

  async login(identifier: string, password: string): Promise<boolean> {
    this._cargando.set(true);
    
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${API_URL}/login`, {
          email: identifier,
          contrasenia: password
        })
      );
      
      const usuario = this.mapearRespuestaAUsuario(response);
      this._usuario.set(usuario);
      this.guardarEnAlmacenamiento(usuario);
      this.guardarToken(response.token);
      this._cargando.set(false);
      return true;
    } catch (error) {
      console.error('Error en login:', error);
      this._cargando.set(false);
      return false;
    }
  }

  async registro(datos: { username: string; email: string; password: string; fullName: string }): Promise<boolean> {
    this._cargando.set(true);
    
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${API_URL}/register`, {
          nombreUsuario: datos.username,
          email: datos.email,
          contrasenia: datos.password
        })
      );
      
      const usuario = this.mapearRespuestaAUsuario(response);
      this._usuario.set(usuario);
      this.guardarEnAlmacenamiento(usuario);
      this.guardarToken(response.token);
      this._cargando.set(false);
      return true;
    } catch (error) {
      console.error('Error en registro:', error);
      this._cargando.set(false);
      return false;
    }
  }

  cerrarSesion(): void {
    this._usuario.set(null);
    this.limpiarAlmacenamiento();
    this.router.navigate(['/']);
  }

  obtenerToken(): string | null {
    if (!esNavegador()) return null;
    return localStorage.getItem(CLAVE_TOKEN);
  }

  // ----------------------------------------
  // Métodos privados
  // ----------------------------------------

  private inicializarSesion(): void {
    const usuarioAlmacenado = this.recuperarUsuarioAlmacenado();
    
    if (usuarioAlmacenado) {
      this._usuario.set(usuarioAlmacenado);
    }
  }

  private mapearRespuestaAUsuario(response: AuthResponse): Usuario {
    return {
      id: response.id,
      username: response.nombreUsuario,
      email: response.email,
      nombre: response.nombreUsuario,
      avatar: response.avatar,
      ciudad: response.ciudad
    };
  }

  private recuperarUsuarioAlmacenado(): Usuario | null {
    if (!esNavegador()) return null;
    
    const sesionGuardada = localStorage.getItem(CLAVE_ALMACENAMIENTO);
    
    if (!sesionGuardada) return null;

    try {
      return JSON.parse(sesionGuardada) as Usuario;
    } catch {
      this.limpiarAlmacenamiento();
      return null;
    }
  }

  private guardarEnAlmacenamiento(usuario: Usuario): void {
    if (!esNavegador()) return;
    
    localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(usuario));
  }

  private guardarToken(token: string): void {
    if (!esNavegador()) return;
    
    localStorage.setItem(CLAVE_TOKEN, token);
  }

  private limpiarAlmacenamiento(): void {
    if (!esNavegador()) return;
    
    localStorage.removeItem(CLAVE_ALMACENAMIENTO);
    localStorage.removeItem(CLAVE_TOKEN);
  }
}
