import { Component, signal, inject, HostListener, ViewChild, ElementRef, WritableSignal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Icono } from '../icono/icono';
import { AuthService } from '../../../servicios/auth';

// ============================================
// COMPONENTE MENU USUARIO
// ============================================

@Component({
  selector: 'app-menu-usuario',
  standalone: true,
  imports: [Icono],
  templateUrl: './menu-usuario.html',
  styleUrl: './menu-usuario.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuUsuario {
  // ----------------------------------------
  // ViewChild
  // ----------------------------------------
  @ViewChild('menuDropdown') menuDropdown!: ElementRef<HTMLElement>;
  @ViewChild('botonToggle') botonToggle!: ElementRef<HTMLButtonElement>;

  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  // ----------------------------------------
  // Estado
  // ----------------------------------------
  readonly desplegableAbierto: WritableSignal<boolean> = signal(false);
  readonly usuario = this.authService.usuario;

  // ----------------------------------------
  // Host Listeners
  // ----------------------------------------
  @HostListener('document:click', ['$event'])
  alClickDocumento(evento: MouseEvent): void {
    const menuCerrado = !this.desplegableAbierto();

    if (menuCerrado) {
      return;
    }

    const elemento = evento.target as HTMLElement;
    const clickDentroMenu = this.esClickDentroMenu(elemento);

    if (clickDentroMenu) {
      return;
    }

    this.cerrarMenu();
  }

  @HostListener('document:keydown.escape')
  alPresionarEscape(): void {
    const menuCerrado = !this.desplegableAbierto();

    if (menuCerrado) {
      return;
    }

    this.cerrarMenu();
    this.enfocarBotonToggle();
  }

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  toggleMenu(): void {
    this.desplegableAbierto.update(abierto => !abierto);
  }

  navegarAPerfil(): void {
    this.router.navigate(['/perfil']);
    this.cerrarMenu();
  }

  navegarAConfiguracion(): void {
    this.router.navigate(['/configuracion']);
    this.cerrarMenu();
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.cerrarMenu();
    this.router.navigate(['/']);
  }

  // ----------------------------------------
  // Métodos privados
  // ----------------------------------------
  private esClickDentroMenu(elemento: HTMLElement): boolean {
    const dentroMenu = this.menuDropdown?.nativeElement?.contains(elemento) ?? false;
    const enBoton = this.botonToggle?.nativeElement?.contains(elemento) ?? false;
    return dentroMenu || enBoton;
  }

  private cerrarMenu(): void {
    this.desplegableAbierto.set(false);
  }

  private enfocarBotonToggle(): void {
    this.botonToggle?.nativeElement?.focus();
  }
}
