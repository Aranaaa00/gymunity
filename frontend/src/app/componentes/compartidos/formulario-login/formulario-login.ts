import { Component, output, inject, OutputEmitterRef, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CampoFormulario } from '../campo-formulario/campo-formulario';
import { Boton } from '../boton/boton';
import { AuthService } from '../../../servicios/auth';

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

const LONGITUD_MINIMA_PASSWORD = 1;

const MENSAJES_ERROR: Readonly<Record<CampoLogin, Record<string, string>>> = {
  identifier: {
    required: 'El email o nombre de usuario es obligatorio',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioLogin implements OnInit {
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
  readonly recordarUsuario = signal<boolean>(false);

  // ----------------------------------------
  // Controles tipados
  // ----------------------------------------
  readonly identifierControl = new FormControl('', [Validators.required]);
  readonly passwordControl = new FormControl('', [Validators.required, Validators.minLength(LONGITUD_MINIMA_PASSWORD)]);

  // ----------------------------------------
  // Formulario
  // ----------------------------------------
  readonly loginForm: FormGroup = this.formBuilder.group({
    identifier: this.identifierControl,
    password: this.passwordControl,
  });

  // ----------------------------------------
  // Lifecycle
  // ----------------------------------------
  ngOnInit(): void {
    const tieneCredenciales = this.authService.tieneCredencialesGuardadas();
    
    // Auto-rellenar credenciales guardadas automáticamente
    if (tieneCredenciales) {
      this.autoRellenarCredenciales();
    }
  }
  
  // ----------------------------------------
  // Métodos privados
  // ----------------------------------------
  private autoRellenarCredenciales(): void {
    const credenciales = this.authService.obtenerCredencialesGuardadas();
    if (!credenciales) {
      return;
    }
    
    this.identifierControl.setValue(credenciales.identifier);
    this.passwordControl.setValue(credenciales.password);
    this.recordarUsuario.set(true);
  }

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  toggleRecordar(): void {
    this.recordarUsuario.update(v => !v);
  }

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
    const { identifier, password } = this.loginForm.value;

    this.authService.login(identifier, password).subscribe({
      next: (exito) => {
        this.cargando.set(false);
        if (exito) {
          // Guardar o eliminar credenciales según la opción
          if (this.recordarUsuario()) {
            this.authService.guardarCredenciales(identifier, password);
          } else {
            this.authService.eliminarCredencialesGuardadas();
          }
          this.cerrar.emit();
          this.enviar.emit({ identifier, password });
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
