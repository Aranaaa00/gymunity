import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Icono } from '../../componentes/compartidos/icono/icono';

@Component({
  selector: 'app-footer',
  imports: [Icono],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {}
