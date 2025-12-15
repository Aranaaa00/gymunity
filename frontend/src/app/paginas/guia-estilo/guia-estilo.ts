import { Component, signal } from '@angular/core';
import { Boton } from '../../componentes/compartidos/boton/boton';
import { Card } from '../../componentes/compartidos/card/card';
import { CardImage } from '../../componentes/compartidos/card-image/card-image';
import { CampoFormulario } from '../../componentes/compartidos/campo-formulario/campo-formulario';
import { AreaTexto } from '../../componentes/compartidos/area-texto/area-texto';
import { Selector, OpcionSelector } from '../../componentes/compartidos/selector/selector';
import { Buscador } from '../../componentes/compartidos/buscador/buscador';
import { Alerta } from '../../componentes/compartidos/alerta/alerta';
import { BotonTema } from '../../componentes/compartidos/boton-tema/boton-tema';
import { Tabs } from '../../componentes/compartidos/tabs/tabs';
import { Spinner } from '../../componentes/compartidos/spinner/spinner';
import { Icono, NombreIcono } from '../../componentes/compartidos/icono/icono';
import { AcordeonItem } from '../../componentes/compartidos/acordeon/acordeon';
import { Breadcrumbs } from '../../componentes/compartidos/breadcrumbs/breadcrumbs';

// ============================================
// CONSTANTES
// ============================================

const PESTANAS_NAVEGACION: readonly string[] = [
  'Botones',
  'Cards',
  'Formularios',
  'Feedback',
  'Navegación',
  'Interactivos',
  'Iconos',
  'Tipografía',
  'Colores',
] as const;

const OPCIONES_DISCIPLINAS: readonly OpcionSelector[] = [
  { valor: 'karate', etiqueta: 'Karate' },
  { valor: 'judo', etiqueta: 'Judo' },
  { valor: 'taekwondo', etiqueta: 'Taekwondo' },
  { valor: 'boxeo', etiqueta: 'Boxeo' },
  { valor: 'muay-thai', etiqueta: 'Muay Thai' },
  { valor: 'bjj', etiqueta: 'Brazilian Jiu-Jitsu' },
] as const;

const ICONOS_DISPONIBLES: readonly NombreIcono[] = [
  'buscar', 'user', 'user-circle', 'bell', 'heart', 'calendar', 
  'map-pin', 'users', 'sol', 'luna', 'email', 'menu', 'chevron-down',
  'settings', 'log-out', 'plus', 'search', 'loader', 'construction',
  'sparkles', 'dumbbell', 'star', 'wallet', 'clock', 'trophy',
  'bar-chart', 'palette', 'lock', 'message-circle', 'check', 'x-circle'
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
    CardImage,
    CampoFormulario,
    AreaTexto,
    Selector,
    Buscador,
    Alerta,
    BotonTema,
    Tabs,
    Spinner,
    Icono,
    AcordeonItem,
    Breadcrumbs,
  ],
  templateUrl: './guia-estilo.html',
  styleUrl: './guia-estilo.scss',
})
export class GuiaEstilo {
  // ----------------------------------------
  // Datos
  // ----------------------------------------
  readonly pestanas = PESTANAS_NAVEGACION;
  readonly opcionesSelector: readonly OpcionSelector[] = OPCIONES_DISCIPLINAS;
  readonly iconosDisponibles = ICONOS_DISPONIBLES;

  // ----------------------------------------
  // Estado
  // ----------------------------------------
  readonly tabActivo = signal<number>(0);
  readonly valorSeleccionado = signal<string>('karate');
  readonly mostrarAlertaInfo = signal<boolean>(true);
  readonly mostrarAlertaSuccess = signal<boolean>(true);
  readonly mostrarAlertaWarning = signal<boolean>(true);
  readonly mostrarAlertaError = signal<boolean>(true);
  readonly cargandoEjemplo = signal<boolean>(false);

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  cambiarTab(indice: number): void {
    this.tabActivo.set(indice);
  }

  simularCarga(): void {
    this.cargandoEjemplo.set(true);
    setTimeout(() => this.cargandoEjemplo.set(false), 2000);
  }

  resetearAlertas(): void {
    this.mostrarAlertaInfo.set(true);
    this.mostrarAlertaSuccess.set(true);
    this.mostrarAlertaWarning.set(true);
    this.mostrarAlertaError.set(true);
  }
}
