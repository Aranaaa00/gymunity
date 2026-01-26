import { Component, inject, signal, computed, DestroyRef, ChangeDetectionStrategy, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth';
import { NotificacionService } from '../../servicios/notificacion';
import { ValidadoresAsincronos, MENSAJES_VALIDACION_ASINCRONA } from '../../servicios/validadores-asincronos';
import { calcularFuerzaPassword, ResultadoFuerza } from '../../servicios/fuerza-password';
import { Boton } from '../../componentes/compartidos/boton/boton';
import { CampoFormulario } from '../../componentes/compartidos/campo-formulario/campo-formulario';
import { ComponenteConCambios } from '../../guards/cambios-sin-guardar.guard';
import { Icono } from '../../componentes/compartidos/icono/icono';

// ============================================
// CONSTANTES
// ============================================

const LONGITUD_MINIMA_USERNAME = 3;
const LONGITUD_MAXIMA_USERNAME = 20;
const PATRON_USERNAME = /^[a-zA-Z0-9_]+$/;
const PATRON_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const LONGITUD_MINIMA_PASSWORD = 6;
const TIPOS_IMAGEN_VALIDOS = ['image/jpeg', 'image/png', 'image/webp'];
const CALIDAD_COMPRESION = 0.8;
const DIMENSION_MAXIMA = 400;

const MENSAJES_ERROR = {
  username: {
    required: 'El nombre de usuario es obligatorio',
    minlength: `Mínimo ${LONGITUD_MINIMA_USERNAME} caracteres`,
    maxlength: `Máximo ${LONGITUD_MAXIMA_USERNAME} caracteres`,
    pattern: 'Solo letras, números y guión bajo. Ejemplo: juan_perez123',
    usernameNoDisponible: MENSAJES_VALIDACION_ASINCRONA.usernameNoDisponible,
  },
  email: {
    required: 'El email es obligatorio',
    pattern: 'El email debe tener formato válido. Ejemplo: usuario@gmail.com',
    emailNoDisponible: MENSAJES_VALIDACION_ASINCRONA.emailNoDisponible,
  },
  ciudad: {
    required: 'La ciudad es obligatoria',
    minlength: 'Mínimo 2 caracteres',
    maxlength: 'Máximo 100 caracteres',
    ciudadNoExiste: MENSAJES_VALIDACION_ASINCRONA.ciudadNoExiste,
  },
  contraseniaActual: {
    required: 'Introduce tu contraseña actual',
    minlength: `Mínimo ${LONGITUD_MINIMA_PASSWORD} caracteres`,
  },
  contraseniaNueva: {
    required: 'Introduce la nueva contraseña',
    minlength: `Mínimo ${LONGITUD_MINIMA_PASSWORD} caracteres`,
  },
  confirmarContrasenia: {
    required: 'Confirma la nueva contraseña',
    noCoincide: 'Las contraseñas no coinciden. Asegúrate de escribir la misma',
  },
} as const;

type CampoPerfil = 'username' | 'email' | 'ciudad';
type CampoPassword = 'contraseniaActual' | 'contraseniaNueva' | 'confirmarContrasenia';

// ============================================
// COMPONENTE
// ============================================

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [ReactiveFormsModule, Boton, CampoFormulario, Icono],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Configuracion implements ComponenteConCambios, OnInit {
  private readonly authService = inject(AuthService);
  private readonly notificacionService = inject(NotificacionService);
  private readonly validadoresAsincronos = inject(ValidadoresAsincronos);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly plataformaId = inject(PLATFORM_ID);

  // ----------------------------------------
  // Estado
  // ----------------------------------------
  readonly usuario = this.authService.usuario;
  readonly cargando = this.authService.cargando;
  
  readonly validandoUsername = signal(false);
  readonly validandoEmail = signal(false);
  readonly validandoCiudad = signal(false);
  
  readonly mostrarConfirmacionEliminar = signal(false);
  readonly avatarPreview = signal<string | null>(null);
  readonly errorEliminar = signal<string | null>(null);
  
  readonly guardandoPerfil = signal(false);
  readonly guardandoPassword = signal(false);
  readonly guardandoAvatar = signal(false);
  
  private readonly cambiosPerfil = signal(false);
  private readonly avatarCambiado = signal(false);
  
  private readonly perfilFormValido = signal(true);
  private readonly passwordFormValido = signal(false);
  private readonly passwordNuevaValue = signal('');
  
  private valoresIniciales = { username: '', email: '', ciudad: '' };

  // ----------------------------------------
  // Formularios (se inicializan en ngOnInit con valores actuales)
  // ----------------------------------------
  perfilForm!: FormGroup;
  
  readonly passwordForm: FormGroup = this.formBuilder.group({
    contraseniaActual: ['', [Validators.required, Validators.minLength(LONGITUD_MINIMA_PASSWORD)]],
    contraseniaNueva: ['', [Validators.required, Validators.minLength(LONGITUD_MINIMA_PASSWORD)]],
    confirmarContrasenia: ['', [Validators.required]],
  });

  // ----------------------------------------
  // Computed
  // ----------------------------------------
  readonly avatarActual = computed(() => {
    const preview = this.avatarPreview();
    if (preview) return preview;
    return this.usuario()?.avatar ?? null;
  });

  readonly tieneAvatar = computed(() => this.avatarActual() !== null);

  readonly puedeGuardarPerfil = computed(() => {
    if (!this.perfilForm) return false;
    
    const hayCambios = this.cambiosPerfil();
    const noGuardando = !this.guardandoPerfil();
    const formValido = this.perfilFormValido();
    
    if (!hayCambios) return false;
    if (!noGuardando) return false;
    
    return formValido;
  });

  readonly puedeGuardarAvatar = computed(() => {
    return this.avatarCambiado() && !this.guardandoAvatar();
  });

  readonly puedeGuardarPassword = computed(() => {
    return this.passwordFormValido() && !this.guardandoPassword();
  });

  readonly textoConfirmacion = computed(() => this.usuario()?.nombreUsuario ?? '');

  readonly fuerzaPassword = computed((): ResultadoFuerza => {
    return calcularFuerzaPassword(this.passwordNuevaValue());
  });

  readonly contraseniasCoinciden = computed(() => {
    const nueva = this.contraseniaNuevaControl?.value ?? '';
    const confirmar = this.confirmarContraseniaControl?.value ?? '';
    if (!nueva || !confirmar) return true;
    return nueva === confirmar;
  });

  // ----------------------------------------
  // Lifecycle
  // ----------------------------------------
  ngOnInit(): void {
    this.inicializarFormularios();
  }

  // ----------------------------------------
  // Guard
  // ----------------------------------------
  tieneCambiosSinGuardar(): boolean {
    return this.cambiosPerfil() || this.avatarCambiado();
  }

  // ----------------------------------------
  // Getters de controles
  // ----------------------------------------
  get usernameControl(): FormControl {
    return this.perfilForm.get('username') as FormControl;
  }

  get emailControl(): FormControl {
    return this.perfilForm.get('email') as FormControl;
  }

  get ciudadControl(): FormControl {
    return this.perfilForm.get('ciudad') as FormControl;
  }

  get contraseniaActualControl(): FormControl {
    return this.passwordForm.get('contraseniaActual') as FormControl;
  }

  get contraseniaNuevaControl(): FormControl {
    return this.passwordForm.get('contraseniaNueva') as FormControl;
  }

  get confirmarContraseniaControl(): FormControl {
    return this.passwordForm.get('confirmarContrasenia') as FormControl;
  }

  // ----------------------------------------
  // Métodos públicos - Errores
  // ----------------------------------------
  getErrorPerfil(campo: CampoPerfil): string {
    const control = this.perfilForm.get(campo);
    if (!control?.touched || !control?.errors) return '';
    const mensajes = MENSAJES_ERROR[campo];
    const tipoError = Object.keys(control.errors)[0];
    return mensajes[tipoError as keyof typeof mensajes] ?? '';
  }

  getErrorPassword(campo: CampoPassword): string {
    const control = this.passwordForm.get(campo);
    if (!control?.touched || !control?.errors) {
      if (campo === 'confirmarContrasenia' && control?.touched && control?.value) {
        const noCoincide = control.value !== this.contraseniaNuevaControl.value;
        if (noCoincide) return MENSAJES_ERROR.confirmarContrasenia.noCoincide;
      }
      return '';
    }

    const mensajes = MENSAJES_ERROR[campo];
    const tipoError = Object.keys(control.errors)[0];
    return mensajes[tipoError as keyof typeof mensajes] ?? '';
  }

  getMensajeCoincidencia(): string {
    const nueva = this.contraseniaNuevaControl?.value ?? '';
    const confirmar = this.confirmarContraseniaControl?.value ?? '';
    if (!confirmar || !nueva) return '';
    if (nueva === confirmar) return '✓ Las contraseñas coinciden';
    return '';
  }

  getMensajeExitoPerfil(campo: CampoPerfil): string {
    const control = this.perfilForm.get(campo);
    if (!control?.touched || control?.invalid || control?.pending) return '';

    if (campo === 'username' && control.value !== this.valoresIniciales.username) {
      return '✓ Disponible';
    }
    if (campo === 'email' && control.value !== this.valoresIniciales.email) {
      return '✓ Email disponible';
    }
    if (campo === 'ciudad' && control.valid) {
      return '✓ Ciudad válida';
    }
    return '';
  }

  estaValidando(campo: 'username' | 'email' | 'ciudad'): boolean {
    if (campo === 'username') return this.validandoUsername();
    if (campo === 'email') return this.validandoEmail();
    return this.validandoCiudad();
  }

  // ----------------------------------------
  // Métodos públicos - Avatar
  // ----------------------------------------
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!archivo) return;

    if (!TIPOS_IMAGEN_VALIDOS.includes(archivo.type)) {
      this.notificacionService.error('Formato no válido. Usa JPG, PNG o WebP');
      input.value = '';
      return;
    }

    this.comprimirImagen(archivo);
    input.value = '';
  }

  guardarAvatar(): void {
    if (!this.puedeGuardarAvatar()) return;

    const avatar = this.avatarPreview();
    if (!avatar) return;

    this.guardandoAvatar.set(true);

    this.authService.actualizarPerfil({ avatar })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (exito) => {
          this.guardandoAvatar.set(false);
          if (exito) {
            this.authService.actualizarAvatar(avatar);
            this.notificacionService.success('Foto de perfil actualizada');
            this.avatarCambiado.set(false);
            this.avatarPreview.set(null);
          } else {
            const errorMsg = this.authService.error() ?? 'Error al guardar';
            this.notificacionService.error(errorMsg);
          }
        },
        error: () => {
          this.guardandoAvatar.set(false);
          this.notificacionService.error('Error de conexión');
        },
      });
  }

  // ----------------------------------------
  // Métodos públicos - Guardar perfil
  // ----------------------------------------
  guardarPerfil(): void {
    // Verificar si hay cambios
    if (!this.cambiosPerfil()) {
      this.notificacionService.info('No hay cambios que guardar');
      return;
    }

    // Verificar si está validando
    if (this.perfilForm.status === 'PENDING') {
      this.notificacionService.warning('Espera a que termine la validación');
      return;
    }

    // Verificar validez del formulario
    if (!this.perfilFormValido()) {
      this.perfilForm.markAllAsTouched();
      this.notificacionService.error('Corrige los errores del formulario');
      return;
    }

    if (this.guardandoPerfil()) return;

    this.guardandoPerfil.set(true);

    const datos: { nombreUsuario?: string; email?: string; ciudad?: string } = {};

    if (this.usernameControl.value !== this.valoresIniciales.username) {
      datos.nombreUsuario = this.usernameControl.value;
    }
    if (this.emailControl.value !== this.valoresIniciales.email) {
      datos.email = this.emailControl.value;
    }
    if (this.ciudadControl.value !== this.valoresIniciales.ciudad) {
      datos.ciudad = this.ciudadControl.value;
    }

    if (Object.keys(datos).length === 0) {
      this.guardandoPerfil.set(false);
      return;
    }

    this.authService.actualizarPerfil(datos)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (exito) => {
          this.guardandoPerfil.set(false);
          if (exito) {
            this.notificacionService.success('Perfil actualizado correctamente');
            this.actualizarValoresIniciales();
            this.cambiosPerfil.set(false);
          } else {
            const errorMsg = this.authService.error() ?? 'Error al guardar';
            this.notificacionService.error(errorMsg);
          }
        },
        error: () => {
          this.guardandoPerfil.set(false);
          this.notificacionService.error('Error de conexión');
        },
      });
  }

  // ----------------------------------------
  // Métodos públicos - Cambiar contraseña
  // ----------------------------------------
  cambiarContrasenia(): void {
    this.passwordForm.markAllAsTouched();

    if (this.passwordForm.invalid) return;
    if (!this.puedeGuardarPassword()) return;

    this.guardandoPassword.set(true);

    this.authService.cambiarContrasenia(
      this.contraseniaActualControl.value,
      this.contraseniaNuevaControl.value
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (exito) => {
          this.guardandoPassword.set(false);
          if (exito) {
            this.notificacionService.success('Contraseña actualizada correctamente');
            this.passwordForm.reset();
          } else {
            const errorMsg = this.authService.error() ?? 'Contraseña actual incorrecta';
            this.notificacionService.error(errorMsg);
          }
        },
        error: () => {
          this.guardandoPassword.set(false);
          this.notificacionService.error('Error de conexión');
        },
      });
  }

  // ----------------------------------------
  // Métodos públicos - Eliminar cuenta
  // ----------------------------------------
  toggleConfirmacionEliminar(): void {
    this.mostrarConfirmacionEliminar.update(v => !v);
    this.errorEliminar.set(null);
  }

  confirmarEliminacion(inputConfirmacion: HTMLInputElement): void {
    const valor = inputConfirmacion.value.trim().toLowerCase();
    const nombreUsuario = (this.usuario()?.nombreUsuario ?? '').toLowerCase();

    if (valor !== nombreUsuario) {
      this.errorEliminar.set('El nombre de usuario no coincide');
      return;
    }

    this.authService.eliminarCuenta()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (exito) => {
          if (exito) {
            this.notificacionService.success('Cuenta eliminada correctamente');
            this.router.navigate(['/']);
          } else {
            const errorMsg = this.authService.error() ?? 'Error al eliminar';
            this.errorEliminar.set(errorMsg);
            this.notificacionService.error(errorMsg);
          }
        },
        error: () => {
          this.errorEliminar.set('Error de conexión');
          this.notificacionService.error('Error de conexión');
        },
      });
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
  }

  // ----------------------------------------
  // Métodos privados
  // ----------------------------------------
  private inicializarFormularios(): void {
    const usuario = this.usuario();
    const usernameActual = usuario?.nombreUsuario ?? '';
    const emailActual = usuario?.email ?? '';
    const ciudadActual = usuario?.ciudad ?? '';

    this.valoresIniciales = {
      username: usernameActual,
      email: emailActual,
      ciudad: ciudadActual,
    };

    this.perfilForm = this.formBuilder.group({
      username: [
        usernameActual,
        [
          Validators.required,
          Validators.minLength(LONGITUD_MINIMA_USERNAME),
          Validators.maxLength(LONGITUD_MAXIMA_USERNAME),
          Validators.pattern(PATRON_USERNAME),
        ],
        [this.validadoresAsincronos.usernameUnico(usernameActual)],
      ],
      email: [
        emailActual,
        [Validators.required, Validators.pattern(PATRON_EMAIL)],
        [this.validadoresAsincronos.emailUnico(emailActual)],
      ],
      ciudad: [
        ciudadActual,
        [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
        [this.validadoresAsincronos.ciudadExiste()],
      ],
    });

    this.configurarObservables();
  }

  private actualizarValoresIniciales(): void {
    this.valoresIniciales = {
      username: this.usernameControl.value,
      email: this.emailControl.value,
      ciudad: this.ciudadControl.value,
    };
  }

  private configurarObservables(): void {
    this.perfilForm.get('username')?.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(status => this.validandoUsername.set(status === 'PENDING'));

    this.perfilForm.get('email')?.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(status => this.validandoEmail.set(status === 'PENDING'));

    this.perfilForm.get('ciudad')?.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(status => this.validandoCiudad.set(status === 'PENDING'));

    this.perfilForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const usernameDistinto = this.usernameControl.value !== this.valoresIniciales.username;
        const emailDistinto = this.emailControl.value !== this.valoresIniciales.email;
        const ciudadDistinta = this.ciudadControl.value !== this.valoresIniciales.ciudad;
        this.cambiosPerfil.set(usernameDistinto || emailDistinto || ciudadDistinta);
        
        // Actualizar validez del formulario
        this.actualizarValidezFormulario();
      });

    // También escuchar statusChanges del formulario completo
    this.perfilForm.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.actualizarValidezFormulario());

    // Escuchar cambios en el formulario de contraseña
    this.passwordForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.passwordNuevaValue.set(this.contraseniaNuevaControl.value ?? '');
        this.actualizarValidezPasswordForm();
      });

    this.passwordForm.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.actualizarValidezPasswordForm());
  }

  private actualizarValidezPasswordForm(): void {
    const formValido = this.passwordForm.valid;
    const contraseniaActual = this.contraseniaActualControl.value;
    const contraseniaNueva = this.contraseniaNuevaControl.value;
    const confirmar = this.confirmarContraseniaControl.value;
    
    const hayContenido = !!contraseniaActual && !!contraseniaNueva && !!confirmar;
    const contraseniasCoinciden = contraseniaNueva === confirmar;
    
    this.passwordFormValido.set(formValido && hayContenido && contraseniasCoinciden);
  }

  private actualizarValidezFormulario(): void {
    const formStatus = this.perfilForm.status;
    
    // Si está pendiente, no es válido aún
    if (formStatus === 'PENDING') {
      this.perfilFormValido.set(false);
      return;
    }
    
    // Verificar cada campo individualmente
    const usernameActual = this.perfilForm.get('username')?.value ?? '';
    const emailActual = this.perfilForm.get('email')?.value ?? '';
    const ciudadActual = this.perfilForm.get('ciudad')?.value ?? '';
    
    const usernameNoModificado = usernameActual === this.valoresIniciales.username;
    const emailNoModificado = emailActual === this.valoresIniciales.email;
    const ciudadNoModificada = ciudadActual === this.valoresIniciales.ciudad;
    
    const usernameValido = usernameNoModificado || (this.perfilForm.get('username')?.valid ?? false);
    const emailValido = emailNoModificado || (this.perfilForm.get('email')?.valid ?? false);
    const ciudadValida = ciudadNoModificada || (this.perfilForm.get('ciudad')?.valid ?? false);
    
    this.perfilFormValido.set(usernameValido && emailValido && ciudadValida);
  }

  private comprimirImagen(archivo: File): void {
    if (!isPlatformBrowser(this.plataformaId)) return;

    const img = new Image();
    const url = URL.createObjectURL(archivo);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      let ancho = img.width;
      let alto = img.height;

      if (ancho > alto && ancho > DIMENSION_MAXIMA) {
        alto = (alto * DIMENSION_MAXIMA) / ancho;
        ancho = DIMENSION_MAXIMA;
      } else if (alto > DIMENSION_MAXIMA) {
        ancho = (ancho * DIMENSION_MAXIMA) / alto;
        alto = DIMENSION_MAXIMA;
      }

      canvas.width = ancho;
      canvas.height = alto;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, ancho, alto);
      const resultado = canvas.toDataURL('image/webp', CALIDAD_COMPRESION);

      this.avatarPreview.set(resultado);
      this.avatarCambiado.set(true);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      this.notificacionService.error('No se pudo procesar la imagen');
    };

    img.src = url;
  }
}
