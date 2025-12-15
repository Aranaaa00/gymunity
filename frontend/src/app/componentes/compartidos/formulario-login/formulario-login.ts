import { Component, output, inject, OutputEmitterRef, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CampoFormulario } from '../campo-formulario/campo-formulario';
import { Boton } from '../boton/boton';
import { AuthService } from '../../../servicios/auth';

// ============================================
// TIPOS
// ============================================

export interface DatosLogin {
  readonly email: string;
  readonly password: string;
}

type CampoLogin = 'email' | 'password';

// ============================================
// CONSTANTES
// ============================================

const LONGITUD_MINIMA_PASSWORD = 1;

const MENSAJES_ERROR: Readonly<Record<CampoLogin, Record<string, string>>> = {
  email: {
    required: 'El email es obligatorio',
    email: 'El email no es válido',
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
  private readonly authService = inject(AuthService);

  // ----------------------------------------
  // Estado
  // ----------------------------------------
  readonly cargando = signal<boolean>(false);
  readonly errorServidor = signal<string | null>(null);

  // ----------------------------------------
  // Formulario
  // ----------------------------------------
  readonly loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(LONGITUD_MINIMA_PASSWORD)]],
  });

  // ----------------------------------------
  // Getters de controles
  // ----------------------------------------
  get emailControl(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  get passwordControl(): AbstractControl | null {
    return this.loginForm.get('password');
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
    this.errorServidor.set(null);

    const formularioInvalido = this.loginForm.invalid;
    if (formularioInvalido) {
      return;
    }

    this.cargando.set(true);
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (exito) => {
        this.cargando.set(false);
        if (exito) {
          this.cerrar.emit();
          this.enviar.emit({ email, password });
        } else {
          this.errorServidor.set(this.authService.error() || 'Credenciales incorrectas');
        }
      },
      error: () => {
        this.cargando.set(false);
        this.errorServidor.set('Error de conexión con el servidor');
      },
    });
  }
}
