import { Component, signal } from '@angular/core';
import { Boton } from '../../componentes/compartidos/boton/boton';
import { Card } from '../../componentes/compartidos/card/card';
import { CampoFormulario } from '../../componentes/compartidos/campo-formulario/campo-formulario';
import { AreaTexto } from '../../componentes/compartidos/area-texto/area-texto';
import { Selector, OpcionSelector } from '../../componentes/compartidos/selector/selector';
import { Buscador } from '../../componentes/compartidos/buscador/buscador';
import { Alerta } from '../../componentes/compartidos/alerta/alerta';
import { Notificacion } from '../../componentes/compartidos/notificacion/notificacion';
import { BotonTema } from '../../componentes/compartidos/boton-tema/boton-tema';
import { Tabs } from '../../componentes/compartidos/tabs/tabs';
import { Tooltip } from '../../componentes/compartidos/tooltip/tooltip';

// ============================================
// CONSTANTES
// ============================================

const TIEMPO_NOTIFICACION_MS = 5000;

const OPCIONES_DISCIPLINAS: readonly OpcionSelector[] = [
  { valor: 'karate', etiqueta: 'Karate' },
  { valor: 'judo', etiqueta: 'Judo' },
  { valor: 'taekwondo', etiqueta: 'Taekwondo' },
  { valor: 'boxeo', etiqueta: 'Boxeo' },
  { valor: 'muay-thai', etiqueta: 'Muay Thai' },
  { valor: 'bjj', etiqueta: 'Brazilian Jiu-Jitsu' },
  { valor: 'kung-fu', etiqueta: 'Kung Fu' },
] as const;

// ============================================
// COMPONENTE GUÍA DE ESTILO
// ============================================

@Component({
  selector: 'app-guia-estilo',
  standalone: true,
  imports: [
    Boton,
    Card,
    CampoFormulario,
    AreaTexto,
    Selector,
    Buscador,
    Alerta,
    Notificacion,
    BotonTema,
    Tabs,
    Tooltip,
  ],
  templateUrl: './guia-estilo.html',
  styleUrl: './guia-estilo.scss',
})
export class GuiaEstilo {
  // ----------------------------------------
  // Datos
  // ----------------------------------------
  readonly opcionesSelector: readonly OpcionSelector[] = OPCIONES_DISCIPLINAS;

  // ----------------------------------------
  // Estado
  // ----------------------------------------
  readonly valorSeleccionado = signal<string>('karate');
  readonly mostrarNotificacion = signal<boolean>(false);
  readonly mostrarAlertaInfo = signal<boolean>(true);
  readonly mostrarAlertaSuccess = signal<boolean>(true);
  readonly mostrarAlertaWarning = signal<boolean>(true);
  readonly mostrarAlertaError = signal<boolean>(true);

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  lanzarNotificacion(): void {
    this.mostrarNotificacion.set(true);
    this.iniciarTemporizadorNotificacion();
  }

  // ----------------------------------------
  // Métodos privados
  // ----------------------------------------
  private iniciarTemporizadorNotificacion(): void {
    setTimeout((): void => {
      this.mostrarNotificacion.set(false);
    }, TIEMPO_NOTIFICACION_MS);
  }
}
