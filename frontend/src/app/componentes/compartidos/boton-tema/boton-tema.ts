import { Component, signal } from '@angular/core';
import { Icono } from '../icono/icono';

@Component({
  selector: 'app-boton-tema',
  imports: [Icono],
  templateUrl: './boton-tema.html',
  styleUrl: './boton-tema.scss',
})
export class BotonTema {
  modoOscuro = signal(false);

  constructor() {
    if (typeof window !== 'undefined') {
      const guardado = localStorage.getItem('tema');
      const oscuro = guardado ? guardado === 'oscuro' : window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.modoOscuro.set(oscuro);
      document.documentElement.setAttribute('data-tema', oscuro ? 'oscuro' : 'claro');
    }
  }

  alternar(): void {
    this.modoOscuro.update(v => !v);
    const tema = this.modoOscuro() ? 'oscuro' : 'claro';
    localStorage.setItem('tema', tema);
    document.documentElement.setAttribute('data-tema', tema);
  }
}
