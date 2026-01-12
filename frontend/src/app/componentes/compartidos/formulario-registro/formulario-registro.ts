import { Component, output, inject, OutputEmitterRef, signal, WritableSignal, computed, Signal, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CampoFormulario } from '../campo-formulario/campo-formulario';
import { Boton } from '../boton/boton';
import { passwordFuerte, coincidenCampos, MENSAJES_VALIDACION } from '../../../servicios/validadores';
import { ValidadoresAsincronos, MENSAJES_VALIDACION_ASINCRONA } from '../../../servicios/validadores-asincronos';
import { calcularFuerzaPassword, ResultadoFuerza } from '../../../servicios/fuerza-password';
import { AuthService } from '../../../servicios/auth';

// ============================================
// TIPOS
// ============================================

export interface DatosRegistro {
  readonly username: string;
  readonly fullName: string;
  readonly email: string;
  readonly password: string;
}

type CampoRegistro = 'username' | 'fullName' | 'email' | 'ciudad' | 'password' | 'password2';

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
  ciudad: {
    required: 'La ciudad es obligatoria para mostrarte gimnasios cercanos',
    minlength: 'Mínimo 2 caracteres',
    maxlength: 'Máximo 100 caracteres',
    ciudadNoExiste: MENSAJES_VALIDACION_ASINCRONA.ciudadNoExiste,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  readonly validandoCiudad: WritableSignal<boolean> = signal(false);
  private readonly _passwordValue: WritableSignal<string> = signal('');

  // ----------------------------------------
  // Computed
  // ----------------------------------------
  readonly fuerzaPassword: Signal<ResultadoFuerza> = computed(() => {
    return calcularFuerzaPassword(this._passwordValue());
  });

  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly formBuilder = inject(FormBuilder);
  private readonly validadoresAsincronos = inject(ValidadoresAsincronos);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  // ----------------------------------------
  // Estado
  // ----------------------------------------
  readonly cargando = signal<boolean>(false);
  readonly errorServidor = signal<string | null>(null);

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
      ciudad: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
        [this.validadoresAsincronos.ciudadExiste()],
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
    const ciudadControl = this.registroForm.get('ciudad');
    const passwordControl = this.registroForm.get('password');

    emailControl?.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((status) => {
      this.validandoEmail.set(status === 'PENDING');
    });

    usernameControl?.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((status) => {
      this.validandoUsername.set(status === 'PENDING');
    });

    ciudadControl?.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((status) => {
      this.validandoCiudad.set(status === 'PENDING');
    });

    passwordControl?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value: string) => {
      this._passwordValue.set(value ?? '');
    });
  }

  // ----------------------------------------
  // Getters de controles tipados
  // ----------------------------------------
  get usernameControl(): FormControl {
    return this.registroForm.get('username') as FormControl;
  }

  get fullNameControl(): FormControl {
    return this.registroForm.get('fullName') as FormControl;
  }

  get emailControl(): FormControl {
    return this.registroForm.get('email') as FormControl;
  }

  get ciudadControl(): FormControl {
    return this.registroForm.get('ciudad') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.registroForm.get('password') as FormControl;
  }

  get password2Control(): FormControl {
    return this.registroForm.get('password2') as FormControl;
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

  getMensajeExito(campo: 'email' | 'username' | 'ciudad'): string {
    const control = this.registroForm.get(campo);
    const esValido = control?.touched && !control?.invalid && !control?.pending;
    
    if (!esValido) return '';
    
    const mensajes: Record<'email' | 'username' | 'ciudad', string> = {
      email: '✓ Email disponible',
      username: '✓ Nombre de usuario disponible',
      ciudad: '✓ Ciudad válida',
    };

    return mensajes[campo];
  }

  estaValidando(campo: 'email' | 'username' | 'ciudad'): boolean {
    if (campo === 'email') return this.validandoEmail();
    if (campo === 'username') return this.validandoUsername();
    return this.validandoCiudad();
  }

  onSubmit(): void {
    this.registroForm.markAllAsTouched();
    this.errorServidor.set(null);
    
    const esInvalido = this.registroForm.invalid;
    
    if (esInvalido) return;

    this.cargando.set(true);
    const { username, fullName, email, ciudad, password } = this.registroForm.value;
    
    this.authService.registrar({
      nombreUsuario: username,
      email,
      contrasenia: password,
      ciudad,
    }).subscribe({
      next: (exito) => {
        this.cargando.set(false);
        if (exito) {
          this.cerrar.emit();
          this.enviar.emit({ username, fullName, email, password });
        } else {
          this.errorServidor.set(this.authService.error() || 'Error al registrar');
        }
      },
      error: () => {
        this.cargando.set(false);
        this.errorServidor.set('Error de conexión con el servidor');
      },
    });
  }
}
