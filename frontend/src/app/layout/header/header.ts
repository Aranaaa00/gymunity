import {
  Component,
  output,
  HostListener,
  signal,
  inject,
  PLATFORM_ID,
  ViewChild,
  ElementRef,
  OutputEmitterRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Boton } from '../../componentes/compartidos/boton/boton';
import { Buscador } from '../../componentes/compartidos/buscador/buscador';
import { BotonTema } from '../../componentes/compartidos/boton-tema/boton-tema';
import { Icono } from '../../componentes/compartidos/icono/icono';
import { MenuUsuario } from '../../componentes/compartidos/menu-usuario/menu-usuario';
import { AuthService } from '../../servicios/auth';

// ============================================
// CONSTANTES
// ============================================

const OVERFLOW_HIDDEN = 'hidden';
const OVERFLOW_NORMAL = '';

// ============================================
// COMPONENTE HEADER
// ============================================

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, Boton, Buscador, BotonTema, Icono, MenuUsuario],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  // ----------------------------------------
  // Outputs
  // ----------------------------------------
  readonly abrirLogin: OutputEmitterRef<void> = output<void>();
  readonly abrirRegistro: OutputEmitterRef<void> = output<void>();

  // ----------------------------------------
  // ViewChild
  // ----------------------------------------
  @ViewChild('menuNav') menuNav!: ElementRef<HTMLElement>;
  @ViewChild('botonHamburguesa') botonHamburguesa!: ElementRef<HTMLButtonElement>;

  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly documento = inject(DOCUMENT);
  private readonly esBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // ----------------------------------------
  // Estado
  // ----------------------------------------
  readonly menuAbierto = signal<boolean>(false);
  readonly usuarioAutenticado = this.authService.estaAutenticado;

  // ----------------------------------------
  // Host Listeners
  // ----------------------------------------
  @HostListener('document:keydown.escape')
  alPresionarEscape(): void {
    const menuCerrado = !this.menuAbierto();

    if (menuCerrado) {
      return;
    }

    this.cerrarMenu();
    this.enfocarBotonHamburguesa();
  }

  @HostListener('document:click', ['$event'])
  alClickDocumento(evento: MouseEvent): void {
    const menuCerrado = !this.menuAbierto();

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

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  alternarMenu(): void {
    this.menuAbierto.update((abierto: boolean): boolean => !abierto);
    this.actualizarOverflowBody();
  }

  cerrarMenu(): void {
    this.menuAbierto.set(false);
    this.restaurarOverflowBody();
  }

  alBuscar(termino: string): void {
    this.cerrarMenu();
    
    if (!termino.trim()) {
      this.router.navigate(['/busqueda']);
      return;
    }
    
    this.router.navigate(['/busqueda'], {
      queryParams: { q: termino.trim() }
    });
  }

  ejecutarYCerrar(accion: () => void): void {
    accion();
    this.cerrarMenu();
  }

  // ----------------------------------------
  // Métodos privados
  // ----------------------------------------
  private esClickDentroMenu(elemento: HTMLElement): boolean {
    const dentroMenu = this.menuNav?.nativeElement?.contains(elemento) ?? false;
    const enBoton =
      this.botonHamburguesa?.nativeElement?.contains(elemento) ?? false;
    const clickDentro = dentroMenu || enBoton;

    return clickDentro;
  }

  private enfocarBotonHamburguesa(): void {
    this.botonHamburguesa?.nativeElement?.focus();
  }

  private actualizarOverflowBody(): void {
    const noEsBrowser = !this.esBrowser;

    if (noEsBrowser) {
      return;
    }

    const menuEstaAbierto = this.menuAbierto();
    const overflow = menuEstaAbierto ? OVERFLOW_HIDDEN : OVERFLOW_NORMAL;
    this.documento.body.style.overflow = overflow;
  }

  private restaurarOverflowBody(): void {
    const noEsBrowser = !this.esBrowser;

    if (noEsBrowser) {
      return;
    }

    this.documento.body.style.overflow = OVERFLOW_NORMAL;
  }
}
