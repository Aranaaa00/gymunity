import { Component, inject } from '@angular/core';
import { Header } from './layout/header/header';
import { Main } from './layout/main/main';
import { Footer } from './layout/footer/footer';
import { VentanaEmergente } from './componentes/compartidos/ventana-emergente/ventana-emergente';
import { FormularioLogin, DatosLogin } from './componentes/compartidos/formulario-login/formulario-login';
import { FormularioRegistro, DatosRegistro } from './componentes/compartidos/formulario-registro/formulario-registro';
import { ModalService } from './servicios/modal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, Main, Footer, VentanaEmergente, FormularioLogin, FormularioRegistro],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly modalService = inject(ModalService);

  // ----------------------------------------
  // Propiedades públicas
  // ----------------------------------------
  readonly modal = this.modalService;

  // ----------------------------------------
  // Event Handlers
  // ----------------------------------------
  onLogin(datos: DatosLogin): void {
    console.log('Login:', datos);
    this.modalService.cerrar();
  }

  onRegistro(datos: DatosRegistro): void {
    console.log('Registro:', datos);
    this.modalService.cerrar();
  }
}
