import { Injectable, signal, WritableSignal, computed, Signal } from '@angular/core';
import { Router } from '@angular/router';

// ============================================
// TIPOS
// ============================================

export interface Usuario {
  readonly id: number;
  readonly username: string;
  readonly email: string;
  readonly nombre: string;
  readonly avatar?: string;
}

// ============================================
// CONSTANTES
// ============================================

const CLAVE_ALMACENAMIENTO = 'usuario_gymunity';
const DELAY_AUTENTICACION = 1000;

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
  constructor(private readonly router: Router) {
    this.inicializarSesion();
  }

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------

  iniciarSesion(usuario: Usuario): void {
    this._usuario.set(usuario);
    this.guardarEnAlmacenamiento(usuario);
  }

  login(identifier: string, password: string): Promise<boolean> {
    return this.autenticar(() => this.crearUsuarioDesdeLogin(identifier));
  }

  registro(datos: { username: string; email: string; password: string; fullName: string }): Promise<boolean> {
    return this.autenticar(() => this.crearUsuarioDesdeRegistro(datos));
  }

  cerrarSesion(): void {
    this._usuario.set(null);
    this.limpiarAlmacenamiento();
    this.router.navigate(['/']);
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

  private autenticar(crearUsuario: () => Usuario): Promise<boolean> {
    this._cargando.set(true);

    return new Promise((resolve) => {
      setTimeout(() => {
        const usuario = crearUsuario();
        this._usuario.set(usuario);
        this.guardarEnAlmacenamiento(usuario);
        this._cargando.set(false);
        resolve(true);
      }, DELAY_AUTENTICACION);
    });
  }

  private crearUsuarioDesdeLogin(identifier: string): Usuario {
    return {
      id: 1,
      username: identifier,
      email: `${identifier}@gymunity.com`,
      nombre: 'Usuario Demo',
      avatar: 'assets/avatar-default.png',
    };
  }

  private crearUsuarioDesdeRegistro(datos: { username: string; email: string; fullName: string }): Usuario {
    return {
      id: Date.now(),
      username: datos.username,
      email: datos.email,
      nombre: datos.fullName,
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

  private limpiarAlmacenamiento(): void {
    if (!esNavegador()) return;
    
    localStorage.removeItem(CLAVE_ALMACENAMIENTO);
  }
}
