import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Rutas que dependen de API o estado del usuario - renderizar en cliente
  {
    path: '',
    renderMode: RenderMode.Client
  },
  {
    path: 'gimnasio/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'busqueda',
    renderMode: RenderMode.Client
  },
  {
    path: 'perfil',
    renderMode: RenderMode.Client
  },
  {
    path: 'configuracion',
    renderMode: RenderMode.Client
  },
  {
    path: 'consejos',
    renderMode: RenderMode.Client
  },
  // Rutas estáticas - prerenderizar
  {
    path: 'guia-estilo',
    renderMode: RenderMode.Prerender
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
