import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Boton } from '../../componentes/compartidos/boton/boton';
import { Icono } from '../../componentes/compartidos/icono/icono';

@Component({
  selector: 'app-no-encontrada',
  standalone: true,
  imports: [RouterLink, Boton, Icono],
  templateUrl: './no-encontrada.html',
  styleUrl: './no-encontrada.scss',
})
export class NoEncontrada {}
