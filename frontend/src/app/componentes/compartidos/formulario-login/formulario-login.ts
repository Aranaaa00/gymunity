import { Component, EventEmitter, Output } from '@angular/core';
import { CampoFormulario } from '../campo-formulario/campo-formulario';
import { Boton } from '../boton/boton';

@Component({
  selector: 'app-formulario-login',
  imports: [CampoFormulario, Boton],
  templateUrl: './formulario-login.html',
  styleUrl: './formulario-login.scss',
})
export class FormularioLogin {
  @Output() enviar = new EventEmitter<{ email: string; password: string }>();
  @Output() irRegistro = new EventEmitter<void>();
  @Output() cerrar = new EventEmitter<void>();

  errores = { email: '', password: '' };

  validarEmail(valor: string): void {
    if (!valor) {
      this.errores.email = 'El email es obligatorio';
    } else if (!valor.includes('@')) {
      this.errores.email = 'Email no válido';
    } else {
      this.errores.email = '';
    }
  }

  validarPassword(valor: string): void {
    if (!valor) {
      this.errores.password = 'La contraseña es obligatoria';
    } else {
      this.errores.password = '';
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    this.validarEmail(email);
    this.validarPassword(password);
    
    if (!this.errores.email && !this.errores.password) {
      this.enviar.emit({ email, password });
    }
  }
}
