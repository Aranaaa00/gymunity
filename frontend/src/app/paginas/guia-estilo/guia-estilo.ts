import { Component } from '@angular/core';
import { Boton } from '../../componentes/compartidos/boton/boton';
import { Card } from '../../componentes/compartidos/card/card';
import { CampoFormulario } from '../../componentes/compartidos/campo-formulario/campo-formulario';
import { AreaTexto } from '../../componentes/compartidos/area-texto/area-texto';
import { Selector, OpcionSelector } from '../../componentes/compartidos/selector/selector';
import { Buscador } from '../../componentes/compartidos/buscador/buscador';
import { Alerta } from '../../componentes/compartidos/alerta/alerta';
import { Notificacion } from '../../componentes/compartidos/notificacion/notificacion';
import { BotonTema } from '../../componentes/compartidos/boton-tema/boton-tema';

@Component({
  selector: 'app-guia-estilo',
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
  ],
  templateUrl: './guia-estilo.html',
  styleUrl: './guia-estilo.scss',
})
export class GuiaEstilo {
  opcionesSelector: OpcionSelector[] = [
    { valor: 'karate', etiqueta: 'Karate' },
    { valor: 'judo', etiqueta: 'Judo' },
    { valor: 'taekwondo', etiqueta: 'Taekwondo' },
    { valor: 'boxeo', etiqueta: 'Boxeo' },
    { valor: 'muay-thai', etiqueta: 'Muay Thai' },
    { valor: 'bjj', etiqueta: 'Brazilian Jiu-Jitsu' },
    { valor: 'kung-fu', etiqueta: 'Kung Fu' },
  ];

  valorSeleccionado = 'karate';
  mostrarNotificacion = false;
  mostrarAlertaInfo = true;
  mostrarAlertaSuccess = true;
  mostrarAlertaWarning = true;
  mostrarAlertaError = true;

  lanzarNotificacion(): void {
    this.mostrarNotificacion = true;
    setTimeout(() => {
      this.mostrarNotificacion = false;
    }, 5000);
  }
}
