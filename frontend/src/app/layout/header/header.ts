import { Component, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Boton } from '../../componentes/compartidos/boton/boton';
import { Buscador } from '../../componentes/compartidos/buscador/buscador';
import { BotonTema } from '../../componentes/compartidos/boton-tema/boton-tema';
import { Icono } from '../../componentes/compartidos/icono/icono';

@Component({
  selector: 'app-header',
  imports: [RouterLink, Boton, Buscador, BotonTema, Icono],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Output() abrirLogin = new EventEmitter<void>();
  @Output() abrirRegistro = new EventEmitter<void>();
  
  menuAbierto = false;
  
  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }
  
  cerrarMenu(): void {
    this.menuAbierto = false;
  }
  
  onBuscar(termino: string): void {
    console.log('Buscando:', termino);
  }
}
