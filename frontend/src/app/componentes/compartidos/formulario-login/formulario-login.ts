import { Component, output, inject, OutputEmitterRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CampoFormulario } from '../campo-formulario/campo-formulario';
import { Boton } from '../boton/boton';

// ============================================
// TIPOS
// ============================================

export interface DatosLogin {
  readonly identifier: string;
  readonly password: string;
}

type CampoLogin = 'identifier' | 'password';

// ============================================
// CONSTANTES
// ============================================

const LONGITUD_MINIMA_IDENTIFIER = 3;
const LONGITUD_MINIMA_PASSWORD = 1;

const MENSAJES_ERROR: Readonly<Record<CampoLogin, Record<string, string>>> = {
  identifier: {
    required: 'Este campo es obligatorio',
    minlength: `Mínimo ${LONGITUD_MINIMA_IDENTIFIER} caracteres`,
  },
  password: {
    required: 'La contraseña es obligatoria',
  },
} as const;

// ============================================
// COMPONENTE
// ============================================

@Component({
  selector: 'app-formulario-login',
  standalone: true,
  imports: [ReactiveFormsModule, CampoFormulario, Boton],
  templateUrl: './formulario-login.html',
  styleUrl: './formulario-login.scss',
})
export class FormularioLogin {
  // ----------------------------------------
  // Outputs
  // ----------------------------------------
  readonly enviar: OutputEmitterRef<DatosLogin> = output<DatosLogin>();
  readonly irRegistro: OutputEmitterRef<void> = output<void>();
  readonly cerrar: OutputEmitterRef<void> = output<void>();

  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly formBuilder = inject(FormBuilder);

  // ----------------------------------------
  // Formulario
  // ----------------------------------------
  readonly loginForm: FormGroup = this.formBuilder.group({
    identifier: ['', [Validators.required, Validators.minLength(LONGITUD_MINIMA_IDENTIFIER)]],
    password: ['', [Validators.required, Validators.minLength(LONGITUD_MINIMA_PASSWORD)]],
  });

  // ----------------------------------------
  // Getters de controles
  // ----------------------------------------
  get identifierControl(): AbstractControl | null {
    const control = this.loginForm.get('identifier');

    return control;
  }

  get passwordControl(): AbstractControl | null {
    const control = this.loginForm.get('password');

    return control;
  }

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  getErrorMessage(campo: CampoLogin): string {
    const control = this.loginForm.get(campo);
    
    const noMostrarError = !control?.touched || !control?.errors;
    if (noMostrarError) {
      return '';
    }

    const mensajesCampo = MENSAJES_ERROR[campo];
    const tipoError = Object.keys(control.errors)[0];
    const mensaje = mensajesCampo[tipoError];

    return mensaje ?? '';
  }

  onSubmit(): void {
    this.loginForm.markAllAsTouched();

    const formularioInvalido = this.loginForm.invalid;
    if (formularioInvalido) {
      return;
    }

    const datos: DatosLogin = this.loginForm.value;
    this.enviar.emit(datos);
  }
}
