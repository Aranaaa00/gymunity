import { Component, output, inject, OutputEmitterRef, signal, WritableSignal, computed, Signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CampoFormulario } from '../campo-formulario/campo-formulario';
import { Boton } from '../boton/boton';
import { passwordFuerte, coincidenCampos, MENSAJES_VALIDACION } from '../../../servicios/validadores';
import { ValidadoresAsincronos, MENSAJES_VALIDACION_ASINCRONA } from '../../../servicios/validadores-asincronos';
import { calcularFuerzaPassword, ResultadoFuerza } from '../../../servicios/fuerza-password';

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

const PATRON_USERNAME = /^[a-zA-Z0-9_]+$/;

const MENSAJES_ERROR: Readonly<Record<CampoRegistro, Record<string, string>>> = {
  username: {
    required: 'El nombre de usuario es obligatorio',
    minlength: `Mínimo ${LONGITUD_MINIMA_USERNAME} caracteres`,
    maxlength: `Máximo ${LONGITUD_MAXIMA_USERNAME} caracteres`,
    pattern: 'Solo letras, números y guión bajo',
    usernameNoDisponible: MENSAJES_VALIDACION_ASINCRONA.usernameNoDisponible,
  },
  fullName: {
    required: 'El nombre completo es obligatorio',
    minlength: `Mínimo ${LONGITUD_MINIMA_FULLNAME} caracteres`,
    maxlength: `Máximo ${LONGITUD_MAXIMA_FULLNAME} caracteres`,
  },
  email: {
    required: 'El email es obligatorio',
    email: 'Introduce un email válido',
    emailNoDisponible: MENSAJES_VALIDACION_ASINCRONA.emailNoDisponible,
  },
  password: {
    required: 'La contraseña es obligatoria',
    passwordFuerte: MENSAJES_VALIDACION.passwordFuerte,
  },
  password2: {
    required: 'Confirma tu contraseña',
    passwordMismatch: MENSAJES_VALIDACION.passwordMismatch,
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
  // Estado
  // ----------------------------------------
  readonly validandoEmail: WritableSignal<boolean> = signal(false);
  readonly validandoUsername: WritableSignal<boolean> = signal(false);

  // ----------------------------------------
  // Computed
  // ----------------------------------------
  readonly fuerzaPassword: Signal<ResultadoFuerza> = computed(() => {
    const password = this.passwordControl?.value ?? '';
    return calcularFuerzaPassword(password);
  });

  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly formBuilder = inject(FormBuilder);
  private readonly validadoresAsincronos = inject(ValidadoresAsincronos);

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
        [this.validadoresAsincronos.usernameUnico()],
      ],
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(LONGITUD_MINIMA_FULLNAME),
          Validators.maxLength(LONGITUD_MAXIMA_FULLNAME),
        ],
      ],
      email: [
        '', 
        [Validators.required, Validators.email],
        [this.validadoresAsincronos.emailUnico()],
      ],
      password: [
        '', 
        [Validators.required, passwordFuerte()],
      ],
      password2: ['', [Validators.required]],
    },
    { validators: coincidenCampos('password', 'password2') }
  );

  // ----------------------------------------
  // Lifecycle
  // ----------------------------------------
  constructor() {
    this.configurarObservablesValidacion();
  }

  // ----------------------------------------
  // Configuración
  // ----------------------------------------
  private configurarObservablesValidacion(): void {
    const emailControl = this.registroForm.get('email');
    const usernameControl = this.registroForm.get('username');

    emailControl?.statusChanges.subscribe((status) => {
      this.validandoEmail.set(status === 'PENDING');
    });

    usernameControl?.statusChanges.subscribe((status) => {
      this.validandoUsername.set(status === 'PENDING');
    });
  }

  // ----------------------------------------
  // Getters de controles
  // ----------------------------------------
  get usernameControl(): AbstractControl | null {
    return this.registroForm.get('username');
  }

  get fullNameControl(): AbstractControl | null {
    return this.registroForm.get('fullName');
  }

  get emailControl(): AbstractControl | null {
    return this.registroForm.get('email');
  }

  get passwordControl(): AbstractControl | null {
    return this.registroForm.get('password');
  }

  get password2Control(): AbstractControl | null {
    return this.registroForm.get('password2');
  }

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  getErrorMessage(campo: CampoRegistro): string {
    const control = this.registroForm.get(campo);
    const tieneErrores = control?.touched && control?.errors;
    
    if (!tieneErrores) return '';

    const mensajesCampo = MENSAJES_ERROR[campo];
    const tipoError = Object.keys(control.errors)[0];
    const mensaje = mensajesCampo[tipoError] ?? '';

    return mensaje;
  }

  getMensajeExito(campo: 'email' | 'username'): string {
    const control = this.registroForm.get(campo);
    const esValido = control?.touched && !control?.invalid && !control?.pending;
    
    if (!esValido) return '';
    
    const mensaje = campo === 'email' 
      ? '✓ Email disponible' 
      : '✓ Nombre de usuario disponible';

    return mensaje;
  }

  estaValidando(campo: 'email' | 'username'): boolean {
    return campo === 'email' ? this.validandoEmail() : this.validandoUsername();
  }

  onSubmit(): void {
    this.registroForm.markAllAsTouched();
    
    const esInvalido = this.registroForm.invalid;
    
    if (esInvalido) return;

    const { username, fullName, email, password } = this.registroForm.value;
    this.enviar.emit({ username, fullName, email, password });
  }
}
