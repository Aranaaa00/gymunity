import { Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Header } from './layout/header/header';
import { Main } from './layout/main/main';
import { Footer } from './layout/footer/footer';
import { Breadcrumbs } from './componentes/compartidos/breadcrumbs/breadcrumbs';
import { VentanaEmergente } from './componentes/compartidos/ventana-emergente/ventana-emergente';
import { FormularioLogin, DatosLogin } from './componentes/compartidos/formulario-login/formulario-login';
import { FormularioRegistro, DatosRegistro } from './componentes/compartidos/formulario-registro/formulario-registro';
import { Toast } from './componentes/compartidos/toast/toast';
import { CargaGlobal } from './componentes/compartidos/carga-global/carga-global';
import { ModalService } from './servicios/modal';
import { AuthService } from './servicios/auth';
import { CargaService } from './servicios/carga';
import { TituloPagina } from './servicios/titulo-pagina';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, Main, Footer, Breadcrumbs, VentanaEmergente, FormularioLogin, FormularioRegistro, Toast, CargaGlobal],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly modalService = inject(ModalService);
  private readonly authService = inject(AuthService);
  private readonly cargaService = inject(CargaService);
  private readonly tituloPagina = inject(TituloPagina);

  // ----------------------------------------
  // Propiedades públicas
  // ----------------------------------------
  readonly modal = this.modalService;

  // ----------------------------------------
  // Lifecycle
  // ----------------------------------------
  ngOnInit(): void {
    this.tituloPagina.inicializar();
  }

  // ----------------------------------------
  // Event Handlers
  // ----------------------------------------
  onLogin(datos: DatosLogin): void {
    // El formulario de login ya maneja la autenticación internamente
    this.modalService.cerrar();
  }

  onRegistro(datos: DatosRegistro): void {
    this.cargaService.iniciar();
    
    this.authService.registrar({
      nombreUsuario: datos.username,
      email: datos.email,
      contrasenia: datos.password,
      ciudad: '',
    }).subscribe({
      next: (exito) => {
        this.cargaService.finalizar();
        if (exito) {
          this.modalService.cerrar();
        }
      },
      error: () => {
        this.cargaService.finalizar();
      },
    });
  }
}
