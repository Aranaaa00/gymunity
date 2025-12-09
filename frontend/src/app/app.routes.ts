import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./paginas/inicio/inicio').then(m => m.Inicio) },
  {
    path: 'guia-estilo',
    loadComponent: () => import('./paginas/guia-estilo/guia-estilo').then(m => m.GuiaEstilo),
  },
];
