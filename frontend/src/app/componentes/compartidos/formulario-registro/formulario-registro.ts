import { Component, output, inject, OutputEmitterRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CampoFormulario } from '../campo-formulario/campo-formulario';
import { Boton } from '../boton/boton';

// ============================================
// TIPOS
// ============================================

export interface DatosRegistro {
  readonly username: string;
  readonly fullName: string;
  readonly email: string;
  readonly password: string;
}

type CampoRegistro = 'username' | 'fullName' | 'email' | 'password' | 'password2';

// ============================================
// CONSTANTES
// ============================================

const LONGITUD_MINIMA_USERNAME = 3;
const LONGITUD_MAXIMA_USERNAME = 20;
const LONGITUD_MINIMA_FULLNAME = 2;
const LONGITUD_MAXIMA_FULLNAME = 50;
const LONGITUD_MINIMA_PASSWORD = 6;

const PATRON_USERNAME = /^[a-zA-Z0-9_]+$/;

const MENSAJES_ERROR: Readonly<Record<CampoRegistro, Record<string, string>>> = {
  username: {
    required: 'El nombre de usuario es obligatorio',
    minlength: `Mínimo ${LONGITUD_MINIMA_USERNAME} caracteres`,
    maxlength: `Máximo ${LONGITUD_MAXIMA_USERNAME} caracteres`,
    pattern: 'Solo letras, números y guión bajo',
  },
  fullName: {
    required: 'El nombre completo es obligatorio',
    minlength: `Mínimo ${LONGITUD_MINIMA_FULLNAME} caracteres`,
    maxlength: `Máximo ${LONGITUD_MAXIMA_FULLNAME} caracteres`,
  },
  email: {
    required: 'El email es obligatorio',
    email: 'Introduce un email válido',
  },
  password: {
    required: 'La contraseña es obligatoria',
    minlength: `Mínimo ${LONGITUD_MINIMA_PASSWORD} caracteres`,
  },
  password2: {
    required: 'Confirma tu contraseña',
    passwordMismatch: 'Las contraseñas no coinciden',
  },
} as const;

// ============================================
// COMPONENTE
// ============================================

@Component({
  selector: 'app-formulario-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CampoFormulario, Boton],
  templateUrl: './formulario-registro.html',
  styleUrl: './formulario-registro.scss',
})
export class FormularioRegistro {
  // ----------------------------------------
  // Outputs
  // ----------------------------------------
  readonly enviar: OutputEmitterRef<DatosRegistro> = output<DatosRegistro>();
  readonly irLogin: OutputEmitterRef<void> = output<void>();
  readonly cerrar: OutputEmitterRef<void> = output<void>();

  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly formBuilder = inject(FormBuilder);

  // ----------------------------------------
  // Formulario
  // ----------------------------------------
  readonly registroForm: FormGroup = this.formBuilder.group(
    {
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(LONGITUD_MINIMA_USERNAME),
          Validators.maxLength(LONGITUD_MAXIMA_USERNAME),
          Validators.pattern(PATRON_USERNAME),
        ],
      ],
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(LONGITUD_MINIMA_FULLNAME),
          Validators.maxLength(LONGITUD_MAXIMA_FULLNAME),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(LONGITUD_MINIMA_PASSWORD)]],
      password2: ['', [Validators.required]],
    },
    { validators: this.validarCoincidenciaPasswords }
  );

  // ----------------------------------------
  // Getters de controles
  // ----------------------------------------
  get usernameControl(): AbstractControl | null {
    const control = this.registroForm.get('username');

    return control;
  }

  get fullNameControl(): AbstractControl | null {
    const control = this.registroForm.get('fullName');

    return control;
  }

  get emailControl(): AbstractControl | null {
    const control = this.registroForm.get('email');

    return control;
  }

  get passwordControl(): AbstractControl | null {
    const control = this.registroForm.get('password');

    return control;
  }

  get password2Control(): AbstractControl | null {
    const control = this.registroForm.get('password2');

    return control;
  }

  // ----------------------------------------
  // Validadores personalizados
  // ----------------------------------------
  private validarCoincidenciaPasswords(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const password2 = control.get('password2');

    const noHayControles = !password || !password2;
    if (noHayControles) {
      return null;
    }

    const noCoinciden = password.value !== password2.value;
    if (!noCoinciden) {
      return null;
    }

    password2.setErrors({ passwordMismatch: true });

    return { passwordMismatch: true };
  }

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  getErrorMessage(campo: CampoRegistro): string {
    const control = this.registroForm.get(campo);

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
    this.registroForm.markAllAsTouched();

    const formularioInvalido = this.registroForm.invalid;
    if (formularioInvalido) {
      return;
    }

    const { username, fullName, email, password } = this.registroForm.value;
    const datos: DatosRegistro = { username, fullName, email, password };

    this.enviar.emit(datos);
  }
}
