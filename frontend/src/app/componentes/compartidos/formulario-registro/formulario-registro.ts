import { Component, EventEmitter, Output } from '@angular/core';
import { CampoFormulario } from '../campo-formulario/campo-formulario';
import { Boton } from '../boton/boton';

@Component({
  selector: 'app-formulario-registro',
  imports: [CampoFormulario, Boton],
  templateUrl: './formulario-registro.html',
  styleUrl: './formulario-registro.scss',
})
export class FormularioRegistro {
  @Output() enviar = new EventEmitter<{ email: string; password: string }>();
  @Output() irLogin = new EventEmitter<void>();
  @Output() cerrar = new EventEmitter<void>();

  errores = { email: '', password: '', password2: '' };
  private passwordValue = '';

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
    this.passwordValue = valor;
    if (!valor) {
      this.errores.password = 'La contraseña es obligatoria';
    } else if (valor.length < 6) {
      this.errores.password = 'Mínimo 6 caracteres';
    } else {
      this.errores.password = '';
    }
  }

  validarPassword2(valor: string): void {
    if (valor !== this.passwordValue) {
      this.errores.password2 = 'Las contraseñas no coinciden';
    } else {
      this.errores.password2 = '';
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const password2 = formData.get('password2') as string;
    
    this.validarEmail(email);
    this.validarPassword(password);
    this.validarPassword2(password2);
    
    if (!this.errores.email && !this.errores.password && !this.errores.password2) {
      this.enviar.emit({ email, password });
    }
  }
}
