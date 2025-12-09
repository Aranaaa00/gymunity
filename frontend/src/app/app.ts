import { Component, inject } from '@angular/core';
import { Header } from './layout/header/header';
import { Main } from './layout/main/main';
import { Footer } from './layout/footer/footer';
import { VentanaEmergente } from './componentes/compartidos/ventana-emergente/ventana-emergente';
import { FormularioLogin } from './componentes/compartidos/formulario-login/formulario-login';
import { FormularioRegistro } from './componentes/compartidos/formulario-registro/formulario-registro';
import { ModalService } from './servicios/modal';

@Component({
  selector: 'app-root',
  imports: [Header, Main, Footer, VentanaEmergente, FormularioLogin, FormularioRegistro],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  modal = inject(ModalService);

  onLogin(datos: { email: string; password: string }): void {
    console.log('Login:', datos);
    this.modal.cerrar();
  }

  onRegistro(datos: { email: string; password: string }): void {
    console.log('Registro:', datos);
    this.modal.cerrar();
  }
}
