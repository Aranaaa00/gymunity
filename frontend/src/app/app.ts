import { Component, inject } from '@angular/core';
import { Header } from './layout/header/header';
import { Main } from './layout/main/main';
import { Footer } from './layout/footer/footer';
import { Breadcrumbs } from './componentes/compartidos/breadcrumbs/breadcrumbs';
import { VentanaEmergente } from './componentes/compartidos/ventana-emergente/ventana-emergente';
import { FormularioLogin, DatosLogin } from './componentes/compartidos/formulario-login/formulario-login';
import { FormularioRegistro, DatosRegistro } from './componentes/compartidos/formulario-registro/formulario-registro';
import { ModalService } from './servicios/modal';
import { AuthService } from './servicios/auth';
import { CargaService } from './servicios/carga';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, Main, Footer, Breadcrumbs, VentanaEmergente, FormularioLogin, FormularioRegistro],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly modalService = inject(ModalService);
  private readonly authService = inject(AuthService);
  private readonly cargaService = inject(CargaService);

  // ----------------------------------------
  // Propiedades públicas
  // ----------------------------------------
  readonly modal = this.modalService;

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
