import { Routes } from '@angular/router';
import { autenticacionGuard } from './guards/autenticacion.guard';
import { cambiosSinGuardarGuard } from './guards/cambios-sin-guardar.guard';
import { gimnasioResolver } from './resolvers/gimnasio.resolver';

// ============================================
// CONFIGURACIÓN DE RUTAS
// ============================================

export const routes: Routes = [
  // ----------------------------------------
  // Inicio
  // ----------------------------------------
  {
    path: '',
    loadComponent: () => import('./paginas/inicio/inicio').then((m) => m.Inicio),
    data: { breadcrumb: 'Inicio' },
  },

  // ----------------------------------------
  // Búsqueda
  // ----------------------------------------
  {
    path: 'busqueda',
    loadComponent: () => import('./paginas/busqueda/busqueda').then((m) => m.Busqueda),
    data: { breadcrumb: 'Búsqueda' },
  },

  // ----------------------------------------
  // Gimnasio (con parámetro y resolver)
  // ----------------------------------------
  {
    path: 'gimnasio/:id',
    loadComponent: () => import('./paginas/gimnasio/gimnasio').then((m) => m.GimnasioPage),
    resolve: {
      gimnasio: gimnasioResolver,
    },
    data: { breadcrumb: 'Gimnasio' },
  },

  // ----------------------------------------
  // Perfil (protegido con guard)
  // ----------------------------------------
  {
    path: 'perfil',
    loadComponent: () => import('./paginas/perfil/perfil').then((m) => m.Perfil),
    canActivate: [autenticacionGuard],
    canDeactivate: [cambiosSinGuardarGuard],
    data: { breadcrumb: 'Mi Perfil' },
  },

  // ----------------------------------------
  // Configuración (protegido con guard y canDeactivate)
  // ----------------------------------------
  {
    path: 'configuracion',
    loadComponent: () => import('./paginas/configuracion/configuracion').then((m) => m.Configuracion),
    canActivate: [autenticacionGuard],
    canDeactivate: [cambiosSinGuardarGuard],
    data: { breadcrumb: 'Configuración' },
  },

  // ----------------------------------------
  // Guía de estilo (desarrollo)
  // ----------------------------------------
  {
    path: 'guia-estilo',
    loadComponent: () => import('./paginas/guia-estilo/guia-estilo').then((m) => m.GuiaEstilo),
    data: { breadcrumb: 'Guía de Estilo' },
  },

  // ----------------------------------------
  // 404 - Wildcard (DEBE IR AL FINAL)
  // ----------------------------------------
  {
    path: '**',
    loadComponent: () => import('./paginas/no-encontrada/no-encontrada').then((m) => m.NoEncontrada),
  },
];

