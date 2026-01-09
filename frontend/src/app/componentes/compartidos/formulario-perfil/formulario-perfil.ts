import { Component, input, output, inject, InputSignal, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { CampoFormulario } from '../campo-formulario/campo-formulario';
import { AreaTexto } from '../area-texto/area-texto';
import { Boton } from '../boton/boton';
import { Icono } from '../icono/icono';
import { telefonoEspanol, codigoPostalEspanol, MENSAJES_VALIDACION } from '../../../servicios/validadores';
import { ValidadoresAsincronos, MENSAJES_VALIDACION_ASINCRONA } from '../../../servicios/validadores-asincronos';

// ============================================
// TIPOS
// ============================================

export interface DatosUsuario {
  readonly nombre: string;
  readonly apellidos: string;
  readonly username: string;
  readonly email: string;
  readonly telefono: string;
  readonly codigoPostal: string;
  readonly bio: string;
  readonly redesSociales: readonly RedSocial[];
}

export interface RedSocial {
  readonly plataforma: string;
  readonly url: string;
}

type CampoPerfil = 'nombre' | 'apellidos' | 'username' | 'email' | 'telefono' | 'codigoPostal' | 'bio';

// ============================================
// CONSTANTES
// ============================================

const LONGITUD_MINIMA_NOMBRE = 2;
const LONGITUD_MAXIMA_NOMBRE = 50;
const LONGITUD_MINIMA_BIO = 0;
const LONGITUD_MAXIMA_BIO = 500;

const MENSAJES_ERROR: Readonly<Record<CampoPerfil, Record<string, string>>> = {
  nombre: {
    required: 'El nombre es obligatorio',
    minlength: `Mínimo ${LONGITUD_MINIMA_NOMBRE} caracteres`,
    maxlength: `Máximo ${LONGITUD_MAXIMA_NOMBRE} caracteres`,
  },
  apellidos: {
    required: 'Los apellidos son obligatorios',
    minlength: `Mínimo ${LONGITUD_MINIMA_NOMBRE} caracteres`,
    maxlength: `Máximo ${LONGITUD_MAXIMA_NOMBRE} caracteres`,
  },
  username: {
    required: 'El nombre de usuario es obligatorio',
    usernameNoDisponible: MENSAJES_VALIDACION_ASINCRONA.usernameNoDisponible,
  },
  email: {
    required: 'El email es obligatorio',
    email: 'Introduce un email válido',
  },
  telefono: {
    telefonoInvalido: MENSAJES_VALIDACION.telefonoInvalido,
  },
  codigoPostal: {
    codigoPostalInvalido: MENSAJES_VALIDACION.codigoPostalInvalido,
  },
  bio: {
    maxlength: `Máximo ${LONGITUD_MAXIMA_BIO} caracteres`,
  },
} as const;

const PLATAFORMAS_REDES = ['Instagram', 'Twitter', 'Facebook', 'LinkedIn', 'TikTok', 'YouTube'] as const;

// ============================================
// COMPONENTE
// ============================================

@Component({
  selector: 'app-formulario-perfil',
  standalone: true,
  imports: [ReactiveFormsModule, CampoFormulario, AreaTexto, Boton, Icono],
  templateUrl: './formulario-perfil.html',
  styleUrl: './formulario-perfil.scss',
})
export class FormularioPerfil {
  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly datosIniciales: InputSignal<DatosUsuario | null> = input<DatosUsuario | null>(null);

  // ----------------------------------------
  // Outputs
  // ----------------------------------------
  readonly guardar: OutputEmitterRef<DatosUsuario> = output<DatosUsuario>();
  readonly cancelar: OutputEmitterRef<void> = output<void>();

  // ----------------------------------------
  // Estado
  // ----------------------------------------
  readonly validandoUsername: WritableSignal<boolean> = signal(false);
  readonly plataformasDisponibles = PLATAFORMAS_REDES;

  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly formBuilder = inject(FormBuilder);
  private readonly validadoresAsincronos = inject(ValidadoresAsincronos);

  // ----------------------------------------
  // Formulario
  // ----------------------------------------
  readonly perfilForm: FormGroup = this.formBuilder.group({
    nombre: [
      '',
      [
        Validators.required,
        Validators.minLength(LONGITUD_MINIMA_NOMBRE),
        Validators.maxLength(LONGITUD_MAXIMA_NOMBRE),
      ],
    ],
    apellidos: [
      '',
      [
        Validators.required,
        Validators.minLength(LONGITUD_MINIMA_NOMBRE),
        Validators.maxLength(LONGITUD_MAXIMA_NOMBRE),
      ],
    ],
    username: [
      { value: '', disabled: false },
      [Validators.required],
      [this.validadoresAsincronos.usernameUnico()],
    ],
    email: [
      { value: '', disabled: true },
      [Validators.required, Validators.email],
    ],
    telefono: ['', [telefonoEspanol()]],
    codigoPostal: ['', [codigoPostalEspanol()]],
    bio: ['', [Validators.maxLength(LONGITUD_MAXIMA_BIO)]],
    redesSociales: this.formBuilder.array([]),
  });

  // ----------------------------------------
  // Lifecycle
  // ----------------------------------------
  constructor() {
    this.configurarObservablesValidacion();
    this.cargarDatosIniciales();
  }

  // ----------------------------------------
  // Configuración
  // ----------------------------------------
  private configurarObservablesValidacion(): void {
    const usernameControl = this.perfilForm.get('username');
    usernameControl?.statusChanges.subscribe((status) => {
      this.validandoUsername.set(status === 'PENDING');
    });
  }

  private cargarDatosIniciales(): void {
    const datos = this.datosIniciales();
    if (!datos) return;

    this.perfilForm.patchValue({
      nombre: datos.nombre,
      apellidos: datos.apellidos,
      username: datos.username,
      email: datos.email,
      telefono: datos.telefono,
      codigoPostal: datos.codigoPostal,
      bio: datos.bio,
    });

    datos.redesSociales.forEach((red) => {
      this.agregarRedSocial(red);
    });
  }

  // ----------------------------------------
  // Getters tipados
  // ----------------------------------------
  get redesSocialesArray(): FormArray {
    return this.perfilForm.get('redesSociales') as FormArray;
  }

  getControl(campo: CampoPerfil): FormControl {
    return this.perfilForm.get(campo) as FormControl;
  }

  getRedSocialControl(index: number, campo: 'plataforma' | 'url'): FormControl {
    const grupo = this.redesSocialesArray.at(index) as FormGroup;
    return grupo.get(campo) as FormControl;
  }

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  getErrorMessage(campo: CampoPerfil): string {
    const control = this.perfilForm.get(campo);
    if (!control?.touched || !control?.errors) return '';

    const mensajesCampo = MENSAJES_ERROR[campo];
    const tipoError = Object.keys(control.errors)[0];
    return mensajesCampo[tipoError] ?? '';
  }

  getMensajeExito(campo: 'username'): string {
    const control = this.perfilForm.get(campo);
    if (!control?.touched || control?.invalid || control?.pending) return '';
    return '✓ Nombre de usuario disponible';
  }

  estaValidando(campo: 'username'): boolean {
    return campo === 'username' ? this.validandoUsername() : false;
  }

  agregarRedSocial(redInicial?: RedSocial): void {
    const grupo = this.formBuilder.group({
      plataforma: [redInicial?.plataforma ?? 'Instagram', [Validators.required]],
      url: [
        redInicial?.url ?? '',
        [Validators.required, Validators.pattern(/^https?:\/\/.+/)],
      ],
    });

    this.redesSocialesArray.push(grupo);
  }

  eliminarRedSocial(index: number): void {
    this.redesSocialesArray.removeAt(index);
  }

  getErrorMessageRedSocial(index: number, campo: 'plataforma' | 'url'): string {
    const control = this.getRedSocialControl(index, campo);
    if (!control?.touched || !control?.errors) return '';

    if (campo === 'plataforma' && control.errors['required']) {
      return 'Selecciona una plataforma';
    }

    if (campo === 'url' && control.errors['required']) {
      return 'La URL es obligatoria';
    }

    if (campo === 'url' && control.errors['pattern']) {
      return 'URL inválida (debe empezar con http:// o https://)';
    }

    return '';
  }

  onSubmit(): void {
    this.perfilForm.markAllAsTouched();
    if (this.perfilForm.invalid) return;

    const formValue = this.perfilForm.getRawValue();
    this.guardar.emit(formValue);
  }

  onCancelar(): void {
    this.cancelar.emit();
  }
}
