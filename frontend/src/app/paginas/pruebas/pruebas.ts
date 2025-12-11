import { Component, inject, OnInit, OnDestroy, signal, Signal } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  NotificacionService,
  CargaService,
  ComunicacionService,
  EstadoService,
} from '../../servicios';
import { Toast } from '../../componentes/compartidos/toast/toast';
import { CargaGlobal } from '../../componentes/compartidos/carga-global/carga-global';
import { Spinner } from '../../componentes/compartidos/spinner/spinner';
import { Boton } from '../../componentes/compartidos/boton/boton';
import { Acordeon, AcordeonItem } from '../../componentes/compartidos/acordeon/acordeon';
import { Tooltip } from '../../componentes/compartidos/tooltip/tooltip';
import { Tabs } from '../../componentes/compartidos/tabs/tabs';

// ============================================
// CONSTANTES
// ============================================

const EVENTO_MENSAJE_PRUEBA = 'mensaje-prueba';
const CLAVE_CONTADOR = 'contador';
const ID_CARGA_GLOBAL = 'global';
const ID_CARGA_BOTON = 'boton-guardar';

const TIEMPO_CARGA_BOTON_MS = 2000;
const TIEMPO_FINALIZACION_CARGA_MS = 300;
const INTERVALO_PROGRESO_MS = 200;
const INCREMENTO_PROGRESO_MIN = 5;
const INCREMENTO_PROGRESO_MAX = 15;
const PORCENTAJE_COMPLETO = 100;

const MENSAJES_CARGA: readonly string[] = [
  'Cargando recursos...',
  'Procesando datos...',
  'Conectando servicios...',
  'Finalizando...',
] as const;

const PESTANAS_PRUEBAS: readonly string[] = [
  'Notificaciones',
  'Loading',
  'Comunicación',
  'Estado',
  'Acordeón',
  'Tooltips',
] as const;

// ============================================
// COMPONENTE PRUEBAS
// ============================================

@Component({
  selector: 'app-pruebas',
  standalone: true,
  imports: [Toast, CargaGlobal, Spinner, Boton, Acordeon, AcordeonItem, Tooltip, Tabs],
  templateUrl: './pruebas.html',
  styleUrl: './pruebas.scss',
})
export class Pruebas implements OnInit, OnDestroy {
  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly notificacionService = inject(NotificacionService);
  private readonly cargaService = inject(CargaService);
  private readonly comunicacionService = inject(ComunicacionService);
  private readonly estadoService = inject(EstadoService);

  // ----------------------------------------
  // Estado privado
  // ----------------------------------------
  private suscripcion: Subscription | null = null;
  private suscrito = false;

  // ----------------------------------------
  // Estado público
  // ----------------------------------------
  readonly cargandoBoton: Signal<boolean> = this.cargaService.seleccionar(ID_CARGA_BOTON);
  readonly estadoContador: Signal<number | undefined> =
    this.estadoService.seleccionar<number>(CLAVE_CONTADOR);
  readonly mensajeRecibido = signal<string>('');
  readonly tabActivo = signal<number>(0);

  // ----------------------------------------
  // Datos
  // ----------------------------------------
  readonly pestanasPruebas: readonly string[] = PESTANAS_PRUEBAS;

  // ----------------------------------------
  // Lifecycle
  // ----------------------------------------
  ngOnInit(): void {
    this.suscribirseEvento();
  }

  ngOnDestroy(): void {
    this.limpiarSuscripcion();
  }

  // ----------------------------------------
  // Métodos públicos - Notificaciones
  // ----------------------------------------
  mostrarSuccess(): void {
    this.notificacionService.success('Operación completada correctamente');
  }

  mostrarError(): void {
    this.notificacionService.error('Ha ocurrido un error inesperado');
  }

  mostrarWarning(): void {
    this.notificacionService.warning('Atención: revisa los datos introducidos');
  }

  mostrarInfo(): void {
    this.notificacionService.info('Información: hay actualizaciones disponibles');
  }

  // ----------------------------------------
  // Métodos públicos - Carga
  // ----------------------------------------
  simularCargaGlobal(): void {
    this.cargaService.iniciar(ID_CARGA_GLOBAL, 'Iniciando...');
    this.iniciarSimulacionProgreso();
  }

  simularCargaBoton(): void {
    this.cargaService.iniciar(ID_CARGA_BOTON, 'Guardando...');
    this.programarFinalizacionCargaBoton();
  }

  // ----------------------------------------
  // Métodos públicos - Comunicación
  // ----------------------------------------
  emitirEvento(): void {
    const mensaje = `Mensaje enviado a las ${new Date().toLocaleTimeString()}`;
    this.comunicacionService.emitir(EVENTO_MENSAJE_PRUEBA, mensaje);
  }

  // ----------------------------------------
  // Métodos públicos - Estado
  // ----------------------------------------
  incrementarContador(): void {
    const actual = this.estadoService.obtener<number>(CLAVE_CONTADOR) ?? 0;
    const nuevoValor = actual + 1;
    this.estadoService.establecer(CLAVE_CONTADOR, nuevoValor);
  }

  resetearContador(): void {
    this.estadoService.eliminar(CLAVE_CONTADOR);
  }

  // ----------------------------------------
  // Métodos privados
  // ----------------------------------------
  private suscribirseEvento(): void {
    const yaEstaSuscrito = this.suscrito;

    if (yaEstaSuscrito) {
      return;
    }

    this.suscripcion = this.comunicacionService
      .escuchar<string>(EVENTO_MENSAJE_PRUEBA)
      .subscribe((mensaje: string): void => {
        this.mensajeRecibido.set(mensaje);
      });

    this.suscrito = true;
  }

  private limpiarSuscripcion(): void {
    this.suscripcion?.unsubscribe();
  }

  private iniciarSimulacionProgreso(): void {
    let progreso = 0;

    const intervalo = setInterval((): void => {
      progreso += Math.random() * INCREMENTO_PROGRESO_MAX + INCREMENTO_PROGRESO_MIN;

      const completado = progreso >= PORCENTAJE_COMPLETO;

      if (completado) {
        this.finalizarSimulacionProgreso(intervalo);
        return;
      }

      this.actualizarProgreso(progreso);
    }, INTERVALO_PROGRESO_MS);
  }

  private finalizarSimulacionProgreso(intervalo: ReturnType<typeof setInterval>): void {
    this.cargaService.actualizarPorcentaje(
      ID_CARGA_GLOBAL,
      PORCENTAJE_COMPLETO,
      '¡Completado!'
    );
    clearInterval(intervalo);

    setTimeout((): void => {
      this.cargaService.finalizar(ID_CARGA_GLOBAL);
      this.notificacionService.success('Carga completada exitosamente');
    }, TIEMPO_FINALIZACION_CARGA_MS);
  }

  private actualizarProgreso(progreso: number): void {
    const indice = Math.min(
      Math.floor(progreso / 25),
      MENSAJES_CARGA.length - 1
    );
    const mensaje = MENSAJES_CARGA[indice];
    this.cargaService.actualizarPorcentaje(ID_CARGA_GLOBAL, progreso, mensaje);
  }

  private programarFinalizacionCargaBoton(): void {
    setTimeout((): void => {
      this.cargaService.finalizar(ID_CARGA_BOTON);
      this.notificacionService.success('Guardado correctamente');
    }, TIEMPO_CARGA_BOTON_MS);
  }
}
